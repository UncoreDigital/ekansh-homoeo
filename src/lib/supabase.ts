/**
 * Ekansh Homoeopathic Clinic - Supabase Server Client
 * 
 * CRITICAL SECURITY ARCHITECTURE:
 * 1. getSupabaseServerClient():
 *    Returns the privileged server-side Supabase client initialized with
 *    SUPABASE_URL and SUPABASE_SECRET_KEY (service_role).
 *    Its global headers are explicitly locked to `Bearer ${SUPABASE_SECRET_KEY}`
 *    so that all database operations (PostgREST queries) ALWAYS execute under the
 *    `service_role` role in PostgreSQL, bypassing RLS and matching service-role policies.
 *    It is NEVER used to store or attach user session tokens.
 * 
 * 2. createAuthClient():
 *    Creates an isolated Supabase client dedicated to authentication operations
 *    (e.g., verifying user JWT tokens with `getUser` or logging in with `signInWithPassword`).
 *    It never shares session state with the privileged database client.
 * 
 * These clients are STRICTLY for server-side SSR/API use and MUST NEVER be exposed to
 * browser client-side bundles.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

function getSupabaseUrl(): string {
  const url = process.env.SUPABASE_URL || import.meta.env.SUPABASE_URL || '';
  if (!url) {
    throw new Error('[Supabase Config Error] Missing SUPABASE_URL environment variable.');
  }
  return url;
}

function getSupabaseSecretKey(): string {
  const key = process.env.SUPABASE_SECRET_KEY || import.meta.env.SUPABASE_SECRET_KEY || '';
  if (!key) {
    throw new Error('[Supabase Config Error] Missing SUPABASE_SECRET_KEY environment variable.');
  }
  return key;
}

let cachedPrivilegedClient: SupabaseClient | null = null;

/**
 * Returns the privileged server-side Supabase client for database operations.
 * Explicitly locks Authorization and apikey headers to the service_role secret key
 * to guarantee that database queries bypass RLS and are never tainted by user session state.
 */
export function getSupabaseServerClient(): SupabaseClient {
  if (cachedPrivilegedClient) {
    return cachedPrivilegedClient;
  }

  const supabaseUrl = getSupabaseUrl();
  const supabaseSecretKey = getSupabaseSecretKey();

  cachedPrivilegedClient = createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${supabaseSecretKey}`,
        apikey: supabaseSecretKey,
      },
    },
  });

  return cachedPrivilegedClient;
}

/**
 * Creates an isolated Supabase client for authentication operations
 * (e.g. validating JWT tokens or signing in with password).
 * Kept completely separate from the database query client.
 */
export function createAuthClient(): SupabaseClient {
  const supabaseUrl = getSupabaseUrl();
  const supabaseSecretKey = getSupabaseSecretKey();

  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

/**
 * Helper to check whether Supabase is configured with valid credentials.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.SUPABASE_URL || import.meta.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || import.meta.env.SUPABASE_SECRET_KEY;
  return Boolean(url && key);
}
