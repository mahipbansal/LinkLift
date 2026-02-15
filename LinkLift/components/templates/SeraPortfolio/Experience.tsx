"use client";
import React from "react";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import { ResumeData } from "../../../lib/types";

export default function Experience({ data }: { data: ResumeData }) {
    return (
        <section id="experience" className="py-20 bg-[#04081A] relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(50,50,70,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(50,50,70,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-5xl md:text-7xl font-black text-transparent bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text">
                        Experience
                    </h2>
                    <p className="text-gray-400 mt-4 text-xl font-medium tracking-wide">
                        My professional journey so far
                    </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-12">
                    {(data.experience || []).map((exp, index) => (
                        <div key={index} className="group relative">
                            {/* Glass morphism card */}
                            <div className="absolute inset-0 backdrop-blur-lg bg-white/5 rounded-2xl -z-10" />
                            <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl opacity-20 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                            <div className="p-8 space-y-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                                            {exp.role}
                                        </h3>
                                        <p className="text-blue-400 font-semibold text-lg">
                                            {exp.company}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-mono bg-blue-500/10 px-4 py-1.5 rounded-full text-blue-300 border border-blue-500/20">
                                        <Calendar size={14} />
                                        {exp.duration}
                                    </div>
                                </div>

                                <p className="text-gray-300 leading-relaxed border-l-2 border-blue-500/30 pl-4 py-1 italic">
                                    {exp.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
        </section>
    );
}
