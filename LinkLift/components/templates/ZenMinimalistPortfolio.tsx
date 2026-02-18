"use client";

import { motion } from "framer-motion";
import { ResumeData } from "@/lib/types";
import { useEffect, useState, useRef } from "react";
// @ts-ignore
import { Tilt } from "react-tilt";
import { Github, ExternalLink, Linkedin, Mail, ArrowRight } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, ContactShadows, Environment, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

// --- 3D COMPONENTS ---

const GlassShape = ({ position, geometry, color }: any) => {
    const mesh = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        mesh.current.rotation.x = time * 0.1;
        mesh.current.rotation.y = time * 0.15;
        mesh.current.position.y += Math.sin(time) * 0.002;
    });

    return (
        <mesh ref={mesh} position={position} scale={1.5}>
            {geometry === "torus" && <torusGeometry args={[1, 0.3, 16, 32]} />}
            {geometry === "oct" && <octahedronGeometry args={[1.5]} />}
            {geometry === "sphere" && <sphereGeometry args={[1, 32, 32]} />}

            <MeshTransmissionMaterial
                backside
                samples={4}
                thickness={0.5}
                chromaticAberration={0.1}
                anisotropy={0.1}
                distortion={0.1}
                distortionScale={0.1}
                temporalDistortion={0.1}
                iridescence={1}
                iridescenceIOR={1}
                iridescenceThicknessRange={[0, 1400]}
                roughness={0}
                color={color}
            />
        </mesh>
    );
}

// --- MAIN COMPONENT ---

export default function ZenMinimalistPortfolio({ data }: { data: ResumeData }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div className="relative min-h-screen bg-[#FDFBF7] text-zinc-900 font-sans selection:bg-orange-200">

            {/* BACKGROUND CANVAS */}
            <div className="fixed inset-0 z-0 h-screen w-full pointer-events-none opacity-60">
                <Canvas camera={{ position: [0, 0, 15], fov: 30 }}>
                    <ambientLight intensity={1} />
                    <Environment preset="studio" />

                    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                        <GlassShape position={[-4, 2, -5]} geometry="torus" color="#ffd1dc" />
                    </Float>

                    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.5}>
                        <GlassShape position={[5, -2, -8]} geometry="oct" color="#c4dbff" />
                    </Float>

                    <ContactShadows position={[0, -4.5, 0]} opacity={0.4} scale={20} blur={2.5} far={4.5} />
                </Canvas>
            </div>

            {/* CONTENT */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 bg-transparent">

                {/* HEADER */}
                <header className="py-12 flex justify-between items-center">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 text-[#FDFBF7] flex items-center justify-center font-bold text-xl">
                        {data.name.charAt(0)}
                    </div>
                    <nav className="flex gap-6 text-sm font-medium tracking-wide text-zinc-500">
                        <a href="#work" className="hover:text-black transition-colors">Work</a>
                        <a href="#about" className="hover:text-black transition-colors">About</a>
                        <a href="#contact" className="hover:text-black transition-colors">Contact</a>
                    </nav>
                </header>

                {/* HERO */}
                <section className="py-32 md:py-48">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-6xl md:text-8xl font-serif text-zinc-900 leading-tight mb-8"
                    >
                        {data.role}
                        <br />
                        <span className="text-zinc-400 italic font-light">based in the cloud.</span>
                    </motion.h1>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="max-w-xl text-lg text-zinc-500 leading-relaxed font-light"
                    >
                        I'm {data.name}, crafting digital experiences with code and creativity.
                        Exploring the intersection of design, performance, and user interaction.
                    </motion.div>
                </section>

                {/* WORK GRID */}
                <section id="work" className="py-32 border-t border-zinc-200">
                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-24">
                        {(data.projects || []).map((project, i) => (
                            <motion.div
                                key={i}
                                initial={{ y: 50, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                className={`group cursor-pointer ${i % 2 === 1 ? 'md:mt-32' : ''}`}
                            >
                                <div className="aspect-[4/3] bg-zinc-100 rounded-lg overflow-hidden mb-6 relative">
                                    <div className="absolute inset-0 bg-zinc-200 flex items-center justify-center text-zinc-400 font-light text-xl group-hover:scale-105 transition-transform duration-700 ease-in-out">
                                        {project.title} Preview
                                    </div>
                                </div>

                                <h3 className="text-3xl font-serif mb-2">{project.title}</h3>
                                <div className="flex flex-wrap gap-2 mb-4 text-xs font-medium uppercase tracking-widest text-zinc-400">
                                    {(project.technologies || []).slice(0, 3).map((t: string) => <span key={t}>{t}</span>)}
                                </div>
                                <p className="text-zinc-500 leading-relaxed mb-6">{project.description}</p>

                                {project.link && (
                                    <a href={project.link} target="_blank" className="inline-flex items-center gap-2 text-sm font-bold border-b border-black pb-1 hover:text-orange-600 hover:border-orange-600 transition-colors">
                                        View Project <ArrowRight size={14} />
                                    </a>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ABOUT / EXPERIENCE */}
                <section id="about" className="py-32 grid md:grid-cols-2 gap-20 border-t border-zinc-200">
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-12">About Me</h2>
                        <div className="text-2xl font-serif text-zinc-800 leading-relaxed">
                            {data.bio}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-12">Experience</h2>
                        <div className="space-y-12">
                            {(data.experience || []).map((exp, i) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h3 className="text-xl font-medium">{exp.role}</h3>
                                        <span className="text-xs text-zinc-400 font-mono">{exp.duration}</span>
                                    </div>
                                    <div className="text-zinc-500 mb-4">{exp.company}</div>
                                    <p className="text-zinc-600 text-sm leading-relaxed">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer id="contact" className="py-32 border-t border-zinc-200 text-center">
                    <h2 className="text-6xl md:text-9xl font-serif mb-12 hover:italic cursor-default transition-all duration-500">
                        Let's Talk.
                    </h2>
                    <a href={`mailto:${data.email}`} className="inline-block bg-black text-white rounded-full px-10 py-5 text-lg font-medium hover:bg-orange-600 hover:scale-105 transition-all duration-300 shadow-xl">
                        {data.email}
                    </a>

                    <div className="mt-20 flex justify-center gap-8 text-zinc-400">
                        <Github className="hover:text-black cursor-pointer transition-colors" />
                        <Linkedin className="hover:text-black cursor-pointer transition-colors" />
                    </div>
                </footer>
            </div>
        </div>
    );
}
