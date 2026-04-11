import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 1. Fetch the latest resume
    const { data: resume, error: fetchError } = await supabase
      .from("resumes")
      .select("id, parsed_json")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError || !resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    // 2. Remove the cover_letter from parsed_json
    const updatedParsedJson = { ...resume.parsed_json };
    delete updatedParsedJson.cover_letter;

    const { error: updateError } = await supabase
      .from("resumes")
      .update({ parsed_json: updatedParsedJson })
      .eq("id", resume.id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("[API] Delete Cover Letter Error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
