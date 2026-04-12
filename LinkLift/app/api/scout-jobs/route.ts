import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { query, location } = await req.json();
    const apiKey = process.env.RAPID_API_KEY;

    console.log("SCOUTING INITIATED. KEY DETECTED:", !!apiKey);

    // IF NO API KEY: Return High-Quality Mock Data
    if (!apiKey) {
      return NextResponse.json({
        success: true,
        source: "mock",
        jobs: [
          { name: "Vercel", role: query || "Frontend Engineer", score: 98, salary: "$140k - 180k", type: location || "Remote", source: "LinkedIn", cat: "Tier 1" },
          { name: "PostHog", role: query || "Fullstack Wizard", score: 96, salary: "$130k - 170k", type: location || "Remote", source: "YC", cat: "Startup" },
          { name: "Railway", role: query || "Infra Engineer", score: 87, salary: "$120k - 160k", type: location || "Remote", source: "YC", cat: "Startup" },
        ]
      });
    }

    // BACK TO JSEARCH: The most powerful aggregator
    // Simplify query for better match rate
    const cleanQuery = query.replace(/[^\w\s]/gi, '');
    const searchUrl = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(cleanQuery + " in " + location)}&num_pages=1&date_posted=all`;
    
    console.log("FETCHING FROM JSEARCH:", searchUrl);
    
    const response = await fetch(searchUrl, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
    });

    const data = await response.json();

    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
        console.warn("JSearch returned no results or malformed data:", data);
        return NextResponse.json({ 
          success: true, 
          source: "simulated", 
          jobs: [
            { name: "Vercel", role: query || "Frontend Engineer", score: 98, salary: "$140k - 180k", type: location || "Remote", source: "LinkedIn", cat: "Tier 1", status: "Ongoing", posted: "1d ago" },
            { name: "PostHog", role: query || "Fullstack Wizard", score: 96, salary: "$130k - 170k", type: location || "Remote", source: "YC", cat: "Startup", status: "Ongoing", posted: "2d ago" },
          ]
        });
    }

    // Transform Data from JSearch format to LinkLift DNA format
    const realJobs = data.data.map((job: any) => {
      const postedDate = job.job_posted_at_datetime_utc ? new Date(job.job_posted_at_datetime_utc) : new Date();
      const diffHours = Math.floor((new Date().getTime() - postedDate.getTime()) / (1000 * 60 * 60));
      const freshness = diffHours < 24 ? "New" : "Ongoing";
      const postedStr = diffHours < 1 ? "Just now" : `${diffHours}h ago`;

      return {
        name: job.employer_name || "Enterprise",
        role: job.job_title || "Developer",
        score: Math.floor(Math.random() * (99 - 85 + 1)) + 85,
        salary: job.job_highlights?.salary?.[0] || "$120k - 180k (Est)",
        type: job.job_is_remote ? "Remote" : (job.job_city || location),
        source: job.job_publisher || "LinkedIn",
        cat: job.employer_company_type || "Mid-Market",
        status: freshness,
        posted: postedStr
      };
    });

    return NextResponse.json({
      success: true,
      source: "real",
      jobs: realJobs
    });

  } catch (error) {
    console.error("Scouting Error:", error);
    return NextResponse.json({ success: false, error: "Failed to scout market." }, { status: 500 });
  }
}
