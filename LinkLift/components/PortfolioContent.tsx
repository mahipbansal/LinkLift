"use client";

import { motion } from "framer-motion";

interface PortfolioContentProps {
    displayName: string;
    displayRole: string;
    skills: string[];
}

export default function PortfolioContent({ displayName, displayRole, skills }: PortfolioContentProps) {
    return (
        <div className="min-h-screen bg-black text-white p-10 md:p-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-7xl md:text-9xl font-bold uppercase tracking-tighter">
                    {displayName}
                </h1>
                <p className="text-xl text-zinc-400 mt-8">
                    I build digital value as a <span className="text-white underline decoration-indigo-500">{displayRole}</span>
                </p>

                <div className="mt-12 flex flex-wrap gap-3">
                    {skills.map((skill: string) => (
                        <span key={skill} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm">
                            {skill}
                        </span>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
