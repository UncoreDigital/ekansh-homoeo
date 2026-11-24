-- ==============================================================================
-- EKANSH HOMOEOPATHIC CLINIC - SUPABASE DATABASE INITIALIZATION MIGRATION
-- ==============================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your project and navigate to the "SQL Editor" on the left menu.
-- 3. Click "New query", paste the entire contents of this file, and click "Run".
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABLE: consultation_requests
-- Stores appointment intake requests submitted from the /book-consultation page.
-- Status defaults to 'pending' as requests require clinic desk confirmation.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.consultation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    consultation_type TEXT NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time TEXT NOT NULL,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for efficient queries and administration sorting
CREATE INDEX IF NOT EXISTS idx_consultation_requests_created_at ON public.consultation_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_status ON public.consultation_requests(status);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_phone ON public.consultation_requests(phone);

-- ------------------------------------------------------------------------------
-- 2. TABLE: contact_enquiries
-- Stores general clinic messages and inquiries submitted from the /contact page.
-- Maps inqInterest to the 'interest' column; email is optional/nullable.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    interest TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for efficient sorting and status filtering
CREATE INDEX IF NOT EXISTS idx_contact_enquiries_created_at ON public.contact_enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_enquiries_status ON public.contact_enquiries(status);

-- ------------------------------------------------------------------------------
-- 3. TABLE: newsletter_subscribers (Future-Ready)
-- Pre-configured table for future newsletter subscriptions.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON public.newsletter_subscribers(email);

-- ------------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- Strict patient data protection:
-- - RLS is enabled on all tables.
-- - Public anonymous (anon) users cannot query, read, or list patient submissions.
-- - Submissions are managed securely from the server using the service_role key.
-- ------------------------------------------------------------------------------
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow server backend (service_role) full access to read and write records
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

DROP POLICY IF EXISTS "Service role full access on newsletter_subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Service role full access on newsletter_subscribers" 
    ON public.newsletter_subscribers 
    FOR ALL 
    TO service_role 
    USING (true) 
    WITH CHECK (true);

-- Explicitly ensure public anonymous users have NO access to read records
-- (In Supabase, enabling RLS with no public SELECT policy automatically blocks public reads)
