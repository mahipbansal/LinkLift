
import { ResumeData } from "./types";
import ModernPortfolio from "@/components/templates/ModernPortfolio";

export interface Template {
    id: string;
    name: string;
    thumbnail: string; // URL or path to image
    component: React.ComponentType<{ data: ResumeData }>;
}

import CyberNeonPortfolio from "@/components/templates/CyberNeonPortfolio";
import GalacticVoyagerPortfolio from "@/components/templates/GalacticVoyagerPortfolio";
import ZenMinimalistPortfolio from "@/components/templates/ZenMinimalistPortfolio"; // Zen imports

// Restore original imports
import TerminalPortfolio from "@/components/templates/TerminalPortfolio";
import ThreeDPortfolio from "@/components/templates/ThreeDPortfolio";
import SeraPortfolio from "@/components/templates/SeraPortfolio";
import AntoinePortfolio from "@/components/templates/AntoinePortfolio";

export const TEMPLATES: Record<string, Template> = {
    "default": {
        id: "default",
        name: "Terminal (Default)",
        thumbnail: "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=800&q=80",
        component: TerminalPortfolio
    },
    "modern": {
        id: "modern",
        name: "Modern Clean",
        component: ModernPortfolio,
        thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80",
    },
    "3d": {
        id: "3d",
        name: "3D Interactive",
        component: ThreeDPortfolio,
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    },
    "cyber": {
        id: "cyber",
        name: "Cyber Neon",
        component: CyberNeonPortfolio,
        thumbnail: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80",
    },
    "galactic": {
        id: "galactic",
        name: "Galactic Voyager",
        component: GalacticVoyagerPortfolio,
        thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    },
    "zen": {
        id: "zen",
        name: "Zen Minimalist",
        component: ZenMinimalistPortfolio,
        thumbnail: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&q=80",
    },
    sera: {
        id: "sera",
        name: "Sera Universe",
        component: SeraPortfolio,
        thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    },
    antoine: {
        id: "antoine",
        name: "Antoine Bold",
        component: AntoinePortfolio,
        thumbnail: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80",
    },
};

export const DEFAULT_TEMPLATE_ID = "default";
