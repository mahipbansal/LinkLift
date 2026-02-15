"use client";


import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  Globe,
  Loader2,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Rocket,
  Plus,
  User,
  Share2
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

// --- TYPES ---
type ParsedResume = {
  name?: string;
  role?: string;
  email?: string;
  score?: number;
  skills?: string[];
  suggestions?: Array<{ area: string; issue: string; advice: string }>;
};

type ResumeRecord = {
  id: string;
  user_id: string;
  parsed_json: ParsedResume | null;
  slug: string | null;
  created_at: string;
};

// --- SEAMLESS ANIMATIONS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { user, isLoaded: userLoaded } = useUser(); // 🟢 Added isLoaded for better sync
  const [resume, setResume] = useState<ResumeRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestResume() {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) console.error("Supabase error:", error.message);

      setResume(data);
      setLoading(false);
    }

    if (userLoaded) {
      fetchLatestResume();
    }
  }, [user?.id, userLoaded]);

  if (loading || !userLoaded) return (
    <div className="flex min-h-screen items-center justify-center bg-[#05050A]">
      <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
    </div>
  );

  // 🟢 STEP 2: Intelligent Wiring for Name and Role
  // This extracts the data and provides fallbacks to user profile if AI fails
  const parsed = resume?.parsed_json || {};
  const displayName = parsed.name || user?.fullName || "User";
  const displayRole = parsed.role || "Professional Candidate";
  const displayScore = parsed.score || 85; // Fallback score if needed
  const userSlug = resume?.slug;

  if (!resume || !resume.parsed_json) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#05050A] gap-6">
      <h2 className="text-2xl font-bold">No Analysis Found</h2>
      <Link href="/upload" className="px-8 py-4 bg-indigo-600 rounded-full font-bold hover:bg-indigo-500 transition-all">
        Upload Resume to Start
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05050A] text-white pt-32 px-6 pb-20">

      {/* --- SEAMLESS HEADER --- */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Resume Intelligence
          </h1>
          <p className="text-zinc-400 mt-2 text-lg">
            {/* 🟢 Now uses displayName logic */}
            {displayName} • <span className="text-indigo-400">{displayRole}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          {userSlug && (
            <div className="flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
              <span className="pl-4 text-xs text-zinc-500 font-mono">stackd.krishnachaturvedi.in/{userSlug}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://stackd.krishnachaturvedi.in/${userSlug}`);
                  alert("Link copied to clipboard!");
                }}
                className="p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-500 transition-colors"
                title="Copy Link"
              >
                <Share2 size={14} />
              </button>
            </div>
          )}
          <Link href="/upload">
            <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all text-sm font-medium backdrop-blur-md">
              <Plus size={18} />
              Update Resume
            </button>
          </Link>
          <Link href="/portfolio/preview">
            <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 rounded-full hover:bg-indigo-500 transition-all text-sm font-bold shadow-lg shadow-indigo-500/20">
              <Globe size={18} />
              Manage Portfolio
            </button>
          </Link>
        </div>
      </motion.div>

      {/* --- UNIFIED REPORT CONTAINER --- */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto p-1 bg-gradient-to-b from-white/10 to-transparent rounded-[48px]"
      >
        <div className="bg-[#05050A] rounded-[47px] p-10 md:p-16 border border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">

            {/* LEFT: Analysis & Coaching */}
            <div className="lg:col-span-2 space-y-24">

              <motion.section variants={itemVariants} className="flex flex-col md:flex-row items-center gap-12">
                <div className="relative">
                  <svg className="h-40 w-40 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                    <motion.circle
                      cx="60" cy="60" r="54" fill="none" stroke="url(#dashGradient)" strokeWidth="8" strokeLinecap="round"
                      initial={{ strokeDasharray: "0 339" }}
                      animate={{ strokeDasharray: `${(displayScore) * 3.39} 339` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="dashGradient"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#a855f7" /></linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold">{displayScore}</span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Score</span>
                  </div>
                </div>
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <h3 className="text-2xl font-bold">Market Compatibility</h3>
                  <p className="text-zinc-400 leading-relaxed text-lg">
                    Your profile is optimized for <span className="text-white font-semibold">{displayRole}</span>.
                    Refining the areas identified below can significantly increase your callback rate.
                  </p>
                </div>
              </motion.section>

              <motion.section variants={itemVariants} className="space-y-12">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"><User size={20} /></div>
                  <h2 className="text-2xl font-bold">Expert AI Insights</h2>
                </div>

                <div className="space-y-10">
                  {parsed.suggestions && parsed.suggestions.length > 0 ? (
                    parsed.suggestions.map((s, i) => (
                      <div key={i} className="group relative border-l border-white/10 pl-8 py-2 hover:border-indigo-500 transition-colors">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">{s.area}</span>
                        <div className="space-y-4">
                          <div className="flex gap-3 text-zinc-300 italic text-lg leading-relaxed">
                            <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-1" />
                            "{s.issue}"
                          </div>
                          <div className="flex gap-3 text-white text-lg">
                            <Lightbulb size={18} className="text-emerald-500 shrink-0 mt-1" />
                            {s.advice}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-zinc-600">No career feedback available. Upload or re-analyze to see AI suggestions.</p>
                  )}
                </div>
              </motion.section>
            </div>

            {/* RIGHT: Skills Sidebar */}
            <motion.aside variants={itemVariants} className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-white/5 pt-12 lg:pt-0 lg:pl-12">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-8 flex items-center gap-2">
                <Sparkles size={16} className="text-purple-400" />
                Technical Arsenal
              </h3>
              <div className="flex flex-wrap gap-3">
                {parsed.skills?.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white/5 rounded-xl text-xs text-zinc-400 border border-white/5 hover:text-white hover:bg-white/10 transition-colors">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.aside>

          </div>
        </div>
      </motion.div>
    </div>
  );
}