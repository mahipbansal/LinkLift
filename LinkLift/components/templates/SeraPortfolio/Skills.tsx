"use client";
import React from "react";
import { Card, CardContent } from "../../ui/sera/card";
import { Badge } from "../../ui/sera/badge";
import IconCloud from "../../ui/sera/icon-cloud";
import { Code2, Database, Layout, Cloud, Cpu, Wrench } from "lucide-react";
import { ResumeData } from "../../../lib/types";

const SkillBadge = ({ skill }: { skill: string }) => (
    <Badge
        variant="outline"
        className="bg-gray-800/50 hover:bg-gray-700/80 text-gray-100 border-gray-600 py-2 px-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
    >
        <span className="font-medium">{skill}</span>
    </Badge>
);

export default function Skills({ data }: { data: ResumeData }) {
    const skills = data.skills || [];

    // Map standard string skills to categories for visual appeal
    const categories = [
        { title: "Frontend", icon: Layout, color: "text-blue-400", skills: skills.slice(0, 8) },
        { title: "Backend", icon: Database, color: "text-green-400", skills: skills.slice(8, 14) },
        { title: "Tools", icon: Wrench, color: "text-purple-400", skills: skills.slice(14) },
    ].filter(c => c.skills.length > 0);

    // Slugs for the globe - mapping common names to simple-icons slugs
    const skillSlugs = skills.map(s => s.toLowerCase().replace(/\s+/g, '')).slice(0, 30);

    return (
        <section id="skills" className="py-20 text-white min-h-screen bg-[#04081A] relative">
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <h2 className="text-4xl md:text-6xl font-black text-center mb-16 gradient-text">
                    Technical Arsenal
                </h2>

                <div className="flex justify-center items-center mb-20">
                    <IconCloud iconSlugs={skillSlugs} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category, index) => (
                        <Card key={index} className="bg-gray-900/80 border-gray-700 hover:scale-[1.02] transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`p-3 rounded-xl bg-gray-800/50 ${category.color}`}>
                                        <category.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">
                                        {category.title}
                                    </h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {category.skills.map((skill, idx) => (
                                        <SkillBadge key={idx} skill={skill} />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
