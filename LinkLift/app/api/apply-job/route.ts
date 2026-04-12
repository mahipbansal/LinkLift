import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { jobTitle, companyName, userId } = await req.json();

    if (!jobTitle || !companyName || !userId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Attempt to log the application
    const { error } = await supabase.from('applications').insert({
      user_id: userId,
      job_title: jobTitle,
      company_name: companyName,
      status: 'applied'
    });

    if (error) {
      console.error("Application logging failed:", error.message);
      // We return success: true anyway for the "Simulation" experience, 
      // but maybe include a flag or just log it.
      // If it's a 'relation does not exist' error, we know the table is missing.
      return NextResponse.json({ 
        success: true, 
        message: "Application simulated. (DB entry failed - Table might be missing)",
        debug: error.message 
      });
    }

    return NextResponse.json({ success: true, message: "Application recorded successfully!" });

  } catch (error: any) {
    console.error("Apply Job Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
