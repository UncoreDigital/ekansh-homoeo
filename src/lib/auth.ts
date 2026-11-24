/**
 * Ekansh Homoeopathic Clinic - Admin Authentication & Authorization Guard
 * 
 * Protects admin dashboard API routes and sensitive clinic patient data.
 * Verifies Supabase Auth JWT tokens and enforces an explicit email allowlist.
 */

import { createAuthClient } from './supabase';

export interface AdminUser {
  id: string;
  email: string;
}

export interface AdminVerificationResult {
  authorized: boolean;
  status?: number;
  error?: string;
  user?: AdminUser;
}

/**
 * Returns the list of authorized admin emails configured in the environment.
 */
export function getAuthorizedAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS || import.meta.env.ADMIN_EMAILS || '';
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Checks whether an email address is on the explicit administrator allowlist.
 */
export function isAuthorizedAdminEmail(email?: string | null): boolean {
  if (!email || typeof email !== 'string') return false;
  const list = getAuthorizedAdminEmails();
  // If no allowlist is configured, deny all for security
  if (list.length === 0) {
    console.error('[Admin Security Alert] ADMIN_EMAILS environment variable is not configured. All admin access is denied.');
    return false;
  }
  return list.includes(email.trim().toLowerCase());
}

/**
 * Extracts Bearer token from the Request headers or Cookie.
 */
export function extractAuthToken(request: Request): string | null {
  // 1. Check Authorization header: Bearer <token>
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    return authHeader.slice(7).trim();
  }

  // 2. Check Cookie header for sb_access_token or sb-access-token
  const cookieHeader = request.headers.get('cookie') || '';
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map((c) => c.trim());
    for (const c of cookies) {
      if (c.startsWith('sb_access_token=')) {
        return decodeURIComponent(c.substring('sb_access_token='.length)).trim();
      }
      if (c.startsWith('sb-access-token=')) {
        return decodeURIComponent(c.substring('sb-access-token='.length)).trim();
      }
    }
  }

  return null;
}

/**
 * Verifies that the incoming API request is sent by an authenticated Supabase user
 * whose email address is present in the server-side ADMIN_EMAILS allowlist.
 */
export async function verifyAdminRequest(request: Request): Promise<AdminVerificationResult> {
  const token = extractAuthToken(request);

  if (!token) {
    return {
      authorized: false,
      status: 401,
      error: 'Authentication required. No session token provided.',
    };
  }

  try {
    const authClient = createAuthClient();
    const { data: { user }, error } = await authClient.auth.getUser(token);

    if (error || !user || !user.email) {
      return {
        authorized: false,
        status: 401,
        error: error?.message || 'Invalid or expired session. Please log in again.',
      };
    }

    // Verify email against explicit server-side allowlist
    if (!isAuthorizedAdminEmail(user.email)) {
      console.warn(`[Admin Access Denied] Authenticated user ${user.email} is not in the ADMIN_EMAILS allowlist.`);
      return {
        authorized: false,
        status: 403,
        error: `Access denied. Your email (${user.email}) is not on the authorized clinic staff allowlist.`,
      };
    }

    return {
      authorized: true,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Admin Verification Error]:', msg);
    return {
      authorized: false,
      status: 500,
      error: 'An internal error occurred while validating authentication credentials.',
    };
  }
}

/**
 * Helper to construct standard JSON Responses.
 */
export function jsonResponse(payload: unknown, status: number = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
