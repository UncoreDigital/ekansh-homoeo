export const prerender = false;

import type { APIRoute } from 'astro';
import { getSupabaseServerClient } from '../../lib/supabase';
import { sendContactNotification } from '../../lib/resend';
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
          error: 'Too many messages sent. Please wait a minute before submitting again, or connect directly on WhatsApp.',
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
      return new Response(
        JSON.stringify({ success: true, message: 'Message received.' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 4. Input Sanitization & Extraction
    const name = sanitizeInput(body.inqName || body.name, 100);
    const rawPhone = String(body.inqPhone || body.phone || '').trim();
    const rawEmail = String(body.inqEmail || body.email || '').trim();
    const interest = sanitizeInput(body.inqInterest || body.interest, 120);
    const message = sanitizeInput(body.inqMessage || body.message, 2500);

    // 5. Validation Rules
    if (!name || name.length < 2) {
      return new Response(
        JSON.stringify({ success: false, error: 'Please enter your name.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!isValidIndianPhone(rawPhone)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Please enter a valid 10-digit Indian phone number.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (rawEmail && !isValidEmail(rawEmail)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Please enter a valid email address.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!message || message.length < 3) {
      return new Response(
        JSON.stringify({ success: false, error: 'Please write your inquiry message.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const formattedPhone = formatIndianPhone(rawPhone);
    const emailToStore = rawEmail || null;
    const finalInterest = interest || 'In-Clinic Visit in Rajsamand';

    // 6. Supabase Database Persistence
    let supabase;
    try {
      supabase = getSupabaseServerClient();
    } catch (configError: any) {
      console.error('[Supabase Config Error]:', configError.message);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'The clinic messaging database is currently undergoing maintenance. Please message our clinic desk directly via WhatsApp (+91 7947107147).',
          debug: process.env.NODE_ENV !== 'production' ? configError.message : undefined,
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { data: record, error: dbError } = await supabase
      .from('contact_enquiries')
      .insert([
        {
          name,
          phone: formattedPhone,
          email: emailToStore,
          interest: finalInterest,
          message,
          status: 'new',
        },
      ])
      .select('id, created_at')
      .single();

    if (dbError) {
      console.error('[Supabase DB Insert Error - contact_enquiries]:', dbError);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Unable to save your inquiry at this moment. Please use WhatsApp or call us directly.',
          debug: process.env.NODE_ENV !== 'production' ? dbError.message : undefined,
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 7. Resend Email Notification (Decoupled - fails gracefully without failing client response)
    const emailPromise = sendContactNotification({
      id: record.id,
      name,
      phone: formattedPhone,
      email: emailToStore,
      interest: finalInterest,
      message,
      created_at: record.created_at,
    }).then((res) => {
      if (!res.success && !res.skipped) {
        console.warn(`[Contact Email Alert Failed] Record ID ${record.id}:`, res.error);
      }
    }).catch((emailErr) => {
      console.error(`[Contact Email Alert Exception] Record ID ${record.id}:`, emailErr);
    });

    await emailPromise;

    // 8. Return Success Response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Your inquiry has been submitted and safely received by the clinic team.',
        recordId: record.id,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (unexpectedError: any) {
    console.error('[Contact Endpoint Unexpected Exception]:', unexpectedError);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'An unexpected error occurred while sending your inquiry. Please reach out via WhatsApp.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
