import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeId, updatedData } = await req.json();

    if (!resumeId || !updatedData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Update the resume record
    const { error: updateError } = await supabase
      .from("resumes")
      .update({ parsed_json: updatedData })
      .eq("id", resumeId)
      .eq("user_id", userId);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("[API] Update Resume Error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
