
"use client";

import { motion } from "framer-motion";
import { ResumeData } from "@/lib/types";
import { useEffect, useState } from "react";
// @ts-ignore
import { Tilt } from "react-tilt";
import { Github, Globe, ExternalLink, Linkedin, Mail } from "lucide-react";

import ComputersCanvas from "@/components/canvas/Computers";
import StarsCanvas from "@/components/canvas/Stars";
import EarthCanvas from "@/components/canvas/Earth";
import BallCanvas from "@/components/canvas/Ball";
import ContactForm from "@/components/ContactForm";

// --- UTILS & CONSTANTS ---
import { Variants } from "framer-motion";

const textVariant = (delay?: number): Variants => ({
    hidden: { y: -50, opacity: 0 },
    show: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", duration: 1.25, delay: delay }
    }
});

const fadeIn = (direction: string, type: string, delay: number, duration: number): Variants => ({
    hidden: {
        x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
        y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
        opacity: 0,
    },
    show: {
        x: 0,
        y: 0,
        opacity: 1,
        transition: { type: type as any, delay: delay, duration: duration, ease: "easeOut" }
    },
});

const staggerContainer = (staggerChildren?: number, delayChildren?: number): Variants => ({
    hidden: {},
    show: { transition: { staggerChildren: staggerChildren, delayChildren: delayChildren } },
});

// --- SUB-COMPONENTS ---

