"use client";

import React from "react";
import { ResumeData } from "@/lib/types";
import ContactForm from "@/components/ContactForm";

export const AntoineContact = ({ data }: { data: ResumeData }) => {
    return (
        <section id="contact" className="antoine-theme dark py-48">
            <div className="container mx-auto px-6 text-center">
                <p className="font-mono text-sm uppercase mb-12 opacity-70 tracking-widest">
                    Available for freelance work
                </p>
                <div className="max-w-xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-5 duration-1000">
                    <ContactForm toName={data.name} />
                </div>
                <div className="mt-24 flex flex-col md:flex-row justify-between items-center border-t border-current pt-12 gap-8">
                    <p className="text-2xl font-serif">© 2025 {data.name || "Candidate"}</p>
                    <div className="flex gap-12 font-mono uppercase text-sm">
                        {data.linkedin && (
                            <a href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`} target="_blank" rel="noopener noreferrer" className="antoine-link">LinkedIn</a>
                        )}
                        {data.github && (
                            <a href={data.github.startsWith('http') ? data.github : `https://${data.github}`} target="_blank" rel="noopener noreferrer" className="antoine-link">Github</a>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
