"use client";

import { motion } from "framer-motion";
import { ResumeData } from "@/lib/types";
import { useEffect, useState, useRef } from "react";
// @ts-ignore
import { Tilt } from "react-tilt";
import { Github, ExternalLink, Linkedin, Mail, ArrowDown } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float, Text3D, Center, Sparkles, PointMaterial, Points } from "@react-three/drei";
// @ts-ignore
import * as random from "maath/random/dist/maath-random.esm";
import * as THREE from "three";

// --- 3D COMPONENTS ---

const StarField = (props: any) => {
    const ref = useRef<any>(null);
    // @ts-ignore
    const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }));

    useFrame((state, delta) => {
        ref.current.rotation.x -= delta / 10;
        ref.current.rotation.y -= delta / 15;
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#f272c8"
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
};

const RotatingPlanet = () => {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame((state, delta) => {
        meshRef.current.rotation.y += delta * 0.1;
    });

    return (
        <mesh ref={meshRef} position={[2, 0, -2]} scale={1.5}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial
                color="#4338ca"
                roughness={0.7}
                metalness={0.1}
            />
        </mesh>
    );
};

// --- SUB-COMPONENTS ---

const InfoCard = ({ title, children, className }: any) => (
    <div className={`bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl ${className}`}>
        <h3 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2 inline-block">{title}</h3>
        {children}
    </div>
);

// --- MAIN COMPONENT ---

export default function GalacticVoyagerPortfolio({ data }: { data: ResumeData }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div className="relative z-0 min-h-screen text-white bg-[#030014] font-sans selection:bg-indigo-500/30 overflow-x-hidden">

            {/* HERO CANVASES */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <Canvas camera={{ position: [0, 0, 1] }}>
                    <StarField />
                    {/* Add some ambient lighting */}
                    <ambientLight intensity={0.5} />
                </Canvas>
            </div>

            {/* CONTENT */}
            <div className="relative z-10">

                {/* HERO SECTION */}
                <section className="h-screen flex flex-col items-center justify-center text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <h1 className="text-6xl md:text-9xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 mb-6 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                            {data.name}
                        </h1>
                        <p className="text-2xl md:text-3xl text-indigo-200 font-light tracking-wide">
                            {data.role}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="absolute bottom-10 animate-bounce"
                    >
                        <ArrowDown className="text-white/50" />
                    </motion.div>
                </section>

                {/* ABOUT SECTION */}
                <section className="min-h-screen py-20 px-6 flex items-center justify-center">
                    <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
                                Mission Log
                            </h2>
                            <p className="text-lg text-zinc-300 leading-relaxed">
                                {data.bio}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="grid grid-cols-2 gap-4"
                        >
                            {(data.skills || []).slice(0, 8).map((skill) => (
                                <div key={skill} className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-4 text-center text-indigo-200 hover:bg-indigo-500/20 transition-all">
                                    {skill}
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* PROJECTS SECTION */}
                <section className="py-32 px-6">
                    <div className="max-w-7xl mx-auto">
                        <motion.h2
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            className="text-5xl font-bold mb-20 text-center"
                        >
                            Galactic Projects
                        </motion.h2>

                        <div className="grid md:grid-cols-3 gap-8">
                            {(data.projects || []).map((project, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.2 }}
                                    className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:transform hover:-translate-y-2 hover:border-purple-500/50 transition-all duration-300 group"
                                >
                                    <div className="mb-6 flex justify-between items-start">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-xl font-bold">
                                            {project.title.charAt(0)}
                                        </div>
                                        {project.link && (
                                            <a href={project.link} target="_blank" className="p-2 bg-white/5 rounded-full hover:bg-white/20 transition-colors">
                                                <ExternalLink size={18} />
                                            </a>
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                                    <p className="text-zinc-400 mb-6 text-sm line-clamp-3">{project.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(project.technologies || []).map((tech: string) => (
                                            <span key={tech} className="text-xs font-medium px-3 py-1 bg-purple-500/10 text-purple-300 rounded-full border border-purple-500/20">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* EXPERIENCE SECTION */}
                <section className="py-32 px-6 max-w-4xl mx-auto">
                    <h2 className="text-4xl font-bold mb-16 text-center">Voyage History</h2>
                    <div className="space-y-12 relative border-l-2 border-indigo-900/50 ml-4 md:ml-0">
                        {(data.experience || []).map((exp, i) => (
                            <motion.div
                                key={i}
                                initial={{ x: -20, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="relative pl-8 md:pl-12"
                            >
                                <div className="absolute -left-[5px] top-2 w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" />
                                <h3 className="text-2xl font-bold text-white">{exp.role}</h3>
                                <div className="text-indigo-400 font-medium mb-2">{exp.company} <span className="opacity-50 mx-2">|</span> {exp.duration}</div>
                                <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl">{exp.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="py-20 text-center border-t border-white/5 bg-black/50">
                    <p className="text-zinc-500 text-sm mb-8">End of Transmission</p>
                    <div className="flex justify-center gap-6">
                        <a href={`mailto:${data.email}`} className="text-white hover:text-indigo-400 transition-colors">
                            <Mail />
                        </a>
                    </div>
                </footer>

            </div>
        </div>
    );
}
