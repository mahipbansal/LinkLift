
export interface Experience {
    role: string;
    company: string;
    duration: string;
    description: string;
}

export interface Project {
    title: string;
    description: string;
    technologies: string[];
    link?: string;
}

export interface ResumeData {
    name: string;
    role: string;
    email: string;
    bio: string;
    github?: string;
    linkedin?: string;
    skills: string[];
    experience: Experience[];
    projects: Project[];
    score?: number;
    suggestions?: any[];
}