const ProjectCard = ({ index, title, description, tags, link }: any) => {
    return (
        <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
            <Tilt options={{ max: 45, scale: 1, speed: 450 }} className='bg-[#1d1836] p-5 rounded-2xl sm:w-[360px] w-full min-h-[450px] flex flex-col justify-between border border-white/5'>
                <div className='relative w-full h-[230px] rounded-2xl overflow-hidden bg-black/50 group'>
                    {/* Project Image Placeholder - using a gradient for now */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center`}>
                        <Globe size={48} className="text-white/20 group-hover:text-white/50 transition duration-500" />
                    </div>
                    {link && (
                        <div className='absolute inset-0 flex justify-end m-3 card-img_hover'>
                            <div
                                onClick={() => window.open(link, "_blank")}
                                className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer hover:scale-110 transition bg-black/80 text-white'
                            >
                                <ExternalLink size={16} />
                            </div>
                        </div>
                    )}
                </div>

                <div className='mt-5'>
                    <h3 className='text-white font-bold text-[24px]'>{title}</h3>
                    <p className='mt-2 text-secondary text-[14px] leading-relaxed text-zinc-400 line-clamp-3'>{description}</p>
                </div>

                <div className='mt-4 flex flex-wrap gap-2'>
                    {tags.map((tag: any) => (
                        <p key={`${title}-${tag}`} className={`text-[14px] text-blue-400`}>
                            #{tag}
                        </p>
                    ))}
                </div>
            </Tilt>
        </motion.div>
    );
};

const ExperienceCard = ({ experience }: any) => {
    return (
        <div className="bg-[#1d1836] p-6 rounded-2xl border-l-4 border-white/20 hover:border-violet-500 transition-colors">
            <h3 className='text-white text-[24px] font-bold'>{experience.role}</h3>
            <p className='text-secondary text-[16px] font-semibold' style={{ margin: 0 }}>
                {experience.company}
            </p>
            <ul className='mt-5 list-disc ml-5 space-y-2'>
                <li className='text-white-100 text-[14px] pl-1 tracking-wider text-zinc-300'>
                    {experience.description}
                </li>
                <li className='text-zinc-500 text-[12px] uppercase tracking-widest pt-2'>{experience.duration}</li>
            </ul>
        </div>
    );
};

// --- MAIN COMPONENT ---

export default function ThreeDPortfolio({ data }: { data: ResumeData }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null; // Avoid hydration mismatch

    return (
        <div className="relative z-0 bg-[#050816] text-white font-sans overflow-x-hidden selection:bg-violet-500/30">

            {/* HERO */}
            <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
                <section className={`relative w-full h-screen mx-auto`}>
                    <div className={`absolute inset-0 top-[120px] max-w-7xl mx-auto px-6 flex flex-row items-start gap-5`}>
                        <div className='flex flex-col justify-center items-center mt-5'>
                            <div className='w-5 h-5 rounded-full bg-[#915EFF]' />
                            <div className='w-1 sm:h-80 h-40 violet-gradient bg-gradient-to-b from-[#915EFF] to-transparent' />
                        </div>

                        <div>
                            <h1 className='font-black text-white lg:text-[80px] sm:text-[60px] xs:text-[50px] text-[40px] lg:leading-[98px] mt-2'>
                                Hi, I'm <span className='text-[#915EFF]'>{data.name.split(" ")[0]}</span>
                            </h1>
                            <p className='text-[#dfd9ff] font-medium lg:text-[30px] sm:text-[26px] xs:text-[20px] text-[16px] lg:leading-[40px] mt-2 text-white-100'>
                                {data.role}
                            </p>
                        </div>
                    </div>

                    <ComputersCanvas />

                    <div className='absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center'>
                        <a href='#about'>
                            <div className='w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2 border-white/20'>
                                <motion.div
                                    animate={{ y: [0, 24, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
                                    className='w-3 h-3 rounded-full bg-secondary mb-1 bg-white'
                                />
                            </div>
                        </a>
                    </div>
                </section>
            </div>

            {/* ABOUT */}
            <section id="about" className="max-w-7xl mx-auto px-6 py-20">
                <motion.div variants={textVariant()}>
                    <p className='sm:text-[18px] text-[14px] text-secondary uppercase tracking-wider text-zinc-400'>Introduction</p>
                    <h2 className='text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px]'>Overview.</h2>
                </motion.div>

                <motion.p
                    variants={fadeIn("", "", 0.1, 1)}
                    className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px] text-zinc-300'
                >
                    {data.bio}
                </motion.p>

                {/* Tech Balls */}
                <div className='flex flex-row flex-wrap justify-center gap-10 mt-20'>
                    {(data.skills || []).slice(0, 6).map((technology) => (
                        <div className='w-28 h-28' key={technology}>
                            {/* Passing Placeholder Icon URL - Ideally this would be real icons mapped from technology name */}
                            <BallCanvas icon="https://cdn-icons-png.flaticon.com/512/732/732212.png" />
                            <p className="text-center text-xs mt-2 text-zinc-500">{technology}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* EXPERIENCE */}
            <section className="max-w-4xl mx-auto px-6 py-20">
                <motion.div variants={textVariant()}>
                    <p className='sm:text-[18px] text-[14px] text-secondary uppercase tracking-wider text-zinc-400'>What I have done so far</p>
                    <h2 className='text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px]'>Work Experience.</h2>
                </motion.div>

                <div className='mt-20 flex flex-col gap-10'>
                    {(data.experience || []).map((exp, index) => (
                        <ExperienceCard key={`experience-${index}`} experience={exp} />
                    ))}
                </div>
            </section>

            {/* WORKS */}
            <section id="works" className="max-w-7xl mx-auto px-6 py-20">
                <motion.div variants={textVariant()}>
                    <p className='sm:text-[18px] text-[14px] text-secondary uppercase tracking-wider text-zinc-400'>My work</p>
                    <h2 className='text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px]'>Projects.</h2>
                </motion.div>

                <div className='w-full flex'>
                    <motion.p
                        variants={fadeIn("", "", 0.1, 1)}
                        className='mt-3 text-secondary text-[17px] max-w-3xl leading-[30px] text-zinc-400'
                    >
                        Following projects showcases my skills and experience through real-world examples of my work.
                    </motion.p>
                </div>

                <div className='mt-20 flex flex-wrap gap-7'>
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
                    ]).map((project, index) => (
                        <ProjectCard
                            key={`project-${index}`}
                            index={index}
                            title={project.title}
                            description={project.description}
                            tags={project.technologies || []}
                            link={project.link}
                        />
                    ))}
                </div>
            </section>

            {/* CONTACT / EARTH */}
            <div className='relative z-0 max-w-7xl mx-auto px-6 py-20 pb-40 flex flex-col-reverse lg:flex-row gap-10 overflow-hidden'>
                <motion.div
                    variants={fadeIn("right", "tween", 0.2, 1)}
                    className='flex-[0.75] bg-[#100d25] p-8 rounded-2xl border border-white/5'
                >
                    <p className='sm:text-[18px] text-[14px] text-secondary uppercase tracking-wider text-zinc-400'>Get in touch</p>
                    <h3 className='text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px]'>Contact.</h3>

                    <div className='mt-12'>
                        <ContactForm toName={data.name} />
                    </div>
                    <p className="mt-8 text-zinc-500 text-sm italic">
                        Direct: {data.email}
                    </p>
                </motion.div>

                <motion.div
                    variants={fadeIn("left", "tween", 0.2, 1)}
                    className='xl:flex-1 xl:h-auto md:h-[550px] h-[350px]'
                >
                    <EarthCanvas />
                </motion.div>
            </div>

            <StarsCanvas />
        </div>
    );
}
