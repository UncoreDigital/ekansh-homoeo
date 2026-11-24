export const prerender = false;

import type { APIRoute } from 'astro';
import { verifyAdminRequest, jsonResponse } from '../../../../lib/auth';
import { getSupabaseServerClient } from '../../../../lib/supabase';

export const GET: APIRoute = async ({ request }) => {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) {
    return jsonResponse({ success: false, error: auth.error }, auth.status || 401);
  }

  try {
    const url = new URL(request.url);
    const statusFilter = url.searchParams.get('status') || 'all';

    const supabase = getSupabaseServerClient();
    let query = supabase
      .from('contact_enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[Admin Enquiries List Error]:', error.code, error.message);
      return jsonResponse({ success: false, error: `Failed to retrieve contact enquiries: ${error.message}` }, 500);
    }

    return jsonResponse({
      success: true,
      enquiries: data || [],
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Admin Enquiries Exception]:', msg);
    return jsonResponse({ success: false, error: 'Failed to retrieve contact enquiries.' }, 500);
  }
};
