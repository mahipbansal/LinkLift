-- Add file_url column for storing the public URL of uploaded resumes
ALTER TABLE public.resumes
ADD COLUMN IF NOT EXISTS file_url TEXT;
