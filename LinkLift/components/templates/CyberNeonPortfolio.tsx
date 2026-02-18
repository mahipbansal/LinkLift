"use client";

import { motion } from "framer-motion";
import { ResumeData } from "@/lib/types";
import { useEffect, useState, useRef } from "react";
// @ts-ignore
import { Tilt } from "react-tilt";
import { Github, ExternalLink, Linkedin, Mail } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text3D, Center, Sparkles, MeshDistortMaterial, Environment } from "@react-three/drei";
import * as THREE from "three";

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

// --- 3D COMPONENTS ---

const NeonCube = (props: any) => {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame((state, delta) => {
        meshRef.current.rotation.x += delta * 0.2;
        meshRef.current.rotation.y += delta * 0.2;
    });

    return (
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
            <mesh {...props} ref={meshRef}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial
                    color={props.color}
                    emissive={props.color}
                    emissiveIntensity={2}
                    roughness={0.1}
                    metalness={0.8}
                />
            </mesh>
        </Float>
    );
};

const CyberBackground = () => {
    return (
        <div className="fixed inset-0 z-[-1] bg-black">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_2px,transparent_2px),linear-gradient(90deg,rgba(18,18,18,0)_2px,transparent_2px)] bg-[size:40px_40px] [background-position:center_bottom] [mask-image:linear-gradient(to_bottom,transparent,black)] opacity-20 pointer-events-none" style={{
                backgroundImage: `
                    linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255, 0, 255, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px'
            }}></div>
            <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-cyan-900/20 via-transparent to-transparent opacity-50 pointer-events-none"></div>
        </div>
    );
};

// --- SUB-COMPONENTS ---

const ProjectCard = ({ index, title, description, tags, link }: any) => {
    return (
        <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
            <Tilt options={{ max: 25, scale: 1.05, speed: 450 }} className='bg-black/40 backdrop-blur-md p-5 rounded-sm sm:w-[360px] w-full border border-cyan-500/30 hover:border-cyan-400 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.15)] group'>
                <div className='relative w-full h-[230px] overflow-hidden bg-black/50 group'>
                    <div className={`absolute inset-0 bg-gradient-to-br from-cyan-900/40 to-purple-900/40 flex items-center justify-center border-b border-white/5`}>
                        <ExternalLink size={48} className="text-cyan-400/50 group-hover:text-cyan-400 group-hover:scale-110 transition duration-500" />
                    </div>
                </div>

                <div className='mt-5'>
                    <h3 className='text-white font-bold text-[24px] font-mono tracking-tighter'>{title}</h3>
                    <p className='mt-2 text-zinc-400 text-[14px] leading-relaxed font-mono'>{description}</p>
                </div>

                <div className='mt-4 flex flex-wrap gap-2'>
                    {tags.map((tag: any) => (
                        <p key={`${title}-${tag}`} className={`text-[12px] text-cyan-400 font-mono tracking-wider border border-cyan-900/50 px-2 py-1 bg-cyan-950/30`}>
                            {tag}
                        </p>
                    ))}
                </div>
            </Tilt>
        </motion.div>
    );
};

// --- MAIN COMPONENT ---

export default function CyberNeonPortfolio({ data }: { data: ResumeData }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div className="relative z-0 min-h-screen text-white font-mono selection:bg-cyan-500/30 selection:text-black overflow-x-hidden">
            <CyberBackground />

            {/* HERO */}
            <section className="relative w-full h-screen mx-auto flex flex-col justify-center items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1.5} color="#06b6d4" />
                        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#d946ef" />
                        <Sparkles count={100} scale={10} size={4} speed={0.4} opacity={0.5} color="#06b6d4" />
                        <NeonCube position={[-2, 1, -2]} color="#06b6d4" />
                        <NeonCube position={[2, -1, -3]} color="#d946ef" />
                        <NeonCube position={[0, -2, -1]} color="#8b5cf6" />
                        <Environment preset="city" />
                    </Canvas>
                </div>

                <div className="z-10 text-center px-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "anticipate" }}
                    >
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                            {data.name}
                        </h1>
                        <p className="text-xl md:text-2xl text-cyan-200/80 uppercase tracking-[0.2em] font-bold">
                            {data.role}
                        </p>
                    </motion.div>
                </div>

                <div className='absolute bottom-10 w-full flex justify-center items-center z-20'>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className='text-cyan-500/50 text-xs uppercase tracking-widest'
                    >
                        Scroll to Initialize
                    </motion.div>
                </div>
            </section>

            {/* ABOUT */}
            <section className="max-w-7xl mx-auto px-6 py-24 relative z-10">
                <motion.div variants={textVariant()} initial="hidden" whileInView="show" viewport={{ once: true }}>
                    <p className='text-sm text-cyan-500 font-bold uppercase tracking-widest mb-2'>// SYSTEM_USER_INFO</p>
                    <h2 className='text-4xl md:text-6xl font-bold mb-8'>Biography.</h2>
                </motion.div>

                <motion.p
                    variants={fadeIn("", "", 0.1, 1)}
                    initial="hidden" whileInView="show" viewport={{ once: true }}
                    className='text-lg text-zinc-400 max-w-3xl leading-relaxed border-l-2 border-cyan-500/50 pl-6'
                >
                    {data.bio}
                </motion.p>
            </section>

            {/* SKILLS */}
            <section className="max-w-7xl mx-auto px-6 py-24 relative z-10">
                <h3 className="text-2xl font-bold mb-10 text-center text-cyan-400 uppercase tracking-widest">// TECH_STACK</h3>
                <div className="flex flex-wrap justify-center gap-4">
                    {(data.skills || []).map((skill, index) => (
                        <motion.div
                            key={skill}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            viewport={{ once: true }}
                            className="px-4 py-2 border border-cyan-500/30 bg-cyan-950/20 text-cyan-300 font-mono text-sm hover:bg-cyan-500/20 hover:border-cyan-400 transition-all cursor-default"
                        >
                            {skill}
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* PROJECTS */}
            <section className="max-w-7xl mx-auto px-6 py-24 relative z-10">
                <motion.div variants={textVariant()} initial="hidden" whileInView="show" viewport={{ once: true }}>
                    <p className='text-sm text-purple-500 font-bold uppercase tracking-widest mb-2'>// DEPLOYED_MODULES</p>
                    <h2 className='text-4xl md:text-6xl font-bold mb-12'>Projects.</h2>
                </motion.div>

                <div className='flex flex-wrap gap-7 justify-center'>
                    {(data.projects || []).map((project, index) => (
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

            {/* CONTACT */}
            <section className="py-24 relative z-10 bg-black/50 border-t border-white/5">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500">
                        Initiate Connection
                    </h2>
                    <div className="flex justify-center gap-8">
                        {data.github && (
                            <a href={data.github} target="_blank" rel="noopener noreferrer" className="p-4 rounded-full border border-white/10 hover:bg-white/10 hover:border-cyan-500/50 hover:text-cyan-400 transition-all group">
                                <Github size={32} />
                            </a>
                        )}
                        {data.linkedin && (
                            <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="p-4 rounded-full border border-white/10 hover:bg-white/10 hover:border-cyan-500/50 hover:text-cyan-400 transition-all group">
                                <Linkedin size={32} />
                            </a>
                        )}
                        <a href={`mailto:${data.email}`} className="p-4 rounded-full border border-white/10 hover:bg-white/10 hover:border-cyan-500/50 hover:text-cyan-400 transition-all group">
                            <Mail size={32} />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
