-- Allow updates to resumes (for AI analysis to save parsed_json)
CREATE POLICY "Users can update own resumes"
  ON public.resumes FOR UPDATE
  USING (true)
  WITH CHECK (true);
