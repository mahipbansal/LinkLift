"use client";
import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { ResumeData } from "../../../lib/types";

export default function Projects({ data }: { data: ResumeData }) {
    return (
        <section id="projects" className="py-20 bg-black">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl md:text-6xl font-black text-center text-white mb-20 tracking-tighter uppercase italic">
                    Featured <span className="text-blue-500">Work</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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
                    ]).map((project, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -10 }}
                            className="group relative bg-[#111] rounded-3xl overflow-hidden border border-gray-800"
                        >
                            {/* Image Placeholder with Gradient */}
                            <div className="h-[250px] bg-gradient-to-br from-gray-800 to-gray-950 flex items-center justify-center p-8 overflow-hidden">
                                <div className="text-4xl font-bold text-gray-700 opacity-20 uppercase tracking-widest rotate-12 group-hover:rotate-0 transition-transform duration-500 text-center">
                                    {project.title}
                                </div>
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            <div className="p-8 space-y-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                        {project.title}
                                    </h3>
                                    <div className="flex gap-3">
                                        {project.link && (
                                            <a href={project.link} target="_blank" rel="noopener" className="text-gray-400 hover:text-white transition-colors">
                                                <ExternalLink size={20} />
                                            </a>
                                        )}
                                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                            <Github size={20} />
                                        </a>
                                    </div>
                                </div>

                                <p className="text-gray-400 line-clamp-3">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 pt-4">
                                    {(project.technologies || []).map((tech, idx) => (
                                        <span
                                            key={idx}
                                            className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
