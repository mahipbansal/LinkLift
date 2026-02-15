"use client";

import React, { useState, useEffect } from "react";

export const BinarySeparator = ({
    text = "DO THINGS YOUR WAY",
    className = ""
}: {
    text?: string,
    className?: string
}) => {
    const [binary, setBinary] = useState<string>("");

    useEffect(() => {
        const toBinary = (str: string) => {
            return str.split("").map(char => {
                if (char === " ") return " ";
                return char.charCodeAt(0).toString(2).padStart(8, "0");
            }).join(" ");
        };

        let currentBinary = toBinary(text);
        setBinary(currentBinary);

        const interval = setInterval(() => {
            setBinary(prev => {
                return prev.split("").map(char => {
                    if (char === " " || char === "\n") return char;
                    return Math.random() > 0.95 ? (char === "0" ? "1" : "0") : char;
                }).join("");
            });
        }, 100);

        return () => clearInterval(interval);
    }, [text]);

    return (
        <div className={`w-full border-y border-current py-2 overflow-hidden whitespace-nowrap font-mono text-[10px] opacity-50 ${className}`}>
            <div className="flex gap-8 animate-marquee">
                <span>{binary}</span>
                <span>{binary}</span>
                <span>{binary}</span>
            </div>
            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }
                .animate-marquee {
                    display: inline-flex;
                    animation: marquee 20s linear infinite;
                }
            `}</style>
        </div>
    );
};
