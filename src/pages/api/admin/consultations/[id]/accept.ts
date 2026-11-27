export const prerender = false;

import type { APIRoute } from 'astro';
import { verifyAdminRequest, jsonResponse } from '../../../../../lib/auth';
import { getSupabaseServerClient } from '../../../../../lib/supabase';
import { sendPatientAppointmentConfirmation } from '../../../../../lib/mailer';
import { sanitizeInput } from '../../../../../lib/security';

export const POST: APIRoute = async ({ request, params }) => {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) {
    return jsonResponse({ success: false, error: auth.error }, auth.status || 401);
  }

  const { id } = params;
  if (!id) {
    return jsonResponse({ success: false, error: 'Missing consultation ID parameter.' }, 400);
  }

  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // Body is optional if no note provided
    }

    const checkConfirmed = Boolean(body.check_confirmed);
    const adminNote = sanitizeInput(body.admin_note, 1000);

    if (!checkConfirmed) {
      return jsonResponse(
        {
          success: false,
          error: 'Please confirm that you have checked clinic slot availability before accepting.',
        },
        400
      );
    }

    const supabase = getSupabaseServerClient();

    // 1. Fetch current record
    const { data: current, error: fetchError } = await supabase
      .from('consultation_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !current) {
      console.error('[Admin Accept Fetch Error]:', fetchError?.code, fetchError?.message);
      return jsonResponse(
        { success: false, error: fetchError ? `Database query failed: ${fetchError.message}` : 'Consultation request not found.' },
        fetchError ? 500 : 404
      );
    }

    // 2. Concurrency & Status Validation
    if (current.status === 'confirmed') {
      return jsonResponse(
        {
          success: false,
          error: `This appointment has already been confirmed (by ${current.reviewed_by || 'staff'}).`,
        },
        400
      );
    }

    if (current.status === 'completed' || current.status === 'rejected') {
      return jsonResponse(
        {
          success: false,
          error: `Cannot accept an appointment that is already marked as ${current.status}.`,
        },
        400
      );
    }

    const now = new Date().toISOString();

    // 3. Atomically update status to 'confirmed' with optimistic concurrency check
    const { data: updated, error: updateError } = await supabase
      .from('consultation_requests')
      .update({
        status: 'confirmed',
        confirmed_at: now,
        reviewed_by: auth.user!.email,
        admin_note: adminNote || current.admin_note || null,
      })
      .eq('id', id)
      .eq('status', current.status) // Concurrency guard: only update if status is still what we inspected
      .select('*')
      .single();

    if (updateError || !updated) {
      console.error('[Admin Accept Update Error]:', updateError?.code, updateError?.message);
      return jsonResponse(
        {
          success: false,
          error: updateError ? `Database update failed: ${updateError.message}` : 'Concurrency conflict: this consultation was modified by another user. Please refresh.',
        },
        updateError ? 500 : 409
      );
    }

    // 4. Send Confirmation Email to Patient via SMTP
    let emailSent = false;
    let emailError: string | null = null;

    if (!updated.email) {
      emailError = 'No patient email provided on intake. Confirmation email was not sent.';
      await supabase
        .from('consultation_requests')
        .update({ confirmation_email_error: emailError })
        .eq('id', id);
    } else {
      const emailResult = await sendPatientAppointmentConfirmation({
        patient_name: updated.patient_name,
        patient_email: updated.email,
        consultation_type: updated.consultation_type,
        confirmed_date: updated.preferred_date,
        confirmed_time: updated.preferred_time,
        admin_note: adminNote || null,
      });

      if (emailResult.success) {
        emailSent = true;
        await supabase
          .from('consultation_requests')
          .update({
            confirmation_email_sent_at: new Date().toISOString(),
            confirmation_email_error: null,
          })
          .eq('id', id);
      } else {
        emailError = emailResult.error || 'Failed to dispatch email notification via SMTP.';
        console.warn(`[Accept Email Failed] Record ${id}:`, emailError);
        // Do NOT revert the appointment status; retain 'confirmed' but record error
        await supabase
          .from('consultation_requests')
          .update({ confirmation_email_error: emailError })
          .eq('id', id);
      }
    }

    // Fetch the final record to return updated timestamps
    const { data: finalRecord } = await supabase
      .from('consultation_requests')
      .select('*')
      .eq('id', id)
      .single();

    return jsonResponse({
      success: true,
      message: 'Consultation request accepted successfully.',
      record: finalRecord || updated,
      emailSent,
      emailError,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Admin Accept Consultation Exception]:', msg);
    return jsonResponse({ success: false, error: 'Internal server error while accepting appointment.' }, 500);
  }
};
