export const prerender = false;

import type { APIRoute } from 'astro';
import { verifyAdminRequest, jsonResponse } from '../../../../lib/auth';
import { getSupabaseServerClient } from '../../../../lib/supabase';
import { sanitizeInput } from '../../../../lib/security';

export const POST: APIRoute = async ({ request, params }) => {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) {
    return jsonResponse({ success: false, error: auth.error }, auth.status || 401);
  }

  const { id } = params;
  if (!id) {
    return jsonResponse({ success: false, error: 'Missing inquiry ID parameter.' }, 400);
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

    const validStatuses = ['new', 'read', 'replied', 'resolved', 'archived'];
    if (newStatus && !validStatuses.includes(newStatus)) {
      return jsonResponse(
        {
          success: false,
          error: `Invalid status '${newStatus}'. Allowed: ${validStatuses.join(', ')}`,
        },
        400
      );
    }

    const supabase = getSupabaseServerClient();
    const updatePayload: any = {
      reviewed_by: auth.user!.email,
      reviewed_at: new Date().toISOString(),
    };

    if (newStatus) {
      updatePayload.status = newStatus;
    }

    if (adminNote !== undefined) {
      updatePayload.admin_note = adminNote || null;
    }

    const { data: updated, error: updateError } = await supabase
      .from('contact_enquiries')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single();

    if (updateError || !updated) {
      console.error('[Admin Enquiry Update Error]:', updateError?.code, updateError?.message);
      return jsonResponse({ success: false, error: `Failed to update contact inquiry: ${updateError?.message || 'Update failed'}` }, 500);
    }

    return jsonResponse({
      success: true,
      message: 'Contact inquiry updated.',
      record: updated,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Admin Update Enquiry Exception]:', msg);
    return jsonResponse({ success: false, error: 'Internal server error while updating inquiry.' }, 500);
  }
};
