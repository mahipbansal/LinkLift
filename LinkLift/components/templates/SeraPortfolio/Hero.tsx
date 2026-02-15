"use client";
import { useState, useEffect } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css";
import { Meteors } from "../../ui/sera/meteors";
import SparklesText from "../../ui/sera/sparkles-text";
import { FlipWords } from "../../ui/sera/flip-words";
import { ResumeData } from "../../../lib/types";

// Grid Background
const GridBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_0%,black)]">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%"
                    height="100%"
                    className="absolute inset-0"
                >
                    <pattern
                        id="grid"
                        width="40"
                        height="40"
                        patternUnits="userSpaceOnUse"
                    >
                        <rect
                            width="40"
                            height="40"
                            fill="none"
                            stroke="white"
                            strokeWidth="0.5"
                            className="opacity-40 animate-gridPulse"
                        />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>
        </div>
    );
};

export default function Hero({ data }: { data: ResumeData }) {
    const words = [
        data.role || "Developer",
        "Tech Enthusiast",
        "Problem Solver",
        "Creative Thinker",
    ];

    const [code] = useState(`
const profile = {
    name: '${data.name}',
    role: '${data.role}',
    skills: [
        ${(data.skills || []).slice(0, 6).map(s => `'${s}'`).join(',\n        ')}
    ],
    passionate: true,
    hardWorker: true,
    problemSolver: true,
    hireable: function() {
        return (
            this.hardWorker &&
            this.problemSolver &&
            this.skills.length >= 5
        );
    }
};
  `);

    useEffect(() => {
        Prism.highlightAll();
    }, [code]);

    return (
        <section
            id="home"
            className="hero min-h-screen flex items-center justify-center relative px-4 sm:px-6 lg:px-8 py-20 lg:py-0 overflow-hidden"
        >
            <GridBackground />

            {/* Meteors Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <Meteors number={10} />
            </div>

            <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10 py-8 lg:py-12">
                <div className="w-full lg:w-1/2 mb-12 lg:mb-0 relative z-20">
                    <div className="absolute hidden lg:-top-20 lg:-left-20 lg:block w-48 h-48 lg:w-64 lg:h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

                    <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 mb-6 sm:mb-8">
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                        <span className="text-gray-300 text-xs sm:text-sm font-medium">
                            Welcome to my portfolio
                        </span>
                    </div>

                    <div className="relative mb-6 sm:mb-8">
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
                            <SparklesText text="Hello" className="text-white" />
                            <span className="relative inline-block text-white">
                                I&apos;m{" "}
                                <span className="typing-effect gradient-text">
                                    {data.name || "Creative Professional"}
                                </span>
                            </span>
                        </h1>
                    </div>

                    <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-500/10 to-teal-500/10 border border-blue-500/20 mb-6 sm:mb-8 backdrop-blur-sm">
                        <FlipWords
                            className="text-lg sm:text-xl text-blue-400 font-medium"
                            words={words}
                        />
                    </div>

                    <div className="relative mb-8 sm:mb-12 max-w-xl">
                        <p className="text-base sm:text-xl text-gray-300/90 leading-relaxed">
                            {data.bio || "Crafting digital experiences with precision and passion."}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        <button
                            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                            className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-teal-400 p-0.5 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_2rem_-0.5rem_#60A5FA]"
                        >
                            <span className="block w-full px-6 sm:px-8 py-3 sm:py-4 rounded-[11px] bg-gray-900 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-teal-400">
                                <span className="relative flex items-center justify-center gap-2 text-white font-medium">
                                    <span>View Projects</span>
                                </span>
                            </span>
                        </button>

                        <button
                            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                            className="group relative inline-flex items-center justify-center gap-3 p-0.5 rounded-xl bg-gradient-to-r from-gray-800 to-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_2rem_-0.5rem_#60A5FA]"
                        >
                            <span className="block w-full px-6 sm:px-8 py-3 sm:py-4 rounded-[11px] bg-gray-900 border border-gray-700/50 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-gray-800 group-hover:to-gray-700">
                                <span className="relative flex items-center justify-center gap-2 text-gray-300 font-medium group-hover:text-white">
                                    <span>Get in Touch</span>
                                </span>
                            </span>
                        </button>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 relative z-20 mt-10 lg:mt-0">
                    <div className="gradient-border">
                        <div className="code-window bg-[#091121]">
                            <div className="window-header">
                                <div className="window-dot bg-red-500"></div>
                                <div className="window-dot bg-yellow-500"></div>
                                <div className="window-dot bg-green-500"></div>
                                <span className="ml-2 text-sm text-gray-400 flex items-center gap-2">
                                    profile.js
                                </span>
                            </div>
                            <pre className="language-javascript">
                                <code className="language-javascript">{code}</code>
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
