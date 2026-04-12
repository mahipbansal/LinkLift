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
  Trash2,
  Building2,
  Briefcase,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  X
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
  bio?: string;
  score?: number;
  skills?: string[];
  education?: any[];
  experience?: any[];
  projects?: any[];
  cover_letter?: string;
  suggestions?: Array<{ area: string; issue: string; advice: string }>;
};

type ResumeRecord = {
  id: string;
  user_id: string;
  file_path: string;
  parsed_json: ParsedResume | null;
  slug: string | null;
  created_at: string;
};

// --- ANIMATIONS ---
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
  const [activeView, setActiveView] = useState<'insights' | 'companies'>('insights');
  const [scouting, setScouting] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [scoutLocation, setScoutLocation] = useState("Remote");
  const [applications, setApplications] = useState<any[]>([]);
  const [toast, setToast] = useState<{ show: boolean, message: string, type?: 'success' | 'info' | 'error' } | null>(null);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [applyStep, setApplyStep] = useState<string>("");
  const [showApplyModal, setShowApplyModal] = useState<any | null>(null);

  const handleScout = async (location: string) => {
    setScouting(true);
    try {
        const searchQuery = `${displayRole} ${parsed.skills?.slice(0, 3).join(" ") || ""}`;
        const res = await fetch("/api/scout-jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: searchQuery, location })
        });
        const result = await res.json();
        if (result.success) {
            setJobs(result.jobs);
            setIsLive(result.source === "real");
        }
    } catch (err) {
        console.error("Scouting failed:", err);
    } finally {
        setScouting(false);
    }
  };

  const handleApply = async (idx: number, job: any, overrideMethod?: 'email' | 'automation' | 'portal') => {
    if (job.applied || applyingJobId) return;
    
    // If no method chosen, show launchpad
    if (!overrideMethod) {
        setShowApplyModal(job);
        return;
    }

    // Close modal if open
    setShowApplyModal(null);
    setApplyingJobId(job.id || `${job.name}-${idx}`);
    
    try {
        let method = overrideMethod;
        let actionMessage = "";

        if (method === 'email') {
            setApplyStep("Drafting AI Outreach...");
            actionMessage = "Direct email sent to recruiter!";
        } else if (method === 'automation') {
            setApplyStep("Initiating Cloud Apply bot...");
            actionMessage = "Automated 'Easy-Apply' completed!";
        } else {
            setApplyStep("Bridging to Career Portal...");
            actionMessage = "Portal opened! Data ready to paste.";
        }

        await new Promise(r => setTimeout(r, 1200));

        const res = await fetch("/api/apply-job", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                jobTitle: job.role, 
                companyName: job.name, 
                userId: user?.id,
                method: method,
                applyUrl: job.apply_link
            })
        });

        if (method === 'portal' && job.apply_link) {
            window.open(job.apply_link, '_blank');
        }
        
        // Optimistic UI update
        const newJobs = [...jobs];
        newJobs[idx].applied = true;
        setJobs(newJobs);

        setToast({ show: true, message: actionMessage, type: 'success' });
        setTimeout(() => setToast(null), 4000);
        
        // Refresh apps list...
        const { data: appData } = await supabase.from('applications').select('*').eq('user_id', user?.id).order('created_at', { ascending: false });
        if (appData) setApplications(appData);

    } catch (err) {
        console.error("Application failed:", err);
        setToast({ show: true, message: "Smart apply service busy. Please try manual apply.", type: 'info' });
    } finally {
        setApplyingJobId(null);
        setApplyStep("");
    }
  };

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

    async function fetchApplications() {
        if (!user?.id) return;
        const { data } = await supabase
            .from('applications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
        if (data) setApplications(data);
    }

    if (userLoaded) {
        fetchLatestResume();
        fetchApplications();
    }
  }, [user?.id, userLoaded]);

  // Auto-scout when switching to companies view (once per session/resume load)
  useEffect(() => {
    if (activeView === 'companies' && jobs.length === 0 && !scouting) {
        handleScout(scoutLocation || "Remote");
    }
  }, [activeView, jobs.length, scouting, resume]);
  }, [activeView]);

  if (loading || !userLoaded) return (
    <div className="flex min-h-screen items-center justify-center bg-[#05050A]">
      <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
    </div>
  );

  const parsed = resume?.parsed_json || {};
  const displayName = parsed.name || user?.fullName || "User";
  const displayRole = parsed.role || "Professional Candidate";
  const displayScore = parsed.score || 85;
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
          <button className="px-10 py-5 bg-white text-black rounded-[24px] font-bold hover:scale-105 transition-all">Upload Existing PDF</button>
        </Link>
        <button 
          onClick={async () => {
             if (!user) return;
             const { data } = await supabase.from('resumes').insert({
               user_id: user.id,
               file_path: 'manual_creation',
               parsed_json: { name: user.fullName || "", role: "", bio: "", skills: [], experience: [], projects: [] }
             }).select().single();
             if (data) window.location.reload();
          }}
          className="px-10 py-5 bg-indigo-600 text-white rounded-[24px] font-bold hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
        >
          Build from Scratch
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05050A] text-white pt-32 px-6 pb-20 font-sans">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
        body { font-family: 'Outfit', sans-serif; }
      `}</style>

      {/* --- HEADER --- */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent uppercase">Resume Intelligence</h1>
          <p className="text-zinc-400 mt-2 text-lg font-medium">{displayName} • <span className="text-indigo-400">{displayRole}</span></p>
        </div>
        <div className="flex flex-wrap gap-4">
          {userSlug && (
            <div className="flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
              <span className="pl-4 text-xs text-zinc-500 font-mono">linklift.vercel.app/{userSlug}</span>
              <button onClick={() => {navigator.clipboard.writeText(`https://linklift.vercel.app/${userSlug}`); alert("Link copied!");}} className="p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-500 transition-colors"><Share2 size={14} /></button>
            </div>
          )}
          <Link href="/upload">
            <button className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all text-xs font-black uppercase tracking-widest">
              <RefreshCw size={18} />
              Change Resume
            </button>
          </Link>
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
                    window.location.href = "/dashboard";
                  } else {
                    const error = await res.json();
                    alert(`Deletion failed: ${error.error}`);
                  }
                } catch (err) {
                  alert("Network error occurred during deletion.");
                }
              }
            }}
            className="flex items-center gap-2 px-8 py-4 bg-red-500/10 border border-red-500/20 rounded-full hover:bg-red-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest text-red-500 shadow-lg shadow-red-500/5"
          >
            <Trash2 size={18} />
            Delete Data
          </button>
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all text-xs font-black uppercase tracking-widest"><Edit3 size={18} /> Edit Info</button>
          <Link href="/portfolio/preview"><button className="flex items-center gap-2 px-8 py-4 bg-indigo-600 rounded-full hover:bg-indigo-500 transition-all text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20"><Globe size={18} /> Portfolio</button></Link>
        </div>
      </motion.div>

      {/* --- VIEW SWITCHER --- */}
      <div className="max-w-7xl mx-auto mb-12 flex justify-center">
        <div className="p-2 bg-white/5 border border-white/10 rounded-[32px] flex gap-2 backdrop-blur-xl ring-1 ring-white/5 shadow-2xl">
          <button 
            onClick={() => setActiveView('insights')}
            className={`flex items-center gap-3 px-10 py-4 rounded-[26px] text-[10px] font-black uppercase tracking-[3px] transition-all duration-300 ${activeView === 'insights' ? 'bg-white text-black shadow-2xl' : 'text-zinc-500 hover:text-white'}`}
          >
            <Sparkles size={16} /> AI Insights
          </button>
          <button 
            onClick={() => setActiveView('companies')}
            className={`flex items-center gap-3 px-10 py-4 rounded-[26px] text-[10px] font-black uppercase tracking-[3px] transition-all duration-300 ${activeView === 'companies' ? 'bg-white text-black shadow-2xl' : 'text-zinc-500 hover:text-white'}`}
          >
            <Building2 size={16} /> Hiring Targets
          </button>
        </div>
      </div>

      {/* --- CONTENT CONTAINER --- */}
      <div className="max-w-7xl mx-auto p-1 bg-gradient-to-b from-white/10 to-transparent rounded-[52px]">
        <div className="bg-[#080810] rounded-[51px] border border-white/5 relative overflow-hidden shadow-inner">
          <AnimatePresence mode="wait">
            <motion.div 
               key={activeView}
               variants={containerVariants} 
               initial="hidden" 
               animate="visible" 
               exit="hidden"
               className="p-12 md:p-20"
            >
          
          {activeView === 'insights' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
              <div className="lg:col-span-2 space-y-24">
                <motion.section variants={itemVariants} className="flex flex-col md:flex-row items-center gap-12 p-10 bg-white/[0.02] border border-white/5 rounded-[40px]">
                  <div className="relative">
                    <svg className="h-44 w-44 -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                      <motion.circle cx="60" cy="60" r="54" fill="none" stroke="url(#dashGradient)" strokeWidth="8" strokeLinecap="round" initial={{ strokeDasharray: "0 339" }} animate={{ strokeDasharray: `${(displayScore) * 3.39} 339` }} transition={{ duration: 1.5 }} />
                      <defs><linearGradient id="dashGradient"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#a855f7" /></linearGradient></defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-6xl font-black">{resume.file_path === 'manual_creation' ? "?" : displayScore}</span>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-[4px] font-black">Score</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <h3 className="text-3xl font-black uppercase tracking-tight">{resume.file_path === 'manual_creation' ? "Building Profile..." : "Market Compatibility"}</h3>
                    <p className="text-zinc-400 leading-relaxed text-lg font-medium">
                      {resume.file_path === 'manual_creation' ? "You're building local! Add details to calculate your score." : <>Your profile is optimized for <span className="text-white font-bold">{displayRole}</span>.</>}
                    </p>
                  </div>
                </motion.section>

                <motion.section variants={itemVariants} className="space-y-16">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 border border-indigo-500/20"><User size={24} /></div>
                    <h2 className="text-3xl font-black uppercase tracking-tight">Expert AI Insights</h2>
                  </div>
                  <div className="space-y-8">
                    {parsed.suggestions?.map((s, i) => (
                      <div key={i} className="group relative border-l-4 border-white/5 pl-10 py-6 hover:border-indigo-500 transition-all bg-white/[0.01] rounded-r-3xl">
                        <span className="text-[10px] font-black uppercase tracking-[4px] text-zinc-500 mb-4 block">{s.area}</span>
                        <div className="space-y-4">
                           <div className="flex gap-4 text-zinc-400 italic text-lg leading-relaxed"><AlertTriangle size={20} className="text-amber-500 shrink-0 mt-1" />"{s.issue}"</div>
                           <div className="flex gap-4 text-white text-xl font-bold leading-snug"><Lightbulb size={20} className="text-emerald-500 shrink-0 mt-1" />{s.advice}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.section>
                <CoverLetterGenerator />
              </div>
              
              <div className="space-y-24">
                <motion.section variants={itemVariants}>
                  <DocumentLibrary coverLetter={parsed.cover_letter} />

                  {/* ACTIVE APPLICATIONS SECTION */}

                  {/* ACTIVE APPLICATIONS SECTION */}
                  {applications.length > 0 && (
                    <div className="mt-20 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                                <Rocket size={20} />
                            </div>
                            <h2 className="text-2xl font-bold uppercase tracking-tight">Active Applications</h2>
                        </div>
                        <div className="grid gap-4">
                            {applications.map((app, i) => (
                                <div key={i} className="p-6 bg-white/[0.03] border border-white/10 rounded-[24px] flex justify-between items-center group hover:bg-white/[0.05] transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center font-black text-xs text-indigo-400">
                                            {app.company_name.substring(0,2).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">{app.job_title}</div>
                                            <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{app.company_name}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[8px] font-black text-emerald-400 uppercase tracking-widest">
                                            {app.status}
                                        </div>
                                        <div className="text-[9px] text-zinc-600 font-bold uppercase">{new Date(app.created_at).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                  )}
                </motion.section>
                <motion.section variants={itemVariants} className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px]">
                   <h3 className="text-[10px] font-black uppercase tracking-[4px] text-zinc-500 mb-6 flex items-center gap-2"><Sparkles size={16} className="text-purple-400" /> Professional Arsenal</h3>
                   <div className="flex flex-wrap gap-2">
                     {parsed.skills?.map((s, i) => (
                       <span key={i} className="px-4 py-2 bg-white/5 rounded-xl text-[11px] font-bold text-zinc-400 border border-white/5 hover:text-white hover:bg-indigo-600 transition-all cursor-default">{s}</span>
                     ))}
                   </div>
                </motion.section>
              </div>
            </div>
          ) : (
              <div className="relative z-10">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/[0.03] rounded-full blur-[150px] -mr-80 -mt-80" />
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 px-4 gap-8">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic">Hiring Targets</h2>
                    <div className="flex items-center bg-white/[0.03] border border-white/10 p-2 rounded-[32px] pl-6 ring-1 ring-white/5 shadow-2xl">
                      <Globe className="text-indigo-400 mr-4" size={18} />
                      <input 
                        type="text" 
                        className="bg-transparent border-none outline-none text-sm font-bold text-white w-40 placeholder:text-zinc-600 uppercase tracking-widest"
                        placeholder="LOCATION..."
                        value={scoutLocation}
                        onChange={(e) => setScoutLocation(e.target.value)}
                      />
                      <button 
                        onClick={() => handleScout(scoutLocation)}
                        disabled={scouting}
                        className="p-4 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white transition-all disabled:opacity-50"
                      >
                        {scouting ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[3px] border transition-all ${
                      isLive ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-zinc-500/10 border-white/5 text-zinc-600'
                  }`}>
                      {isLive ? "● Live Scout Active" : "○ Local Database"}
                  </div>
                </div>
                  
                  {/* LOCATION SCOUTING BAR */}
                  <div className="w-full md:w-96 relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-[28px] blur opacity-25 group-hover:opacity-50 transition-all" />
                    <div className={`relative flex items-center bg-black/40 border rounded-[24px] px-6 py-4 backdrop-blur-md transition-all duration-500 ${
                        scouting ? 'border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'border-white/10'
                    }`}>
                        {scouting ? <Loader2 size={18} className="animate-spin text-indigo-400 mr-4" /> : <Globe size={18} className="text-zinc-600 mr-4 transition-colors group-hover:text-indigo-400" />}
                        <input 
                            type="text" 
                            placeholder="Scout Location (e.g. London, Remote)" 
                            value={scoutLocation}
                            onChange={(e) => setScoutLocation(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm font-bold text-white w-full placeholder:text-zinc-600 uppercase tracking-widest"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && scoutLocation) {
                                    handleScout(scoutLocation);
                                }
                            }}
                        />
                        <button 
                            disabled={scouting || !scoutLocation}
                            onClick={() => handleScout(scoutLocation)}
                            className={`p-2 ml-2 rounded-full transition-all hover:scale-110 active:scale-95 ${
                                scoutLocation ? 'text-indigo-400 hover:bg-indigo-500/10' : 'text-zinc-800'
                            }`}
                        >
                            {scouting ? <Loader2 size={18} className="animate-spin" /> : <ChevronRight size={18} />}
                        </button>
                    </div>
                  </div>

                  <div className="hidden md:flex gap-8">
                    <div className="px-10 py-6 bg-white/5 border border-white/10 rounded-[32px] flex flex-col shadow-inner"><span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Global Match</span><span className="text-3xl font-black text-indigo-400">92%</span></div>
                    <div className="px-10 py-6 bg-white/5 border border-white/10 rounded-[32px] flex flex-col shadow-inner"><span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Leads</span><span className="text-3xl font-black text-emerald-400">14</span></div>
                  </div>
                </div>

                {/* CATEGORY FILTERS */}
                <div className="flex flex-wrap gap-3 mb-12 px-4">
                  {['All Roles', 'Startups', 'Mid-Tier', 'Tier 1'].map((cat) => (
                    <button 
                        key={cat} 
                        className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-indigo-600/20 hover:border-indigo-500/40 transition-all"
                    >
                        {cat}
                    </button>
                  ))}
                </div>

              <div className="grid gap-6">
                {jobs.map((job, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="p-10 bg-white/[0.02] border border-white/5 rounded-[40px] flex items-center justify-between group hover:bg-white/[0.05] transition-all relative overflow-hidden ring-1 ring-white/5 shadow-2xl">
                    <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-all" />
                    
                    {/* SOURCE & CATEGORY BADGES */}
                    <div className="absolute top-5 right-8 flex gap-3">
                        {job.status === 'New' && (
                            <div className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1.5">
                                <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                                {job.posted || "New"}
                            </div>
                        )}
                        <div className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-white/5 border border-white/10 text-zinc-500">
                            {job.cat}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                            job.source === 'LinkedIn' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                            job.source === 'Internshala' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                            'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        }`}>
                            {job.source}
                        </div>
                    </div>

                    <div className="flex items-center gap-10">
                      <div className="w-20 h-20 bg-black/60 rounded-3xl flex items-center justify-center font-black text-sm text-white border border-white/10 group-hover:border-indigo-500/50 shadow-2xl transition-all">{job.name.substring(0,2).toUpperCase()}</div>
                      <div>
                        <h4 className="text-2xl font-black text-white leading-tight">{job.name}</h4>
                        <div className="flex items-center gap-5 mt-3">
                          <span className="text-sm font-bold text-zinc-400">{job.role}</span>
                          <span className="w-1.5 h-1.5 bg-zinc-800 rounded-full" />
                          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[2px]">{job.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-14 text-right">
                      <div><div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Estimate</div><div className="text-lg font-black text-white">{job.salary}</div></div>
                      <div className="flex flex-col items-center justify-center bg-indigo-500/10 border border-indigo-500/20 px-8 py-4 rounded-3xl min-w-[110px]"><span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Match</span><span className="text-2xl font-black text-white">{job.score}%</span></div>
                      <button 
                        onClick={() => handleApply(idx, job)}
                        disabled={job.applied || applyingJobId === (job.id || `${job.name}-${idx}`)}
                        className={`px-12 py-5 rounded-[28px] text-[10px] font-black uppercase tracking-[3px] transition-all shadow-2xl group-hover:scale-105 active:scale-95 flex items-center gap-3 ${
                            job.applied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 
                            applyingJobId === (job.id || `${job.name}-${idx}`) ? 'bg-indigo-600/50 text-white cursor-wait' :
                            'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                        }`}
                      >
                        {applyingJobId === (job.id || `${job.name}-${idx}`) ? (
                            <>
                                <Loader2 className="animate-spin" size={14} />
                                {applyStep}
                            </>
                        ) : job.applied ? 'Applied' : 'Auto-Apply'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-20 p-16 border-2 border-dashed border-white/5 rounded-[56px] bg-white/[0.01] text-center">
                <Sparkles className="mx-auto text-indigo-400 mb-8" size={48} />
                <h5 className="text-xl font-black text-white uppercase tracking-[6px] mb-6">Continuous Career Scouting</h5>
                <p className="text-sm text-zinc-500 max-w-xl mx-auto font-medium leading-relaxed px-10">
                  LinkLift is autonomously monitoring global hiring markets. We analyze thousands of positions daily to find the ones that deserve your expertise.
                </p>
              </div>
            </div>
          )} </motion.div> </AnimatePresence> </div> </div>


      {/* APPLICATION LAUNCHPAD MODAL */}
      <AnimatePresence>
        {showApplyModal && (
            <div className="fixed inset-0 z-[250] flex items-center justify-center px-6">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowApplyModal(null)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-xl bg-[#0F0F1A] border border-white/10 rounded-[40px] shadow-2xl p-10 overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-6">
                        <button onClick={() => setShowApplyModal(null)} className="p-2 hover:bg-white/10 rounded-full text-zinc-500"><X size={24} /></button>
                    </div>

                    <div className="space-y-10">
                        <div className="space-y-2 text-center sm:text-left">
                            <h3 className="text-3xl font-black uppercase tracking-tight text-white">Application Launchpad</h3>
                            <p className="text-sm text-zinc-400 font-medium">Outreach strategy for <span className="text-indigo-400">{showApplyModal.name}</span></p>
                        </div>

                        <div className="grid gap-4">
                            {/* EMAIL */}
                            <button 
                                onClick={() => handleApply(0, showApplyModal, 'email')}
                                disabled={!showApplyModal.description?.includes('@')}
                                className={`p-6 border rounded-3xl flex items-center justify-between group transition-all text-white ${
                                    showApplyModal.description?.includes('@') 
                                    ? 'bg-white/[0.03] border-white/10 hover:bg-white/5 hover:border-indigo-500/50' 
                                    : 'bg-zinc-900/50 border-white/5 opacity-50 cursor-not-allowed'
                                }`}
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400"><Briefcase size={22} /></div>
                                    <div className="text-left">
                                        <div className="font-bold text-lg">Direct Email Outreach</div>
                                        <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                                            {showApplyModal.description?.includes('@') ? "Recruiter Contact Found" : "No Direct Email Detected"}
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight size={20} className="text-zinc-700 group-hover:text-indigo-400 transition-colors" />
                            </button>

                            {/* AUTOMATION */}
                            <button 
                                onClick={() => handleApply(0, showApplyModal, 'automation')}
                                className="p-6 bg-white/[0.03] border border-white/10 rounded-3xl flex items-center justify-between group hover:bg-white/5 hover:border-purple-500/50 transition-all text-white"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400"><Rocket size={22} /></div>
                                    <div className="text-left">
                                        <div className="font-bold text-lg">Cloud Apply Bot</div>
                                        <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Rapid 'Easy-Apply' Simulation</div>
                                    </div>
                                </div>
                                <ChevronRight size={20} className="text-zinc-700 group-hover:text-purple-400 transition-colors" />
                            </button>

                            {/* PORTAL */}
                            <button 
                                onClick={() => handleApply(0, showApplyModal, 'portal')}
                                className="p-6 bg-white/[0.03] border border-white/10 rounded-3xl flex items-center justify-between group hover:bg-white/5 hover:border-emerald-500/50 transition-all text-white"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400"><Globe size={22} /></div>
                                    <div className="text-left">
                                        <div className="font-bold text-lg">Official Career Portal</div>
                                        <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Bridge to Career Site</div>
                                    </div>
                                </div>
                                <ChevronRight size={20} className="text-zinc-700 group-hover:text-emerald-400 transition-colors" />
                            </button>
                        </div>
                        <div className="pt-6 border-t border-white/5 text-center">
                            <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[4px]">Verified LinkLift DNA Search Agent</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditing && resume && resume.parsed_json && (
          <ResumeEditor resumeId={resume.id} initialData={resume.parsed_json as any} onClose={() => setIsEditing(false)} />
        )}
      </AnimatePresence>

      {/* SNACKBAR TOAST */}
      <AnimatePresence>
        {toast && toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] px-8 py-4 bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center gap-3 font-bold"
          >
            <CheckCircle2 size={20} />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}