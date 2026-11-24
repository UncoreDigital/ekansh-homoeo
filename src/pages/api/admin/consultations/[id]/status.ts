export const prerender = false;

import type { APIRoute } from 'astro';
import { verifyAdminRequest, jsonResponse } from '../../../../../lib/auth';
import { getSupabaseServerClient } from '../../../../../lib/supabase';
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
      return jsonResponse({ success: false, error: 'Invalid request body.' }, 400);
    }

    const newStatus = sanitizeInput(body.status, 30);
    const adminNote = sanitizeInput(body.admin_note, 1000);

    const validStatuses = ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'];
    if (!validStatuses.includes(newStatus)) {
      return jsonResponse(
        {
          success: false,
          error: `Invalid status '${newStatus}'. Allowed: ${validStatuses.join(', ')}`,
        },
        400
      );
    }

    const supabase = getSupabaseServerClient();

    const { data: current, error: fetchError } = await supabase
      .from('consultation_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !current) {
      console.error('[Admin Status Fetch Error]:', fetchError?.code, fetchError?.message);
      return jsonResponse(
        { success: false, error: fetchError ? `Database query failed: ${fetchError.message}` : 'Consultation request not found.' },
        fetchError ? 500 : 404
      );
    }

    // Transition guards
    if (current.status === 'completed' && (newStatus === 'confirmed' || newStatus === 'pending')) {
      return jsonResponse(
        {
          success: false,
          error: 'A completed consultation cannot be reverted to pending or confirmed.',
        },
        400
      );
    }

    const updatePayload: any = {
      status: newStatus,
      reviewed_by: auth.user!.email,
    };

    if (adminNote) {
      updatePayload.admin_note = adminNote;
    }

    const { data: updated, error: updateError } = await supabase
      .from('consultation_requests')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single();

    if (updateError || !updated) {
      console.error('[Admin Status Update Error]:', updateError?.code, updateError?.message);
      return jsonResponse({ success: false, error: `Failed to update consultation status: ${updateError?.message || 'Update failed'}` }, 500);
    }

    return jsonResponse({
      success: true,
      message: `Status updated to ${newStatus}.`,
      record: updated,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Admin Update Status Exception]:', msg);
    return jsonResponse({ success: false, error: 'Internal server error while updating status.' }, 500);
  }
};
