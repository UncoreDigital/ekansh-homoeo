export const prerender = false;

import type { APIRoute } from 'astro';
import { verifyAdminRequest, jsonResponse } from '../../../lib/auth';
import { getSupabaseServerClient } from '../../../lib/supabase';

export const GET: APIRoute = async ({ request }) => {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) {
    return jsonResponse({ success: false, error: auth.error }, auth.status || 401);
  }

  try {
    const supabase = getSupabaseServerClient();

    // 1. Fetch consultation requests counts
    const { data: consultations, error: consultError } = await supabase
      .from('consultation_requests')
      .select('id, status, created_at, patient_name, phone, email, consultation_type, preferred_date, preferred_time')
      .order('created_at', { ascending: false });

    if (consultError) {
      console.error('[Admin Overview Consultations Error]:', consultError.code, consultError.message);
      return jsonResponse({ success: false, error: `Failed to load consultations: ${consultError.message}` }, 500);
    }

    // 2. Fetch contact enquiries
    const { data: enquiries, error: inqError } = await supabase
      .from('contact_enquiries')
      .select('id, status, created_at, name, phone, email, interest, message')
      .order('created_at', { ascending: false });

    if (inqError) {
      console.error('[Admin Overview Enquiries Error]:', inqError.code, inqError.message);
      return jsonResponse({ success: false, error: `Failed to load enquiries: ${inqError.message}` }, 500);
    }

    const allConsults = consultations || [];
    const allEnquiries = enquiries || [];

    // Calculate metrics
    const totalConsultations = allConsults.length;
    const pendingConsultations = allConsults.filter((c) => c.status === 'pending').length;
    const confirmedConsultations = allConsults.filter((c) => c.status === 'confirmed').length;
    const rejectedConsultations = allConsults.filter((c) => c.status === 'rejected').length;
    const completedConsultations = allConsults.filter((c) => c.status === 'completed').length;
    const cancelledConsultations = allConsults.filter((c) => c.status === 'cancelled').length;

    const totalEnquiries = allEnquiries.length;
    const newEnquiries = allEnquiries.filter((e) => e.status === 'new').length;

    return jsonResponse({
      success: true,
      stats: {
        total_consultations: totalConsultations,
        pending_consultations: pendingConsultations,
        confirmed_consultations: confirmedConsultations,
        rejected_consultations: rejectedConsultations,
        completed_consultations: completedConsultations,
        cancelled_consultations: cancelledConsultations,
        total_enquiries: totalEnquiries,
        new_enquiries: newEnquiries,
      },
      recent_consultations: allConsults.slice(0, 5),
      recent_enquiries: allEnquiries.slice(0, 5),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Admin Overview Exception]:', msg);
    return jsonResponse({ success: false, error: 'Failed to retrieve overview statistics.' }, 500);
  }
};
