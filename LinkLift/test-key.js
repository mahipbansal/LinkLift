const { GoogleGenerativeAI } = require("@google/generative-ai");

// 1. PASTE YOUR KEY DIRECTLY HERE (Keep the quotes!)
const ACTUAL_KEY = "AIzaSyAe3pbJ7b6jYJ5ojhlBdPqe8QKlT4btr_E"; 

async function test() {
  console.log(`🔑 Testing Key: ${ACTUAL_KEY.slice(0, 10)}...`);
  
  const genAI = new GoogleGenerativeAI(ACTUAL_KEY);

  // We will try the most standard model first
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    console.log("🤖 Pinging Google...");
    const result = await model.generateContent("Are you online?");
    console.log("✅ SUCCESS! The key works!");
    console.log("Response:", result.response.text());
  } catch (error) {
    console.log("❌ FAILED.");
    console.log("Error Message:", error.message);
    
    // If that failed, let's try to see if it's just 'permission'
    if (error.message.includes("404")) {
        console.log("\n⚠️ DIAGNOSIS: The key is valid, but the 'Generative Language API' is OFF.");
        console.log("👉 Go here to enable it: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com");
    }
  }
}

test();