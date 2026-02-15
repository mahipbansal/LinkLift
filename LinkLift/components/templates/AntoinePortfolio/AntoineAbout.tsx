"use client";

import React from "react";
import { ResumeData } from "@/lib/types";

export const AntoineAbout = ({ data }: { data: ResumeData }) => {
    return (
        <section id="about" className="antoine-theme dark py-32 border-b border-current">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-4">
                        <h2 className="text-8xl font-bold uppercase tracking-tighter mb-8 italic">About</h2>
                    </div>
                    <div className="lg:col-span-8 flex flex-col gap-12">
                        <div className="text-3xl md:text-5xl leading-[1.1] font-serif uppercase">
                            {data.bio || "Crafting digital experiences with precision and passion."}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
                            <div>
                                <h3 className="text-sm font-mono uppercase mb-4 opacity-70">// Skills</h3>
                                <ul className="flex flex-wrap gap-x-6 gap-y-2 uppercase text-2xl">
                                    {(data.skills || []).map((skill, i) => (
                                        <li key={i} className="antoine-link">{skill}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-sm font-mono uppercase mb-4 opacity-70">// Info</h3>
                                <div className="space-y-4">
                                    <p className="text-2xl uppercase">{data.email || "hello@example.com"}</p>
                                    <p className="text-2xl uppercase">Based in Earth</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
