"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Download,
    Share2,
    ArrowRight,
    Mail,
    MapPin,
    Github,
    Linkedin,
    Send
} from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { ResumeData } from "@/lib/types";

export default function TerminalPortfolio({ data }: { data: ResumeData }) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="min-h-screen bg-[#030303]" />;

    return (
        <div className="min-h-screen bg-[#030303] text-white selection:bg-indigo-500/30 overflow-x-hidden">
            {/* AMBIENT BACKGROUND */}
            <div className="fixed inset-0 -z-10 bg-[#030303]">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-500/10 blur-[120px] rounded-full" />
            </div>

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-32 space-y-64">
                {/* HERO */}
                <section className="space-y-12 text-center md:text-left">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold tracking-[0.3em] uppercase">
                            AVAILABLE FOR NEW OPPORTUNITIES
                        </div>
                        <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-[0.85] mb-10">
                            <span className="bg-gradient-to-r from-white via-indigo-400 to-purple-400 bg-clip-text text-transparent uppercase">
                                {data.name || "Creative Candidate"}
                            </span>
                        </h1>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
                            <div className="md:col-span-8 space-y-6">
                                <p className="text-3xl font-medium text-white italic">
                                    I build digital value as an <span className="text-indigo-400">{data.role || "Professional"}</span>
                                </p>
                                <p className="text-zinc-500 text-xl leading-relaxed max-w-2xl">{data.bio || "Crafting digital experiences with precision and passion."}</p>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* EXPERIENCE */}
                <section className="space-y-24">
                    <div className="flex flex-col gap-6">
                        <span className="text-indigo-500 font-mono text-xs tracking-[0.5em] uppercase font-black">/ 01 EXPERIENCE</span>
                        <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-white">Career Path</h2>
                    </div>
                    <div className="divide-y divide-white/5 border-t border-white/5">
                        {data.experience?.map((exp, i) => (
                            <motion.div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-12 py-20 group relative">
                                <div className="md:col-span-3 text-zinc-500 font-mono text-xs uppercase tracking-widest">{exp.duration}</div>
                                <div className="md:col-span-7 space-y-6">
                                    <h3 className="text-4xl font-bold text-white group-hover:text-indigo-400 transition-colors italic leading-none">{exp.company}</h3>
                                    <p className="text-xl text-zinc-400 font-medium italic">{exp.role}</p>
                                    <p className="text-zinc-500 leading-relaxed text-lg max-w-2xl">{exp.description}</p>
                                </div>
                                <div className="md:col-span-2 hidden md:flex justify-end items-start pt-2"><span className="text-white/5 font-black text-6xl group-hover:text-indigo-500/10 transition-colors">0{i + 1}</span></div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* PROJECTS */}
                <section className="space-y-24">
                    <div className="flex flex-col gap-6">
                        <span className="text-purple-500 font-mono text-xs tracking-[0.5em] uppercase font-black">/ 02 SELECTED WORKS</span>
                        <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-white">Projects</h2>
                    </div>
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
                        ]).map((proj, i) => (
                            <motion.div key={i} whileHover={{ y: -15 }} className="relative group aspect-[4/5] overflow-hidden rounded-[48px] bg-white/[0.02] border border-white/5 p-12 flex flex-col justify-end gap-8 transition-all duration-700">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 group-hover:via-indigo-500/10 transition-all duration-700" />
                                <div className="relative z-10 space-y-6">
                                    <div className="flex flex-wrap gap-2">{proj.technologies?.map(t => <span key={t} className="px-4 py-1.5 bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">{t}</span>)}</div>
                                    <h3 className="text-5xl font-bold text-white leading-tight">{proj.title}</h3>
                                    <p className="text-zinc-400 text-lg leading-relaxed line-clamp-3 group-hover:text-white/80 transition-colors">{proj.description}</p>
                                    {proj.link ? (
                                        <a
                                            href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 text-white font-bold uppercase text-xs tracking-widest border-b border-white/20 pb-2 group-hover:border-indigo-400 transition-all w-fit"
                                        >
                                            View Project <ArrowRight size={14} />
                                        </a>
                                    ) : (
                                        <button className="flex items-center gap-3 text-white font-bold uppercase text-xs tracking-widest border-b border-white/20 pb-2 group-hover:border-indigo-400 transition-all">
                                            Case Study <ArrowRight size={14} />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* SYSTEM CONTACT */}
                <section className="space-y-24 pb-48">
                    <div className="flex flex-col gap-6"><span className="text-emerald-500 font-mono text-xs tracking-[0.5em] uppercase font-black">/ 04 SYSTEM_CONTACT</span><h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-white">Get in Touch</h2></div>
                    <div className="w-full max-w-2xl mx-auto rounded-3xl bg-black border border-white/10 shadow-2xl p-10 font-mono">
                        <ContactForm toName={data.name} />
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/5 py-24 flex flex-col items-center gap-8">
                <div className="flex gap-8">
                    {data.github && (
                        <a href={data.github.startsWith('http') ? data.github : `https://${data.github}`} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
                            <Github size={20} />
                        </a>
                    )}
                    {data.linkedin && (
                        <a href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
                            <Linkedin size={20} />
                        </a>
                    )}
                    {data.email && (
                        <a href={`mailto:${data.email}`} className="text-zinc-500 hover:text-white transition-colors">
                            <Mail size={20} />
                        </a>
                    )}
                </div>
                <div className="text-zinc-600 font-mono text-xs tracking-widest uppercase italic">
                    Designed for Impact — © {new Date().getFullYear()} {data.name || "Candidate"}
                </div>
            </footer>
        </div>
    );
}
