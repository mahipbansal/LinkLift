
-- Run this in your Supabase SQL Editor to add the template support

ALTER TABLE resumes 
ADD COLUMN template_id TEXT NOT NULL DEFAULT 'default';

-- Verify it worked
SELECT id, template_id FROM resumes LIMIT 5;
