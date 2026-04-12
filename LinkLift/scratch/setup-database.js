const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '..', '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
for (const k in envConfig) { process.env[k] = envConfig[k]; }

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createApplicationsTable() {
  console.log("Checking for applications table...");
  
  // We can't easily CREATE TABLE via JS client without an RPC.
  // We will try to INSERT into it. If it fails with 'relation "applications" does not exist',
  // then we know we need to create it (manually or via a better method).
  
  const { error } = await supabase.from('applications').select('*').limit(1);
  
  if (error && error.code === 'PGRST116') {
      console.log("Table exists but is empty.");
      return;
  }
  
  if (error && error.message.includes('does not exist')) {
    console.log("Table does not exist. Please run the migration in the Supabase Dashboard:");
    console.log(`
      CREATE TABLE public.applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL,
        job_title TEXT NOT NULL,
        company_name TEXT NOT NULL,
        status TEXT DEFAULT 'applied',
        created_at TIMESTAMPTZ DEFAULT now()
      );
      ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
      CREATE POLICY "Users can view own applications" ON public.applications FOR SELECT USING (true);
      CREATE POLICY "Users can insert own applications" ON public.applications FOR INSERT WITH CHECK (true);
    `);
  } else {
    console.log("Table already exists or another error occurred:", error?.message || "Success");
  }
}

createApplicationsTable();
