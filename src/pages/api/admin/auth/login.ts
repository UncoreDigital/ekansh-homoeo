export const prerender = false;

import type { APIRoute } from 'astro';
import { createAuthClient } from '../../../../lib/supabase';
import { isAuthorizedAdminEmail, jsonResponse } from '../../../../lib/auth';
import { sanitizeInput } from '../../../../lib/security';

export const POST: APIRoute = async ({ request }) => {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ success: false, error: 'Invalid JSON request format.' }, 400);
    }

    const email = sanitizeInput(body.email, 120).trim().toLowerCase();
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || !password) {
      return jsonResponse({ success: false, error: 'Email and password are required.' }, 400);
    }

    // First, verify whether the email is even in the admin allowlist
    if (!isAuthorizedAdminEmail(email)) {
      console.warn(`[Login Attempt Blocked] Unauthorized email '${email}' attempted admin login.`);
      return jsonResponse(
        {
          success: false,
          error: 'Access denied. This email is not authorized for clinic administration.',
        },
        403
      );
    }

    // Authenticate via Supabase GoTrue Auth using an isolated client (never taints DB client)
    const authClient = createAuthClient();
    const { data, error } = await authClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session || !data.user) {
      console.warn(`[Supabase Auth Login Failed] ${email}:`, error?.message);
      return jsonResponse(
        {
          success: false,
          error: error?.message || 'Invalid credentials. Please verify your email and password.',
        },
        401
      );
    }

    // Successful login: prepare response with token & session cookie
    const token = data.session.access_token;
    const cookie = `sb_access_token=${encodeURIComponent(token)}; Path=/; Max-Age=86400; SameSite=Lax; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''}`;

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Authentication successful.',
        user: {
          id: data.user.id,
          email: data.user.email,
        },
        token,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': cookie,
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Admin Login Exception]:', msg);
    return jsonResponse({ success: false, error: 'An unexpected authentication error occurred.' }, 500);
  }
};
