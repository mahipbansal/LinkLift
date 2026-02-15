const { GoogleGenerativeAI } = require("@google/generative-ai");

const key = process.argv[2];

if (!key) {
    console.error("Please provide an API key as an argument.");
    process.exit(1);
}

async function listModels() {
    console.log("🔍 Querying Google Gemini API for available models...");

    try {
        // We use the REST API directly to list models because it's more reliable for debugging
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();

        if (data.error) {
            console.error("❌ API Error:", data.error.message);
            if (data.error.code === 403) {
                console.error("👉 This usually means the key is invalid or has been blocked.");
            }
        } else {
            console.log("✅ SUCCESS! Here are the models available to your key:");
            const models = data.models
                .filter(m => m.supportedGenerationMethods.includes("generateContent"))
                .map(m => m.name.replace("models/", ""));

            console.log(JSON.stringify(models, null, 2));
        }
    } catch (error) {
        console.error("❌ Network/Script Error:", error.message);
    }
}

listModels();
