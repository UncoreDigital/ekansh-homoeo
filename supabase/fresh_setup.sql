-- ==============================================================================
-- EKANSH HOMOEOPATHIC CLINIC — FRESH DATABASE SETUP
-- Target Database: Fresh Supabase Project (PostgreSQL)
-- Tables: consultation_requests, contact_enquiries
-- ==============================================================================

-- 1. Ensure pgcrypto extension is available for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- TABLE 1: consultation_requests
-- Stores patient booking requests submitted via /api/consultation and managed
-- by the Clinic Desk Admin Console.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.consultation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    consultation_type TEXT NOT NULL DEFAULT 'In-Clinic Visit (Rajsamand)',
    preferred_date DATE NOT NULL,
    preferred_time TEXT NOT NULL,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'confirmed', 'rejected', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    confirmed_at TIMESTAMPTZ,
    rejected_at TIMESTAMPTZ,
    reviewed_by TEXT,
    admin_note TEXT,
    confirmation_email_sent_at TIMESTAMPTZ,
    confirmation_email_error TEXT,
    rejection_email_sent_at TIMESTAMPTZ,
    rejection_email_error TEXT
);

-- Indexes for fast querying, filtering, and ordering in the Admin Dashboard
CREATE INDEX IF NOT EXISTS idx_consultation_requests_status 
    ON public.consultation_requests(status);

CREATE INDEX IF NOT EXISTS idx_consultation_requests_created_at 
    ON public.consultation_requests(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_consultation_requests_preferred_date 
    ON public.consultation_requests(preferred_date);

-- Enable Row Level Security (RLS)
-- With RLS enabled and no policies defined for anon/authenticated roles, all direct
-- client-side requests from browsers are blocked by default. The Astro SSR server
-- uses the Supabase service-role key, which automatically bypasses RLS.
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;


-- ==============================================================================
-- TABLE 2: contact_enquiries
-- Stores general patient & visitor inquiries submitted via /api/contact and
-- managed by the Clinic Desk Admin Console.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.contact_enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    interest TEXT NOT NULL DEFAULT 'In-Clinic Visit in Rajsamand',
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' 
        CHECK (status IN ('new', 'read', 'replied', 'resolved', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    reviewed_by TEXT,
    reviewed_at TIMESTAMPTZ,
    admin_note TEXT
);

-- Indexes for fast querying, filtering, and ordering in the Admin Dashboard
CREATE INDEX IF NOT EXISTS idx_contact_enquiries_status 
    ON public.contact_enquiries(status);

CREATE INDEX IF NOT EXISTS idx_contact_enquiries_created_at 
    ON public.contact_enquiries(created_at DESC);

-- Enable Row Level Security (RLS)
-- With RLS enabled and no policies defined for anon/authenticated roles, all direct
-- client-side requests from browsers are blocked by default. The Astro SSR server
-- uses the Supabase service-role key, which automatically bypasses RLS.
ALTER TABLE public.contact_enquiries ENABLE ROW LEVEL SECURITY;
