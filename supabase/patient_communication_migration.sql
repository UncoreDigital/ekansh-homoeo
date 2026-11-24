-- ==============================================================================
-- EKANSH HOMOEOPATHIC CLINIC - PATIENT COMMUNICATION SCHEMA EXTENSION
-- ==============================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your project and navigate to "SQL Editor" on the left menu.
-- 3. Click "New query", paste the entire contents of this file, and click "Run".
--
-- This migration is completely IDEMPOTENT and SAFE. It adds rejection email
-- delivery tracking columns to the consultation_requests table without altering,
-- truncating, or dropping any existing patient or inquiry records.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. EXTEND TABLE: consultation_requests
-- Add tracking columns for patient rejection email dispatch and failure records
-- ------------------------------------------------------------------------------
ALTER TABLE public.consultation_requests
    ADD COLUMN IF NOT EXISTS rejection_email_sent_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS rejection_email_error TEXT;

-- ------------------------------------------------------------------------------
-- 2. CREATE INDEX FOR FILTERING & AUDITING
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_consultation_requests_rejection_email_sent_at 
    ON public.consultation_requests(rejection_email_sent_at DESC);

-- ==============================================================================
-- END OF MIGRATION
-- ==============================================================================
