"use client";
import React from "react";
import { Mail, MapPin, Send, Github, Linkedin, Twitter } from "lucide-react";
import { ResumeData } from "../../../lib/types";
import ContactForm from "@/components/ContactForm";

export default function Contact({ data }: { data: ResumeData }) {
    return (
        <section id="contact" className="py-20 bg-[#04081A] text-white">
            <div className="container mx-auto px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                    Get in Touch
                                </h2>
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center space-x-4 group">
                                    <div className="bg-blue-500/10 p-4 rounded-2xl group-hover:bg-blue-500/20 transition-colors">
                                        <Mail className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest">Email</h3>
                                        <p className="text-white font-medium">{data.email || "hello@example.com"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 group">
                                    <div className="bg-purple-500/10 p-4 rounded-2xl group-hover:bg-purple-500/20 transition-colors">
                                        <MapPin className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest">Location</h3>
                                        <p className="text-white font-medium">Remote / Global</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-8">
                                {data.github && (
                                    <a href={data.github.startsWith('http') ? data.github : `https://${data.github}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/10 hover:border-blue-500/50">
                                        <Github className="w-6 h-6" />
                                    </a>
                                )}
                                {data.linkedin && (
                                    <a href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/10 hover:border-blue-500/50">
                                        <Linkedin className="w-6 h-6" />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur opacity-25" />
                            <div className="relative bg-[#091121] p-8 rounded-3xl border border-white/10 shadow-2xl">
                                <div className="space-y-6">
                                    <ContactForm toName={data.name} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
