"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { AWaves } from "../../ui/antoine/waves";
import { BinarySeparator } from "../../ui/antoine/binary-separator";
import { ResumeData } from "@/lib/types";

export const AntoineHero = ({ data }: { data: ResumeData }) => {
    const titleRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        if (!titleRef.current) return;

        const chars = titleRef.current.querySelectorAll(".char");
        gsap.fromTo(chars,
            { y: "100%", opacity: 0 },
            {
                y: "0%",
                opacity: 1,
                duration: 1.5,
                ease: "expo.out",
                stagger: 0.05,
                delay: 0.5
            }
        );
    }, []);

    const splitText = (text: string) => {
        return text.split("").map((char, i) => (
            <span key={i} className="char inline-block" style={{ minWidth: char === " " ? "0.3em" : "auto" }}>
                {char}
            </span>
        ));
    };

    const name = data.name || "Creative Professional";
    const role = data.role || "Innovator & Developer";
    const bio = data.bio || "Crafting digital experiences with precision and passion.";

    return (
        <section className="relative min-h-screen flex flex-col justify-between overflow-hidden antoine-theme pt-32 pb-10">
            <AWaves className="opacity-40" />

            <div className="container mx-auto px-6 relative z-10 flex-grow flex flex-col justify-center">
                <BinarySeparator text={name.toUpperCase()} className="mb-12" />

                <h1 ref={titleRef} className="antoine-title mb-12">
                    <div className="overflow-hidden">
                        {splitText(role.split(" ")[0] || "Creative")}
                    </div>
                    <div className="flex items-center gap-8 overflow-hidden">
                        <img src="/globe.svg" alt="" className="w-16 h-16 md:w-32 md:h-32 rotate-12 invert" />
                        <span>{splitText(role.split(" ").slice(1).join(" ") || "Developer")}</span>
                    </div>
                </h1>

                <BinarySeparator text="DO THINGS YOUR WAY" />
            </div>

            <div className="container mx-auto px-6 relative z-10 mt-auto">
                <p className="max-w-2xl text-xl font-mono leading-tight uppercase">
                    {bio}
                </p>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-current" />
        </section>
    );
};
