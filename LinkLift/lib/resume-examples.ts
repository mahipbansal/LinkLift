
export const RESUME_EXAMPLES = [
    {
        input: `
    JOHN DOE
    Software Engineer
    San Francisco, CA | john@example.com

    EXPERIENCE
    Tech Corp | Senior Developer | 2020-Present
    - Led a team of 5 engineers to build a new payment system.
    - Optimized database queries, reducing latency by 40%.

    StartUp Inc | Junior Dev | 2018-2020
    - Built frontend components using React and Redux.

    SKILLS
    JavaScript, TypeScript, React, Node.js, SQL
    `,
        output: {
            name: "John Doe",
            role: "Software Engineer",
            email: "john@example.com",
            skills: ["JavaScript", "TypeScript", "React", "Node.js", "SQL"],
            score: 85,
            experience: [
                {
                    role: "Senior Developer",
                    company: "Tech Corp",
                    duration: "2020-Present",
                    description: "Led a team of 5 engineers to build a new payment system. Optimized database queries, reducing latency by 40%."
                },
                {
                    role: "Junior Dev",
                    company: "StartUp Inc",
                    duration: "2018-2020",
                    description: "Built frontend components using React and Redux."
                }
            ],
            projects: [
                {
                    title: "AI Chatbot",
                    description: "Developed an AI-powered customer support bot using OpenAI API and Next.js.",
                    technologies: ["Next.js", "OpenAI", "TailwindCSS"],
                    link: "https://github.com/johndoe/ai-chatbot"
                }
            ],
            suggestions: [
                { area: "Impact", issue: "quantifiable results", advice: "Good job using numbers (40%). Add more metrics to the Junior Dev role." }
            ]
        }
    },
    {
        input: `
    Alice Smith - Product Manager
    alice.smith@email.com
    
    Professional Summary:
    Experienced PM with a background in UX design.

    Work History:
    Product Owner at Big Bank (Jan 2019 - Dec 2022)
    Managed backlog for mobile app.
    
    UX Designer at Creative Studio (2016 - 2018)
    Designed wireframes for e-commerce clients.

    Projects:
    E-commerce Redesign: Led the UX research for a major retailer, resulting in 20% increase in conversion.

    Core Competencies:
    Agile, Scrum, Figma, Jira, User Research
    `,
        output: {
            name: "Alice Smith",
            role: "Product Manager",
            email: "alice.smith@email.com",
            skills: ["Agile", "Scrum", "Figma", "Jira", "User Research"],
            score: 82,
            experience: [
                {
                    role: "Product Owner",
                    company: "Big Bank",
                    duration: "Jan 2019 - Dec 2022",
                    description: "Managed backlog for mobile app."
                },
                {
                    role: "UX Designer",
                    company: "Creative Studio",
                    duration: "2016 - 2018",
                    description: "Designed wireframes for e-commerce clients."
                }
            ],
            projects: [
                {
                    title: "E-commerce Redesign",
                    description: "Led the UX research for a major retailer, resulting in 20% increase in conversion.",
                    technologies: ["User Research", "Figma"],
                }
            ],
            suggestions: [
                { area: "Detail", issue: "brevity", advice: "Expand on the 'Managed backlog' bullet point. What was the impact?" }
            ]
        }
    }
];
