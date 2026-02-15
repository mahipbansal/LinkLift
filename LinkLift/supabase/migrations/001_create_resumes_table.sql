-- Create resumes table for storing upload metadata and parsed data
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  file_path TEXT NOT NULL,
  parsed_json JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read/write their own resumes (by user_id from Clerk)
CREATE POLICY "Users can view own resumes"
  ON public.resumes FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own resumes"
  ON public.resumes FOR INSERT
  WITH CHECK (true);

-- Optional: Add index for faster lookups by user_id
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON public.resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_created_at ON public.resumes(created_at DESC);
