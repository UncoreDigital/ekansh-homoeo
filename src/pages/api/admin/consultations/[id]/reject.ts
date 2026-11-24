export const prerender = false;

import type { APIRoute } from 'astro';
import { verifyAdminRequest, jsonResponse } from '../../../../../lib/auth';
import { getSupabaseServerClient } from '../../../../../lib/supabase';
import { sendPatientAppointmentRejection } from '../../../../../lib/resend';
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
      // Body is optional
    }

    const adminNote = sanitizeInput(body.admin_note, 1000);

    const supabase = getSupabaseServerClient();

    // 1. Fetch current record
    const { data: current, error: fetchError } = await supabase
      .from('consultation_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !current) {
      console.error('[Admin Reject Fetch Error]:', fetchError?.code, fetchError?.message);
      return jsonResponse(
        { success: false, error: fetchError ? `Database query failed: ${fetchError.message}` : 'Consultation request not found.' },
        fetchError ? 500 : 404
      );
    }

    if (current.status === 'completed') {
      return jsonResponse(
        {
          success: false,
          error: 'Cannot reject an appointment that has already been completed.',
        },
        400
      );
    }

    const now = new Date().toISOString();

    // 2. Update status to 'rejected'
    const { data: updated, error: updateError } = await supabase
      .from('consultation_requests')
      .update({
        status: 'rejected',
        rejected_at: now,
        reviewed_by: auth.user!.email,
        admin_note: adminNote || current.admin_note || null,
      })
      .eq('id', id)
      .select('*')
      .single();

    if (updateError || !updated) {
      console.error('[Admin Reject Update Error]:', updateError?.code, updateError?.message);
      return jsonResponse({ success: false, error: `Failed to update consultation status: ${updateError?.message || 'Update failed'}` }, 500);
    }

    // 3. Dispatch Polite Rejection Email to Patient via Resend
    let emailSent = false;
    let emailError: string | null = null;

    if (!updated.email) {
      emailError = 'No patient email provided on intake. Rejection email was not sent.';
      await supabase
        .from('consultation_requests')
        .update({ rejection_email_error: emailError })
        .eq('id', id);
    } else {
      const emailResult = await sendPatientAppointmentRejection({
        patient_name: updated.patient_name,
        patient_email: updated.email,
        consultation_type: updated.consultation_type,
        requested_date: updated.preferred_date,
        requested_time: updated.preferred_time,
        admin_note: adminNote || updated.admin_note || null,
      });

      if (emailResult.success) {
        emailSent = true;
        await supabase
          .from('consultation_requests')
          .update({
            rejection_email_sent_at: new Date().toISOString(),
            rejection_email_error: null,
          })
          .eq('id', id);
      } else {
        emailError = emailResult.error || 'Failed to dispatch rejection email notification via Resend.';
        console.warn(`[Reject Email Failed] Record ${id}:`, emailError);
        // Do NOT revert the appointment status; retain 'rejected' but record error
        await supabase
          .from('consultation_requests')
          .update({ rejection_email_error: emailError })
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
      message: 'Consultation request rejected.',
      record: finalRecord || updated,
      emailSent,
      emailError,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Admin Reject Consultation Exception]:', msg);
    return jsonResponse({ success: false, error: 'Internal server error while rejecting appointment.' }, 500);
  }
};
