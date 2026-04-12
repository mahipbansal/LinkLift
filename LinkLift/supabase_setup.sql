-- Run this SQL in your Supabase SQL Editor to support the new Application Launchpad features.

CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    job_title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    status TEXT DEFAULT 'applied',
    method TEXT,      -- 'email', 'automation', or 'portal'
    apply_url TEXT,   -- Original link to the job
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security (RLS)
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own applications" 
ON public.applications FOR SELECT 
USING (auth.uid()::text = user_id OR user_id = auth.jwt()->>'sub');

CREATE POLICY "Users can insert their own applications" 
ON public.applications FOR INSERT 
WITH CHECK (auth.uid()::text = user_id OR user_id = auth.jwt()->>'sub');
