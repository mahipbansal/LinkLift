import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobDescription } = await req.json();

    if (!jobDescription) {
      return NextResponse.json({ error: "Job description is required" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Fetch the latest resume for this user
    const { data: resume, error: fetchError } = await supabase
      .from("resumes")
      .select("parsed_json")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError || !resume) {
      return NextResponse.json({ error: "Resume not found. Please upload your resume first." }, { status: 404 });
    }

    const parsedData = resume.parsed_json;
    const groqKey = process.env.GROQ_API_KEY;
    const geminiKeys = (process.env.GEMINI_API_KEY || "").split(",").map(k => k.trim()).filter(Boolean);
    
    if (geminiKeys.length === 0 && !groqKey) {
      return NextResponse.json({ error: "No AI API keys configured (Gemini/Groq)" }, { status: 500 });
    }

    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ];

    const prompt = `
      You are an expert career coach and professional writer. 
      Generate a persuasive, high-impact cover letter based on the user's resume and the job description provided.

      ### USER RESUME DATA (JSON):
      ${JSON.stringify(parsedData)}

      ### TARGET JOB DESCRIPTION:
      ${jobDescription}

      ### INSTRUCTIONS:
      1. Use a professional and confident tone.
      2. Highlight specific skills and experiences from the resume that match the job description.
      3. Focus on quantifiable achievements.
      4. Keep it to approximately 300-400 words.
      5. Format the output in clean Markdown.
      6. Start with [Your Name] and [Date] as placeholders at the top.
      7. End with a professional closing.

      ONLY return the cover letter content. No preamble or conversational filler.
    `;

    let coverLetter = "";

    // CONFIGS TO TRY (Mirroring analyze-resume logic)
    // CONFIGS TO TRY (Updated for Gemini 2.0/2.5 availability)
    const configsToTry = [
      { name: "gemini-2.0-flash", version: "v1beta" },
      { name: "gemini-flash-latest", version: "v1beta" },
      { name: "gemini-pro-latest", version: "v1beta" }
    ];

    // ROTATION LOGIC
    for (const apiKey of geminiKeys) {
        if (coverLetter) break;
        const genAI = new GoogleGenerativeAI(apiKey);

        for (const config of configsToTry) {
            if (coverLetter) break;
            try {
                console.log(`[AI] Attempting ${config.name} on ${config.version} for cover letter...`);
                const model = genAI.getGenerativeModel(
                    { model: config.name, safetySettings },
                    { apiVersion: config.version as any }
                );

                const result = await model.generateContent(prompt);
                coverLetter = result.response.text();
            } catch (e: any) {
                console.warn(`[AI] Error with ${config.name} (${config.version}):`, e.message);
                
                // Desperation fallback for this model if versioned call failed
                try {
                    console.log(`[AI] Retrying ${config.name} without explicit version...`);
                    const simpleModel = genAI.getGenerativeModel({ model: config.name, safetySettings });
                    const result = await simpleModel.generateContent(prompt);
                    coverLetter = result.response.text();
                } catch (innerE: any) {
                    console.warn(`[AI] Complete failure for ${config.name}:`, innerE.message);
                }
            }
        }
    }

    // --- PHASE 2: GROQ FALLBACK ---
    if (!coverLetter && groqKey) {
      try {
        console.log("🚀 Gemini exhausted. Attempting Groq (Llama 3.3 70B)...");
        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${groqKey}`
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: "You are a professional career coach. Generate a high-impact cover letter based on the provide resume and job description." },
              { role: "user", content: prompt }
            ],
            temperature: 0.2
          })
        });

        if (groqResponse.ok) {
          const groqJson = await groqResponse.json();
          coverLetter = groqJson.choices?.[0]?.message?.content;
          if (coverLetter) console.log("✅ Success with Groq (Llama 3)!");
        }
      } catch (groqErr: unknown) {
        console.error("❌ Groq fallback failed:", groqErr instanceof Error ? groqErr.message : groqErr);
      }
    }

    if (!coverLetter) {
      throw new Error("All AI models failed to generate content.");
    }

    return NextResponse.json({ coverLetter });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("[API] Cover Letter Error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
