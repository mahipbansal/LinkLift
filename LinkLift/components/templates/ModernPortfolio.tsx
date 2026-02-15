
"use client";

import { motion } from "framer-motion";
import { ResumeData } from "@/lib/types";
import { Github, Linkedin, Mail, MapPin, Globe, Download, ArrowRight } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export default function ModernPortfolio({ data }: { data: ResumeData }) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-rose-500/30">

            {/* HEADER / HERO Section */}
            <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="font-bold text-xl tracking-tight text-slate-800">
                        {(data.name || "Creative").split(" ")[0]}<span className="text-rose-500">.</span>
                    </div>
                    <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
                        <a href="#about" className="hover:text-rose-500 transition">About</a>
                        <a href="#experience" className="hover:text-rose-500 transition">Experience</a>
                        <a href="#projects" className="hover:text-rose-500 transition">Projects</a>
                        <a href="#contact" className="hover:text-rose-500 transition">Contact</a>
                    </nav>
                    <a href={`mailto:${data.email || "hello@example.com"}`} className="px-5 py-2 bg-rose-500 text-white rounded-full text-sm font-bold hover:bg-rose-600 transition shadow-lg shadow-rose-500/20">
                        Let's Talk
                    </a>
                </div>
            </header>

            <main className="pt-32 pb-20">

                {/* HERO */}
                <section id="about" className="max-w-6xl mx-auto px-6 py-20 md:py-32 grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        <div className="inline-block px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-xs font-bold tracking-widest uppercase">
                            {data.role || "Professional"}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-tight">
                            Hello, I'm <br />
                            <span className="text-rose-500">{data.name || "Candidate"}</span>
                        </h1>
                        <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                            {data.bio || "Crafting digital experiences with precision and passion."}
                        </p>
                        <div className="flex gap-4 pt-4">
                            {data.email && (
                                <a href={`mailto:${data.email}`} className="p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition text-slate-600" title="Email Me">
                                    <Mail size={20} />
                                </a>
                            )}
                            {data.github && (
                                <a href={data.github.startsWith('http') ? data.github : `https://${data.github}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition text-slate-600" title="GitHub">
                                    <Github size={20} />
                                </a>
                            )}
                            {data.linkedin && (
                                <a href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition text-slate-600" title="LinkedIn">
                                    <Linkedin size={20} />
                                </a>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="aspect-square rounded-[2rem] bg-gradient-to-tr from-rose-500 to-orange-400 rotate-3 shadow-2xl" />
                        <div className="absolute inset-0 bg-slate-100 rounded-[2rem] -rotate-3 border border-slate-200 flex items-center justify-center p-8">
                            <div className="text-center space-y-4">
                                <div className="text-6xl">👋</div>
                                <h3 className="text-2xl font-bold text-slate-800">Based in Tech</h3>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {(data.skills || []).slice(0, 5).map(skill => (
                                        <span key={skill} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* EXPERIENCE */}
                <section id="experience" className="py-20 bg-white">
                    <div className="max-w-4xl mx-auto px-6 space-y-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center space-y-4"
                        >
                            <h2 className="text-3xl font-bold text-slate-900">Work Experience</h2>
                            <div className="w-12 h-1 bg-rose-500 mx-auto rounded-full" />
                        </motion.div>

                        <div className="space-y-12 border-l-2 border-slate-100 ml-4 md:ml-0 pl-8 md:pl-0">
                            {(data.experience || []).map((exp, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="relative md:pl-12"
                                >
                                    <div className="hidden md:block absolute left-[-9px] top-2 w-4 h-4 rounded-full bg-rose-500 border-4 border-white shadow-md" />
                                    <div className="flex flex-col md:flex-row gap-2 md:gap-8 md:items-baseline mb-2">
                                        <h3 className="text-xl font-bold text-slate-800">{exp.role}</h3>
                                        <span className="text-sm font-semibold text-rose-500">{exp.company}</span>
                                        <span className="text-xs text-slate-400 uppercase tracking-widest">{exp.duration}</span>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed max-w-2xl">
                                        {exp.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* PROJECTS */}
                <section id="projects" className="py-20 bg-slate-50">
                    <div className="max-w-6xl mx-auto px-6 space-y-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center space-y-4"
                        >
                            <h2 className="text-3xl font-bold text-slate-900">Featured Projects</h2>
                            <div className="w-12 h-1 bg-rose-500 mx-auto rounded-full" />
                        </motion.div>

                        <motion.div
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
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
                                },
                                {
                                    title: "Gamma System",
                                    description: "Cloud-native infrastructure management tool for modern devops teams.",
                                    technologies: ["AWS", "Node.js", "Docker"],
                                    link: "#"
                                }
                            ]).map((proj, i) => (
                                <motion.div
                                    key={i}
                                    variants={item}
                                    className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col items-start gap-4 h-full relative group"
                                >
                                    {proj.link && (
                                        <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noopener noreferrer" className="absolute top-6 right-6 p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-rose-500 transition-colors">
                                            <ArrowRight size={16} />
                                        </a>
                                    )}
                                    <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-2">
                                        <Globe size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800">{proj.title}</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                                        {proj.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-auto pt-4">
                                        {(proj.technologies || []).slice(0, 3).map(tech => (
                                            <span key={tech} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                    {proj.link && (
                                        <a
                                            href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-4 text-xs font-bold text-rose-500 flex items-center gap-1 hover:underline"
                                        >
                                            View Project <ArrowRight size={10} />
                                        </a>
                                    )}
                                </motion.div>
                            ))}

                        </motion.div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer id="contact" className="py-20 bg-white border-t border-slate-100">
                    <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
                        <h2 className="text-3xl font-bold text-slate-900">Let's work together.</h2>
                        <p className="text-slate-600 max-w-md mx-auto">
                            I'm currently available for freelance work or full-time opportunities.
                        </p>
                        <div className="max-w-xl mx-auto py-10">
                            <ContactForm toName={data.name} />
                        </div>
                        <div className="pt-12 text-sm text-slate-400">
                            © {new Date().getFullYear()} {data.name || "Candidate"}. All rights reserved.
                        </div>
                    </div>
                </footer>

            </main>
        </div>
    );
}
