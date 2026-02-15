const { GoogleGenerativeAI } = require("@google/generative-ai");

// PASTE YOUR NEW KEY HERE (The one starting with AIzaSy...)
const KEY = "AIzaSyAEYx26luN9NrL2p9awDFcTG4beKF-XgWo"; 

async function check() {
  console.log("🔍 Asking Google for available models...");
  
  // We use the REST API directly to list models because it's more reliable for debugging
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${KEY}`);
  const data = await response.json();

  if (data.error) {
    console.log("❌ Error:", data.error.message);
  } else {
    console.log("✅ SUCCESS! Your key works. Here are the EXACT names you can use:");
    const models = data.models
      .filter(m => m.supportedGenerationMethods.includes("generateContent"))
      .map(m => m.name.replace("models/", ""));
      
    console.log(models);
  }
}

check();