export const prerender = false;

import type { APIRoute } from 'astro';
import { getSupabaseServerClient } from '../../lib/supabase';
import { sendConsultationNotification } from '../../lib/resend';
import {
  checkRateLimit,
  isHoneypotTriggered,
  sanitizeInput,
  isValidIndianPhone,
  isValidEmail,
  formatIndianPhone,
} from '../../lib/security';

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    // 1. Rate Limiting Check
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
               request.headers.get('x-real-ip') ||
               clientAddress ||
               'unknown';

    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Too many requests. Please wait a minute before submitting again, or connect directly on WhatsApp.',
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Parse JSON Body
    let body: any;
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid request payload format.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Honeypot Verification (Anti-bot)
    if (isHoneypotTriggered(body.website_hp)) {
      // Quietly reject bots with 200 to prevent them probing different payloads
      return new Response(
        JSON.stringify({ success: true, message: 'Request accepted.' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 4. Input Sanitization & Extraction
    const patientName = sanitizeInput(body.patientName || body.patient_name, 100);
    const rawPhone = String(body.patientPhone || body.phone || '').trim();
    const rawEmail = String(body.patientEmail || body.email || '').trim();
    const consultationType = sanitizeInput(body.consultationMode || body.consultation_type, 100);
    const preferredDate = sanitizeInput(body.preferredDate || body.preferred_date, 30);
    const preferredTime = sanitizeInput(body.preferredTime || body.preferred_time, 100);
    const message = sanitizeInput(body.healthConcern || body.message, 2500);

    // 5. Validation Rules
    if (!patientName || patientName.length < 3) {
      return new Response(
        JSON.stringify({ success: false, error: 'Please enter a valid patient full name (minimum 3 characters).' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!isValidIndianPhone(rawPhone)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Please enter a valid 10-digit Indian phone number.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!rawEmail || !isValidEmail(rawEmail)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Please enter a valid email address so we can send your appointment confirmation.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!preferredDate) {
      return new Response(
        JSON.stringify({ success: false, error: 'Please select a preferred consultation date.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!preferredTime) {
      return new Response(
        JSON.stringify({ success: false, error: 'Please select a preferred consultation time window.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const formattedPhone = formatIndianPhone(rawPhone);
    const emailToStore = rawEmail || null;

    // 6. Supabase Database Persistence
    let supabase;
    try {
      supabase = getSupabaseServerClient();
    } catch (configError: any) {
      console.error('[Supabase Config Error]:', configError.message);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'The clinic booking database is currently undergoing scheduled maintenance. Please connect with our clinic desk directly via WhatsApp (+91 7947107147).',
          debug: process.env.NODE_ENV !== 'production' ? configError.message : undefined,
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { data: record, error: dbError } = await supabase
      .from('consultation_requests')
      .insert([
        {
          patient_name: patientName,
          phone: formattedPhone,
          email: emailToStore,
          consultation_type: consultationType || 'In-Clinic Visit (Rajsamand)',
          preferred_date: preferredDate,
          preferred_time: preferredTime,
          message: message || null,
          status: 'pending',
        },
      ])
      .select('id, created_at')
      .single();

    if (dbError) {
      console.error('[Supabase DB Insert Error - consultation_requests]:', dbError);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Unable to save your consultation request at this moment. Please use WhatsApp or call us directly.',
          debug: process.env.NODE_ENV !== 'production' ? dbError.message : undefined,
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 7. Resend Email Notification (Decoupled - fails gracefully without failing client response)
    const emailPromise = sendConsultationNotification({
      id: record.id,
      patient_name: patientName,
      phone: formattedPhone,
      email: emailToStore,
      consultation_type: consultationType || 'In-Clinic Visit (Rajsamand)',
      preferred_date: preferredDate,
      preferred_time: preferredTime,
      message: message || null,
      created_at: record.created_at,
    }).then((res) => {
      if (!res.success && !res.skipped) {
        console.warn(`[Consultation Email Alert Failed] Record ID ${record.id}:`, res.error);
      }
    }).catch((emailErr) => {
      console.error(`[Consultation Email Alert Exception] Record ID ${record.id}:`, emailErr);
    });

    // In serverless, ensure the promise is handled
    await emailPromise;

    // 8. Return Success Response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Your consultation intake request has been logged successfully.',
        recordId: record.id,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (unexpectedError: any) {
    console.error('[Consultation Endpoint Unexpected Exception]:', unexpectedError);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'An unexpected error occurred while processing your request. Please contact our clinic desk directly.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
