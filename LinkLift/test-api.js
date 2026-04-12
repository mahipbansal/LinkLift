const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load .env.local manually for the script
const envPath = path.resolve(__dirname, '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
for (const k in envConfig) { process.env[k] = envConfig[k]; }

async function testJSearch() {
    console.log("--- LINKLIFT JSEARCH DIAGNOSTIC ---");
    const key = process.env.RAPID_API_KEY;
    
    if (!key) {
        console.error("❌ ERROR: RAPID_API_KEY not found in .env.local");
        return;
    }

    console.log("✅ KEY DETECTED");
    console.log("🛰️ CONNECTING TO JSEARCH AGGREGATOR...");

    const query = "MERN Stack Developer in India";
    const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&num_pages=1`;
    
    try {
        const res = await fetch(url, {
            headers: {
                "X-RapidAPI-Key": key,
                "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
            }
        });

        const data = await res.json();
        
        if (data.data && Array.isArray(data.data)) {
            console.log("🚀 SUCCESS! JSearch is online.");
            console.log("📊 DISCOVERED", data.data.length, "RELEVANT ROLES.");
            console.log("🏢 TOP TARGET:", data.data[0]?.employer_name || "N/A");
            console.log("📑 ROLE TITLE:", data.data[0]?.job_title || "N/A");
        } else {
            console.error("❌ AGGREGATOR ERROR:", JSON.stringify(data));
        }
    } catch (err) {
        console.error("🔥 CONNECTION FAILED:", err.message);
    }
}

testJSearch();
