-- ==============================================================================
-- EKANSH HOMOEOPATHIC CLINIC - ADMIN DASHBOARD SCHEMA EXTENSION
-- ==============================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your project and navigate to the "SQL Editor" on the left menu.
-- 3. Click "New query", paste the entire contents of this file, and click "Run".
--
-- This migration is completely IDEMPOTENT and SAFE. It extends existing tables
-- without deleting, truncating, or modifying any existing patient or inquiry records.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. EXTEND TABLE: consultation_requests
-- Add admin review tracking, notes, and patient confirmation email status
-- ------------------------------------------------------------------------------

-- Update status check constraint to support 'rejected' alongside pending, confirmed, completed, cancelled
ALTER TABLE public.consultation_requests 
    DROP CONSTRAINT IF EXISTS consultation_requests_status_check;

ALTER TABLE public.consultation_requests 
    ADD CONSTRAINT consultation_requests_status_check 
    CHECK (status IN ('pending', 'confirmed', 'rejected', 'completed', 'cancelled'));

-- Add columns for admin review workflow and patient confirmation email tracking
ALTER TABLE public.consultation_requests
    ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS reviewed_by TEXT,
    ADD COLUMN IF NOT EXISTS admin_note TEXT,
    ADD COLUMN IF NOT EXISTS confirmation_email_sent_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS confirmation_email_error TEXT;

-- Create indexes for efficient filtering and admin sorting
CREATE INDEX IF NOT EXISTS idx_consultation_requests_confirmed_at ON public.consultation_requests(confirmed_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_rejected_at ON public.consultation_requests(rejected_at DESC);

-- ------------------------------------------------------------------------------
-- 2. EXTEND TABLE: contact_enquiries
-- Add review workflow, resolution status, and internal notes
-- ------------------------------------------------------------------------------

-- Update status check constraint to support 'resolved' alongside existing statuses
ALTER TABLE public.contact_enquiries 
    DROP CONSTRAINT IF EXISTS contact_enquiries_status_check;

ALTER TABLE public.contact_enquiries 
    ADD CONSTRAINT contact_enquiries_status_check 
    CHECK (status IN ('new', 'read', 'replied', 'resolved', 'archived'));

-- Add columns for staff review tracking
ALTER TABLE public.contact_enquiries
    ADD COLUMN IF NOT EXISTS reviewed_by TEXT,
    ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS admin_note TEXT;

-- Create indexes for efficient filtering
CREATE INDEX IF NOT EXISTS idx_contact_enquiries_reviewed_at ON public.contact_enquiries(reviewed_at DESC);

-- ------------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- Strict patient data protection:
-- - RLS remains fully enabled on all tables.
-- - Public anonymous (anon) users CANNOT read, update, or delete any records.
-- - Privileged server backend (service_role) retains full access.
-- ------------------------------------------------------------------------------
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_enquiries ENABLE ROW LEVEL SECURITY;

-- Ensure service_role policy is in place (idempotent)
DROP POLICY IF EXISTS "Service role full access on consultation_requests" ON public.consultation_requests;
CREATE POLICY "Service role full access on consultation_requests" 
    ON public.consultation_requests 
    FOR ALL 
    TO service_role 
    USING (true) 
    WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on contact_enquiries" ON public.contact_enquiries;
CREATE POLICY "Service role full access on contact_enquiries" 
    ON public.contact_enquiries 
    FOR ALL 
    TO service_role 
    USING (true) 
    WITH CHECK (true);
