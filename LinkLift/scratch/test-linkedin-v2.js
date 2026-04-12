async function test() {
    console.log("Testing LinkedIn Jobs API with Console Key...");
    try {
        const response = await fetch("https://linkedin-jobs-api2.p.rapidapi.com/active-jb-1h", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-rapidapi-host": "linkedin-jobs-api2.p.rapidapi.com",
                "x-rapidapi-key": "87d249a86bmsh806ebfb519c0a80p140da4jsn9dea06b43e91"
            }
        });
        const data = await response.json();
        console.log("Response Status:", response.status);
        console.log("Response Data:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error:", err.message);
    }
}
test();
