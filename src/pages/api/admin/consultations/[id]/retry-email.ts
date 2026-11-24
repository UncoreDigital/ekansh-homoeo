export const prerender = false;

import type { APIRoute } from 'astro';
import { verifyAdminRequest, jsonResponse } from '../../../../../lib/auth';
import { getSupabaseServerClient } from '../../../../../lib/supabase';
import {
  sendPatientAppointmentConfirmation,
  sendPatientAppointmentRejection,
} from '../../../../../lib/resend';

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
    const supabase = getSupabaseServerClient();

    // 1. Fetch record
    const { data: record, error: fetchError } = await supabase
      .from('consultation_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !record) {
      console.error('[Admin Retry Email Fetch Error]:', fetchError?.code, fetchError?.message);
      return jsonResponse(
        { success: false, error: fetchError ? `Database query failed: ${fetchError.message}` : 'Consultation request not found.' },
        fetchError ? 500 : 404
      );
    }

    if (record.status !== 'confirmed' && record.status !== 'rejected') {
      return jsonResponse(
        {
          success: false,
          error: 'Only confirmed or rejected appointments can receive a notification email.',
        },
        400
      );
    }

    if (!record.email) {
      return jsonResponse(
        {
          success: false,
          error: 'Patient does not have an email address recorded on intake.',
        },
        400
      );
    }

    const now = new Date().toISOString();

    // 2. Dispatch appropriate email based on status
    if (record.status === 'confirmed') {
      const emailResult = await sendPatientAppointmentConfirmation({
        patient_name: record.patient_name,
        patient_email: record.email,
        consultation_type: record.consultation_type,
        confirmed_date: record.preferred_date,
        confirmed_time: record.preferred_time,
        admin_note: record.admin_note || null,
      });

      if (emailResult.success) {
        await supabase
          .from('consultation_requests')
          .update({
            confirmation_email_sent_at: now,
            confirmation_email_error: null,
          })
          .eq('id', id);

        return jsonResponse({
          success: true,
          message: 'Confirmation email dispatched successfully.',
          sentAt: now,
        });
      } else {
        const errMsg = emailResult.error || 'Failed to dispatch confirmation email via Resend.';
        await supabase
          .from('consultation_requests')
          .update({
            confirmation_email_error: errMsg,
          })
          .eq('id', id);

        return jsonResponse(
          {
            success: false,
            error: errMsg,
          },
          500
        );
      }
    } else {
      // status === 'rejected'
      const emailResult = await sendPatientAppointmentRejection({
        patient_name: record.patient_name,
        patient_email: record.email,
        consultation_type: record.consultation_type,
        requested_date: record.preferred_date,
        requested_time: record.preferred_time,
        admin_note: record.admin_note || null,
      });

      if (emailResult.success) {
        await supabase
          .from('consultation_requests')
          .update({
            rejection_email_sent_at: now,
            rejection_email_error: null,
          })
          .eq('id', id);

        return jsonResponse({
          success: true,
          message: 'Rejection notification email dispatched successfully.',
          sentAt: now,
        });
      } else {
        const errMsg = emailResult.error || 'Failed to dispatch rejection email via Resend.';
        await supabase
          .from('consultation_requests')
          .update({
            rejection_email_error: errMsg,
          })
          .eq('id', id);

        return jsonResponse(
          {
            success: false,
            error: errMsg,
          },
          500
        );
      }
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Admin Retry Email Exception]:', msg);
    return jsonResponse({ success: false, error: 'Internal server error while retrying email.' }, 500);
  }
};
