export interface Education {
    institution: string;
    degree: string;
    timeline: string;
    percentage?: string;
}

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
    contact?: string;
    linkedin?: string;
    github?: string;
    bio: string;
    skills: string[];
    education: Education[];
    experience: Experience[];
    projects: Project[];
    certifications?: string[];
    achievements?: string[];
    customSections?: { id: string; title: string; content: string }[];
    layoutConfig?: {
        order: string[];
        side: Record<string, 'left' | 'right' | 'full'>;
        titles: Record<string, string>;
    };
    score?: number;
    suggestions?: any[];
    cover_letter?: string;
}
