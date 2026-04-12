async function test() {
    console.log("Testing LinkedIn Jobs API...");
    try {
        const response = await fetch("https://linkedin-jobs-api2.p.rapidapi.com/active-jb-1h", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-rapidapi-host": "linkedin-jobs-api2.p.rapidapi.com",
                "x-rapidapi-key": "68747653f3mshe6012d58ab73d89p11d0e7jsn9d9868511826"
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
