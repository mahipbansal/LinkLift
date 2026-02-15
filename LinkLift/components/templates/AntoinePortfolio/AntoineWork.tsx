"use client";

import React from "react";
import { ResumeData } from "@/lib/types";
import { ArrowUpRight } from "lucide-react";

export const AntoineWork = ({ data }: { data: ResumeData }) => {
    return (
        <section id="work" className="antoine-theme py-32 border-b border-current">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-end mb-24">
                    <h2 className="text-8xl md:text-[15rem] font-bold uppercase tracking-tighter leading-none italic">Work</h2>
                    <div className="text-right font-mono text-sm uppercase opacity-70 mb-4">
                        ({(data.projects || []).length.toString().padStart(2, "0")}) <br /> Total Projects
                    </div>
                </div>

                <div className="flex flex-col border-t border-current">
                    {(data.projects && data.projects.length > 0 ? data.projects : [
                        {
                            title: "Project Alpha",
                            description: "A high-end 3D immersive experience built with React Three Fiber.",
                            technologies: ["React", "Three.js", "GSAP"],
                            link: "#"
                        },
                        {
                            title: "Beta Analytics",
                            description: "Real-time data visualization platform with advanced filtering and reporting.",
                            technologies: ["Next.js", "TypeScript", "Tailwind"],
                            link: "#"
                        }
                    ]).map((project, i) => (
                        <a
                            key={i}
                            href={project.link || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col md:flex-row md:items-center justify-between py-12 border-b border-current hover:bg-current hover:text-white transition-colors duration-300 px-4"
                        >
                            <div className="flex items-center gap-12">
                                <span className="font-mono text-sm opacity-50">{(i + 1).toString().padStart(2, "0")}</span>
                                <h3 className="text-5xl md:text-7xl font-bold uppercase tracking-tight group-hover:italic transition-all duration-300">
                                    {project.title || "Untitled Project"}
                                </h3>
                            </div>
                            <div className="flex items-center gap-4 mt-4 md:mt-0">
                                <p className="text-lg opacity-70 max-w-xs text-right hidden md:block">
                                    {project.description || "Digital experience orchestration."}
                                </p>
                                <ArrowUpRight className="w-12 h-12" />
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};
