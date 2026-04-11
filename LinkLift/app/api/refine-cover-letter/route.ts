import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentContent, action, tone } = await req.json();

    if (!currentContent) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    let prompt = "";
    if (action === "tone") {
      prompt = `Rewrite the following professional text to have a ${tone} tone. Keep the core achievements and skills but adjust the language style accordingly.\n\nContent:\n${currentContent}`;
    } else if (action === "expand") {
      prompt = `Expand the following professional text. Add more professional detail and elaborate on the impact of the achievements mentioned. Keep it concise.\n\nContent:\n${currentContent}`;
    } else if (action === "reduce") {
      prompt = `Condense the following professional text. Keep it concise, punchy, and focused only on the most critical impact. Aim for a high-impact summary.\n\nContent:\n${currentContent}`;
    } else if (action === "custom") {
      prompt = `Refine the following professional text based on this specific instruction: "${tone}". \n\nContent:\n${currentContent}`;
    }

    const geminiKeys = (process.env.GEMINI_API_KEY || "").split(",").map(k => k.trim()).filter(Boolean);
    if (geminiKeys.length === 0) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    let refinedContent = "";
    let lastError = "";

    // 1. TRY GEMINI WITH ROTATION
    for (const key of geminiKeys) {
      try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        refinedContent = result.response.text();
        if (refinedContent) break;
      } catch (err: any) {
        lastError = err.message;
        console.error(`Gemini key failed: ${lastError}`);
        continue;
      }
    }

    // 2. FALLBACK TO GROQ IF GEMINI FAILS
    if (!refinedContent && process.env.GROQ_API_KEY) {
      console.log("Gemini failed or rate limited. Falling back to Groq...");
      try {
        const groqBody = {
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: "You are an expert career coach and resume writer. Refine professional text to be high-impact and professional. Provide the text only, no conversational filler." },
              { role: "user", content: prompt }
            ],
            temperature: 0.7,
        };

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(groqBody),
        });

        const groqData = await response.json();
        
        if (response.ok) {
            refinedContent = groqData.choices?.[0]?.message?.content || "";
        } else {
            console.error("Groq API error response:", groqData);
            lastError = groqData.error?.message || "Groq request failed";
        }
      } catch (groqErr: any) {
        console.error("Groq network failure:", groqErr.message);
        lastError = groqErr.message;
      }
    }

    if (!refinedContent) {
      return NextResponse.json({ error: `All models failed. Last error: ${lastError}` }, { status: 500 });
    }

    return NextResponse.json({ refinedContent });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("[API] Refine Text Error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
