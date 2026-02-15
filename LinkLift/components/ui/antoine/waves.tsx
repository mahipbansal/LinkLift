"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export const AWaves = ({ className }: { className?: string }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!svgRef.current || !containerRef.current) return;

        const svg = svgRef.current;
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        svg.setAttribute("width", width.toString());
        svg.setAttribute("height", height.toString());

        const xGap = 15;
        const yGap = 40;
        const linesCount = Math.ceil(width / xGap) + 1;
        const pointsCount = Math.ceil(height / yGap) + 1;

        const paths: SVGPathElement[] = [];
        const lines: any[] = [];

        for (let i = 0; i < linesCount; i++) {
            const points: any[] = [];
            for (let j = 0; j < pointsCount; j++) {
                points.push({
                    x: i * xGap,
                    y: j * yGap,
                    originX: i * xGap,
                    originY: j * yGap,
                });
            }
            lines.push(points);

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("fill", "none");
            path.setAttribute("stroke", "currentColor");
            path.setAttribute("stroke-width", "0.5");
            path.setAttribute("opacity", "0.2");
            svg.appendChild(path);
            paths.push(path);
        }

        let mouse = { x: 0, y: 0 };
        const handleMouseMove = (e: MouseEvent) => {
            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) {
                mouse.x = e.clientX - rect.left;
                mouse.y = e.clientY - rect.top;
            }
        };

        window.addEventListener("mousemove", handleMouseMove);

        const ticker = gsap.ticker.add((time: number) => {
            lines.forEach((points, i) => {
                let d = `M ${points[0].x} ${points[0].y}`;
                points.forEach((p: any, j: number) => {
                    const dx = mouse.x - p.originX;
                    const dy = mouse.y - p.originY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const force = Math.max(0, (200 - dist) / 200);

                    p.x = p.originX + Math.sin(time + i * 0.2) * 5 + dx * force * 0.2;
                    p.y = p.originY + Math.cos(time + j * 0.2) * 5 + dy * force * 0.2;

                    if (j > 0) {
                        d += ` L ${p.x} ${p.y}`;
                    }
                });
                paths[i].setAttribute("d", d);
            });
        });

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            gsap.ticker.remove(ticker);
        };
    }, []);

    return (
        <div ref={containerRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            <svg ref={svgRef} className="w-full h-full" />
        </div>
    );
};
