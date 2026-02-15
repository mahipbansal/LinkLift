
"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import { Loader2 } from "lucide-react";

// Fallback loader for 3D elements
const CanvasLoader = () => {
    return (
        <div className="flex justify-center items-center h-full w-full">
            <span className="text-white text-sm font-bold flex gap-2">
                <Loader2 className="animate-spin" size={16} /> Loading 3D Model...
            </span>
        </div>
    );
};

const Computers = ({ isMobile }: { isMobile: boolean }) => {
    return (
        <group>
            <hemisphereLight intensity={0.15} groundColor='black' />
            <pointLight intensity={1} />
            <spotLight
                position={[-20, 50, 10]}
                angle={0.12}
                penumbra={1}
                intensity={1}
                castShadow
                shadow-mapSize={1024}
            />

            {/* Gaming Setup Container */}
            <group
                position={[0, isMobile ? -2.5 : -3.25, -1.5]}
                scale={isMobile ? 0.5 : 0.6}
                rotation={[0, 1.3, 0]}
            >

                {/* --- DESK --- */}
                <mesh position={[0, -0.5, 0]} receiveShadow>
                    <boxGeometry args={[10, 0.5, 5]} />
                    <meshStandardMaterial color="#0f0f0f" roughness={0.8} />
                </mesh>

                {/* --- GAMING PC TOWER --- */}
                <group position={[3.5, 1.5, 1]} rotation={[0, -0.3, 0]}>
                    {/* Case */}
                    <mesh castShadow receiveShadow>
                        <boxGeometry args={[1.2, 3.5, 3]} />
                        <meshStandardMaterial color="#050505" metalness={0.8} roughness={0.2} />
                    </mesh>
                    {/* Front RGB Strip */}
                    <mesh position={[0, 0, 1.51]}>
                        <boxGeometry args={[0.1, 3.5, 0.01]} />
                        <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={2} />
                    </mesh>
                    {/* Side Glass Panel (Internal RGB) */}
                    <mesh position={[-0.61, 0, 0]}>
                        <planeGeometry args={[0.1, 2.5]} />
                        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.5} transparent opacity={0.3} />
                    </mesh>
                </group>

                {/* --- MONITOR & VS CODE --- */}
                <group position={[0, 1.8, -0.5]}>
                    {/* Stand */}
                    <mesh position={[0, -1.5, 0]}>
                        <boxGeometry args={[0.5, 1.5, 0.5]} />
                        <meshStandardMaterial color="#111" />
                    </mesh>
                    <mesh position={[0, -2.3, 0.2]}>
                        <cylinderGeometry args={[0.8, 1, 0.2, 32]} />
                        <meshStandardMaterial color="#111" />
                    </mesh>

                    {/* Screen Frame */}
                    <group rotation={[0, 0, 0]}>
                        <mesh position={[0, 0, 0]}>
                            <boxGeometry args={[6.2, 3.6, 0.2]} />
                            <meshStandardMaterial color="#111" roughness={0.7} />
                        </mesh>

                        {/* --- VS CODE SCREEN CONTENT --- */}
                        <group position={[0, 0, 0.11]}>
                            {/* Background (Editor Dark Theme) */}
                            <mesh>
                                <planeGeometry args={[6, 3.4]} />
                                <meshStandardMaterial color="#1e1e1e" emissive="#1e1e1e" emissiveIntensity={0.8} />
                            </mesh>

                            {/* Left Sidebar (Activity Bar) */}
                            <mesh position={[-2.85, 0, 0.01]}>
                                <planeGeometry args={[0.3, 3.4]} />
                                <meshStandardMaterial color="#333" emissive="#333" />
                            </mesh>

                            {/* File Explorer */}
                            <mesh position={[-2.3, 0, 0.01]}>
                                <planeGeometry args={[0.8, 3.4]} />
                                <meshStandardMaterial color="#252526" emissive="#252526" />
                            </mesh>

                            {/* Top Tab Bar */}
                            <mesh position={[0.2, 1.55, 0.01]}>
                                <planeGeometry args={[4.2, 0.3]} />
                                <meshStandardMaterial color="#2d2d2d" emissive="#2d2d2d" />
                            </mesh>

                            {/* Bottom Status Bar */}
                            <mesh position={[0, -1.6, 0.01]}>
                                <planeGeometry args={[6, 0.2]} />
                                <meshStandardMaterial color="#007acc" emissive="#007acc" />
                            </mesh>

                            {/* Pseudo-Code Lines (Syntax Highlighting) */}
                            {[...Array(12)].map((_, i) => (
                                <group key={i} position={[-1.5, 1.2 - (i * 0.2), 0.02]}>
                                    {/* Line Number */}
                                    <mesh position={[-0.2, 0, 0]}>
                                        <planeGeometry args={[0.1, 0.05]} />
                                        <meshStandardMaterial color="#858585" />
                                    </mesh>
                                    {/* Keyword (Pink/Blue) */}
                                    <mesh position={[0.2, 0, 0]}>
                                        <planeGeometry args={[0.4, 0.08]} />
                                        <meshStandardMaterial color={i % 3 === 0 ? "#ff00ea" : "#569cd6"} emissive={i % 3 === 0 ? "#ff00ea" : "#569cd6"} />
                                    </mesh>
                                    {/* Variable/Text (White/Yellow) */}
                                    <mesh position={[0.8, 0, 0]}>
                                        <planeGeometry args={[0.6, 0.08]} />
                                        <meshStandardMaterial color={i % 2 === 0 ? "#dcdcaa" : "#ce9178"} emissive={i % 2 === 0 ? "#dcdcaa" : "#ce9178"} />
                                    </mesh>
                                    {/* Long code part */}
                                    <mesh position={[1.8, 0, 0]}>
                                        <planeGeometry args={[1.2, 0.08]} />
                                        <meshStandardMaterial color="#9cdcfe" emissive="#9cdcfe" />
                                    </mesh>
                                </group>
                            ))}
                        </group>
                    </group>
                </group>

                {/* --- KEYBOARD --- */}
                <group position={[0, 0, 1.5]} rotation={[-0.1, 0, 0]}>
                    <mesh>
                        <boxGeometry args={[3, 0.1, 1]} />
                        <meshStandardMaterial color="#222" />
                    </mesh>
                    {/* RGB Underglow */}
                    <mesh position={[0, -0.05, 0]}>
                        <boxGeometry args={[3.05, 0.05, 1.05]} />
                        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.5} />
                    </mesh>
                </group>

                {/* --- MOUSE --- */}
                <group position={[2.2, 0, 1.5]}>
                    <mesh>
                        <sphereGeometry args={[0.25, 32, 16]} scale={[1, 0.6, 1.5]} />
                        <meshStandardMaterial color="#222" />
                    </mesh>
                    {/* Mouse Wheel RGB */}
                    <mesh position={[0, 0.1, -0.15]}>
                        <boxGeometry args={[0.05, 0.05, 0.1]} />
                        <meshStandardMaterial color="#00ff00" emissive="#00ff00" />
                    </mesh>
                </group>

            </group>
        </group>
    );
};

const ComputersCanvas = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 500px)");
        setIsMobile(mediaQuery.matches);

        const handleMediaQueryChange = (event: MediaQueryListEvent) => {
            setIsMobile(event.matches);
        };

        mediaQuery.addEventListener("change", handleMediaQueryChange);

        return () => {
            mediaQuery.removeEventListener("change", handleMediaQueryChange);
        };
    }, []);

    return (
        <Canvas
            frameloop='demand'
            shadows
            dpr={[1, 2]}
            camera={{ position: [20, 3, 5], fov: 25 }}
            gl={{ preserveDrawingBuffer: true }}
        >
            <Suspense fallback={null}>
                <OrbitControls
                    enableZoom={false}
                    maxPolarAngle={Math.PI / 2}
                    minPolarAngle={Math.PI / 2}
                />
                <Computers isMobile={isMobile} />
            </Suspense>

            <Preload all />
        </Canvas>
    );
};

export default ComputersCanvas;
