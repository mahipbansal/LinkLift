const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
        // Note: The SDK doesn't have a direct listModels, but we can try to hit a model or check if we can find documentation
        // Actually, listing models usually requires the Google AI Studio authenticated client or a discovery call.
        // Let's just try to call gemini-1.5-flash with a tiny prompt and see if it 404s here too.

        const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash", "gemini-flash-latest"];

        for (const m of models) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("hi");
                console.log(`✅ Model ${m} is available and working.`);
            } catch (e) {
                console.log(`❌ Model ${m} failed: ${e.message}`);
            }
        }
    } catch (e) {
        console.error("Listing failed:", e);
    }
}

listModels();
