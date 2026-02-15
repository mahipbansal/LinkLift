"use client";

import React from "react";
import { ResumeData } from "@/lib/types";
import Header from "./SeraPortfolio/Header";
import Hero from "./SeraPortfolio/Hero";
import Skills from "./SeraPortfolio/Skills";
import Experience from "./SeraPortfolio/Experience";
import Projects from "./SeraPortfolio/Projects";
import Contact from "./SeraPortfolio/Contact";
import "./sera-portfolio.css";

export default function SeraPortfolio({ data }: { data: ResumeData }) {
  return (
    <div className="sera-portfolio min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
      <Header />
      <main>
        <Hero data={data} />
        <Skills data={data} />
        <Experience data={data} />
        <Projects data={data} />
        <Contact data={data} />
      </main>

      <footer className="py-10 text-center border-t border-white/5 bg-[#020617]">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} {data.name}. All rights reserved.
        </p>
      </footer>

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        
        .gradient-text {
          @apply bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-teal-400 to-emerald-400;
        }
      `}</style>
    </div>
  );
}
