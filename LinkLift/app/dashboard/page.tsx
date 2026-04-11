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
  Share2,
  Edit3,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import CoverLetterGenerator from "@/components/CoverLetterGenerator";
import DocumentLibrary from "@/components/DocumentLibrary";
import ResumeEditor from "@/components/ResumeEditor";
import { ResumeData } from "@/lib/types";

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
  const { user, isLoaded: userLoaded } = useUser();
  const [resume, setResume] = useState<ResumeRecord | null>(null);
  const [isEditing, setIsEditing] = useState(false);
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#05050A] p-6 text-center">
      <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400 mb-8 border border-indigo-500/20">
        <Rocket size={40} />
      </div>
      <h2 className="text-4xl font-bold mb-4">No Resume Found</h2>
      <p className="text-zinc-500 max-w-md mb-12 text-lg leading-relaxed">
        Upload an existing resume for analysis, or build a professional one from scratch with our AI builder.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-6">
        <Link href="/upload">
          <button className="px-10 py-5 bg-white text-black rounded-[24px] font-bold hover:scale-105 transition-all shadow-xl">
            Upload Existing PDF
          </button>
        </Link>
        <button 
          onClick={async () => {
             if (!user) return;
             // Logic to create a blank resume record
             const { data, error } = await supabase.from('resumes').insert({
               user_id: user.id,
               file_path: 'manual_creation',
               parsed_json: {
                 name: user.fullName || "",
                 role: "",
                 bio: "",
                 skills: [],
                 experience: [],
                 projects: []
               }
             }).select().single();
             if (data) window.location.reload();
          }}
          className="px-10 py-5 bg-indigo-600 text-white rounded-[24px] font-bold hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20"
        >
          Build from Scratch
        </button>
      </div>
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
              <span className="pl-4 text-xs text-zinc-500 font-mono">linklift.vercel.app/{userSlug}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://linklift.vercel.app/${userSlug}`);
                  alert("Link copied to clipboard!");
                }}
                className="p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-500 transition-colors"
                title="Copy Link"
              >
                <Share2 size={14} />
              </button>
            </div>
          )}
          <button 
            onClick={async () => {
              if (window.confirm("CRITICAL: Are you sure you want to permanently delete your resume and ALL career insights? This cannot be undone.")) {
                try {
                  const res = await fetch("/api/delete-full-resume", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ resumeId: resume.id }),
                  });
                  
                  if (res.ok) {
                    window.location.href = "/dashboard"; // Force a full navigation to clear state
                  } else {
                    const error = await res.json();
                    alert(`Deletion failed: ${error.error}`);
                  }
                } catch (err) {
                  alert("Network error occurred during deletion.");
                }
              }
            }}
            className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-full hover:bg-red-500 hover:text-white transition-all text-sm font-medium text-red-500"
          >
            <Trash2 size={18} />
            Delete Data
          </button>
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all text-sm font-medium backdrop-blur-md"
          >
            <Edit3 size={18} />
            Edit Info
          </button>
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
                    <span className="text-5xl font-bold">{resume.file_path === 'manual_creation' ? "?" : displayScore}</span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Score</span>
                  </div>
                </div>
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <h3 className="text-2xl font-bold">
                    {resume.file_path === 'manual_creation' ? "Building Your Profile..." : "Market Compatibility"}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed text-lg">
                    {resume.file_path === 'manual_creation' 
                      ? "You're building your resume from scratch! Click 'Edit Info' to add your experience. Once you're done, we'll analyze your market score."
                      : <>Your profile is optimized for <span className="text-white font-semibold">{displayRole}</span>. Refining the areas identified below can significantly increase your callback rate.</>
                    }
                  </p>
                </div>
              </motion.section>

              <motion.section variants={itemVariants} className="space-y-12">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"><User size={20} /></div>
                  <h2 className="text-2xl font-bold">Expert AI Insights</h2>
                </div>

                <div className="space-y-10">
                  {resume.file_path === 'manual_creation' ? (
                     <div className="p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl space-y-4">
                        <div className="flex items-center gap-3 text-indigo-400">
                           <Sparkles size={20} />
                           <h4 className="font-bold">Ready to stand out?</h4>
                        </div>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                           Since you're building your resume from scratch, our AI is waiting for more details! 
                           Use the <strong>Edit Info</strong> button at the top to add your professional journey. 
                           Don't forget to use the <strong>AI Improvement</strong> tools inside the editor for perfect phrasing!
                        </p>
                     </div>
                  ) : parsed.suggestions && parsed.suggestions.length > 0 ? (
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

              <motion.section variants={itemVariants} className="pt-12 border-t border-white/5">
                <CoverLetterGenerator />
              </motion.section>

              <motion.section variants={itemVariants}>
                <DocumentLibrary coverLetter={parsed.cover_letter} />
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

      {/* --- RESUME EDITOR MODAL --- */}
      <AnimatePresence>
        {isEditing && resume && resume.parsed_json && (
          <ResumeEditor 
            resumeId={resume.id} 
            initialData={resume.parsed_json as any} 
            onClose={() => setIsEditing(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}