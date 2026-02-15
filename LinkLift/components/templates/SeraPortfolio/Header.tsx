"use client";
import React, { useState, useEffect } from "react";
import {
    FaHome,
    FaLaptopCode,
    FaBriefcase,
    FaCode,
    FaEnvelope,
    FaBars,
} from "react-icons/fa";
import { cn } from "../../../lib/utils";

export default function Header() {
    const [activeLink, setActiveLink] = useState("home");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            // Update active link based on scroll position
            const sections = ["home", "skills", "experience", "projects", "contact"];
            const current = sections.find(section => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    return rect.top >= 0 && rect.top <= 300;
                }
                return false;
            });
            if (current) setActiveLink(current);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { id: "home", icon: FaHome, text: "Home" },
        { id: "skills", icon: FaCode, text: "Skills" },
        { id: "experience", icon: FaBriefcase, text: "Experience" },
        { id: "projects", icon: FaLaptopCode, text: "Projects" },
        { id: "contact", icon: FaEnvelope, text: "Contact" },
    ];

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            setActiveLink(id);
            setIsMenuOpen(false);
        }
    };

    return (
        <header className={cn(
            "fixed top-0 left-0 w-full z-50 transition-all duration-300",
            scrolled ? "bg-gray-900/95 backdrop-blur-md shadow-lg" : "bg-transparent"
        )}>
            <div className="md:fixed md:top-4 md:left-1/2 md:transform md:-translate-x-1/2 w-full md:w-auto">
                <div className="p-[2px] md:rounded-full bg-gradient-to-r from-emerald-400 via-cyan-500 to-indigo-500 animate-gradient-x">
                    <nav className="bg-gray-900/90 backdrop-blur-md md:rounded-full px-4 md:px-6 py-2.5">
                        {/* Mobile Menu Button */}
                        <div className="flex justify-between items-center md:hidden px-2">
                            <span className="text-white font-bold text-lg">Portfolio</span>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-white p-2"
                            >
                                <FaBars />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:block absolute md:static top-full left-0 w-full md:w-auto bg-gray-900 md:bg-transparent p-4 md:p-0 border-t md:border-none border-gray-800`}>
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-1 lg:gap-2">
                                {navLinks.map(({ id, icon: Icon, text }) => (
                                    <button
                                        key={id}
                                        onClick={() => scrollToSection(id)}
                                        className={cn(
                                            "px-3 py-2 md:py-1.5 rounded-lg md:rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 hover:bg-white/10",
                                            activeLink === id ? "bg-white/15 text-white" : "text-gray-300 hover:text-white"
                                        )}
                                    >
                                        <Icon className={cn("text-base", activeLink === id ? "scale-110" : "")} />
                                        <span className="inline">{text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}
