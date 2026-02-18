"use client";

import { useEffect, useState, Suspense } from "react";
import { createClient } from "@supabase/supabase-js";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"; // 🟢 Added for redirecting to public link
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Share2,
  Check,
  ArrowLeft,
  SlidersHorizontal,
  Rocket,
  Loader2,
  X,
  ArrowRight,
  Layout,
  CreditCard,
  Lock
} from "lucide-react";
import { TEMPLATES } from "@/lib/templates";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function PortfolioPreviewContent() {
  const { user } = useUser();
  const router = useRouter(); // 🟢 Initialize router
  const [data, setData] = useState<any>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [userSlug, setUserSlug] = useState<string | null>(null); // 🟢 State to track the URL slug
  const [currentTemplateId, setCurrentTemplateId] = useState<string>("default");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [overrides, setOverrides] = useState<any>({});
  const [isPaid, setIsPaid] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("success")) {
      alert("Payment Successful! You can now deploy your portfolio.");
      // Optional: Clean URL
      window.history.replaceState(null, "", "/portfolio/preview");
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      // 🟢 Updated query to include 'slug' column
      const { data: resumes } = await supabase
        .from("resumes")
        .select("id, parsed_json, file_url, slug, template_id, is_paid")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (resumes && resumes.length > 0) {
        console.log("✅ Portfolio Data Found:", resumes[0]);
        setData(resumes[0].parsed_json);
        setFileUrl(resumes[0].file_url);
        setResumeId(resumes[0].id);
        setUserSlug(resumes[0].slug); // 🟢 Store slug locally
        if (resumes[0].template_id) setCurrentTemplateId(resumes[0].template_id);
        setIsPaid(resumes[0].is_paid || false);
      } else {
        console.warn("❌ No resumes found for user:", user.id);
      }
      setLoading(false);
    };
    fetchData();
  }, [user?.id]);

  const gV = (key: string, original: any) => overrides[key] ?? original;
  const updateField = (key: string, value: any) => setOverrides((prev: any) => ({ ...prev, [key]: value }));

  const saveToDb = async (silent = false) => {
    if (!resumeId) return false;
    setIsSaving(true);
    const updatedData = { ...data, ...overrides };

    // Optimistic Update
    const { error } = await supabase
      .from("resumes")
      .update({ parsed_json: updatedData })
      .eq("id", resumeId);

    setIsSaving(false);

    if (error) {
      console.error("Save Error:", error);
      alert("Failed to save changes.");
      return false;
    }

    setData(updatedData);
    setOverrides({});
    if (!silent) alert("Synced to Database!");
    return true;
  };

  const handleSave = () => saveToDb();

  const handleDeploy = async () => {
    if (!userSlug) {
      alert("No portfolio link found. Please try uploading your resume again.");
      return;
    }

    // 🟢 Auto-save if there are unsaved changes
    if (Object.keys(overrides).length > 0) {
      const saved = await saveToDb(true); // Silent save
      if (!saved) return; // Stop if save failed
    }

    setIsDeploying(true);
    try {
      // 🟢 Replace hardcoded URL with Environment Variable
      const VERCEL_HOOK_URL = process.env.NEXT_PUBLIC_VERCEL_BUILD_HOOK;

      // Note: Since the public page is force-dynamic, we technically don't need to rebuild
      // for content updates, finding the data is enough. But we'll keep the hook
      // if the user wants to ensure a fresh build or has other ISR paths.
      // We will just warn if it's missing but verify the slug works.

      if (VERCEL_HOOK_URL) {
        // Trigger build but don't wait for it continuously
        fetch(VERCEL_HOOK_URL, { method: "POST" }).catch(e => console.error("Deploy hook error:", e));
      }

      // Simulate a short delay so the user feels like "something happened"
      // and to allow Supabase a split second to propagate if needed (usually instant)
      await new Promise(r => setTimeout(r, 1500));

      alert("Launch Successful! Taking you to your live site...");
      // 🟢 Redirect to the public dynamic route: linklift.vercel.app/[slug]
      // Use window.open to open in new tab so they don't lose the editor
      window.open(`/${userSlug}`, '_blank');
      setIsDeploying(false);

    } catch (err) {
      console.error(err);
      alert("Deployment failed.");
      setIsDeploying(false);
    }
  };

  const handlePayment = async () => {
    if (!resumeId) return;
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId: resumeId })
      });
      const data = await res.json();
      
      if (!data.orderId) {
        alert("Failed to create order. Please try again.");
        return;
      }

      // Load Razorpay Script
      const loadScript = (src: string) => {
        return new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = src;
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const resLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!resLoaded) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "LinkLift Portfolio",
        description: "Portfolio Deployment",
        order_id: data.orderId,
        handler: function (response: any) {
             // Verify payment on success (Client side optimistic, verified by webhook)
             alert("Payment Successful! Deployment Unlocked.");
             setIsPaid(true);
        },
        prefill: {
            name: data.name || "User",
            email: data.email || "user@example.com",
            contact: ""
        },
        theme: {
            color: "#6366f1"
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error(err);
      alert("Payment Error");
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-indigo-500" size={48} /></div>;
  if (!data) return <div className="min-h-screen bg-black text-white flex items-center justify-center">No resume data found.</div>;

  // 🟢 DYNAMIC TEMPLATE RENDERING
  const TemplateComponent = TEMPLATES[currentTemplateId]?.component || TEMPLATES.default.component;

  return (
    <div className="relative">
      {/* Floating Toolbar */}
      <nav className="fixed top-6 right-6 z-[200] flex flex-col md:flex-row gap-3">
        <Link
          href="/portfolio/select-template"
          className="px-5 py-2.5 bg-black/80 backdrop-blur-xl rounded-full text-white text-xs font-bold hover:bg-zinc-800 transition-all flex items-center gap-2 border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] group"
        >
          <Layout size={14} className="group-hover:text-indigo-400 transition-colors" />
          Switch Design
        </Link>

        <button
          onClick={() => setCustomizeOpen(true)}
          className="px-5 py-2.5 bg-black/80 backdrop-blur-xl rounded-full text-white text-xs font-bold hover:bg-zinc-800 transition-all flex items-center gap-2 border border-white/10 shadow-2xl group"
        >
          <SlidersHorizontal size={14} className="group-hover:text-indigo-400 transition-colors" />
          Edit Content
        </button>

        {isPaid ? (
          <button
            onClick={handleDeploy}
            disabled={isDeploying}
            className="px-6 py-2.5 bg-indigo-600 rounded-full text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-[0_0_30px_-5px_rgba(99,102,241,0.5)] active:scale-95"
          >
            {isDeploying ? <Loader2 size={14} className="animate-spin" /> : <Rocket size={14} />}
            {isDeploying ? "Launching..." : "Deploy Live"}
          </button>
        ) : (
          <button
            onClick={handlePayment}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full text-white text-xs font-black uppercase tracking-widest hover:from-amber-400 hover:to-orange-500 transition-all flex items-center gap-2 shadow-[0_0_30px_-5px_rgba(245,158,11,0.5)] active:scale-95"
          >
            <Lock size={14} />
            Unlock Portfolio (₹100)
          </button>
        )}
      </nav>

      {/* The Actual Template */}
      <div className="w-full">
        <TemplateComponent data={data} />
      </div>

      {/* RE-USABLE CMS SIDEBAR (Minimalist version) */}
      <AnimatePresence>
        {customizeOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCustomizeOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[250]" />
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0a0a0f] border-l border-white/10 z-[300] p-10 overflow-y-auto flex flex-col shadow-2xl">
              <div className="flex justify-between items-center mb-10 text-white">
                <div>
                  <h3 className="text-xl font-bold">Content Editor</h3>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Syncs to live site instantly</p>
                </div>
                <button onClick={() => setCustomizeOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition"><X size={24} /></button>
              </div>

              <div className="space-y-10 flex-1">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">Hero & Socials</h4>
                  <div className="space-y-4">
                    <input value={gV('name', data.name)} onChange={(e) => updateField('name', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-indigo-500/50 transition-colors" placeholder="Full Name" />
                    <input value={gV('role', data.role)} onChange={(e) => updateField('role', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-indigo-500/50 transition-colors" placeholder="Headline / Role" />
                    <div className="grid grid-cols-2 gap-3">
                      <input value={gV('github', data.github)} onChange={(e) => updateField('github', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-xs outline-none focus:border-indigo-500/50 transition-colors" placeholder="GitHub URL" />
                      <input value={gV('linkedin', data.linkedin)} onChange={(e) => updateField('linkedin', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-xs outline-none focus:border-indigo-500/50 transition-colors" placeholder="LinkedIn URL" />
                    </div>
                    <textarea value={gV('bio', data.bio)} onChange={(e) => updateField('bio', e.target.value)} rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-indigo-500/50 transition-colors resize-none" placeholder="Elevator Pitch" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">Career Timeline</h4>
                  {gV('experience', data.experience)?.slice(0, 3).map((exp: any, i: number) => (
                    <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                      <input value={exp.company} onChange={(e) => { const n = [...gV('experience', data.experience)]; n[i].company = e.target.value; updateField('experience', n); }} className="w-full bg-transparent border-b border-white/10 text-white font-bold text-sm" />
                      <textarea value={exp.description} onChange={(e) => { const n = [...gV('experience', data.experience)]; n[i].description = e.target.value; updateField('experience', n); }} rows={2} className="w-full bg-transparent text-xs text-zinc-500 resize-none" />
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">Projects</h4>
                  {(gV('projects', data.projects) || [])?.slice(0, 3).map((proj: any, i: number) => (
                    <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                      <input value={proj.title} onChange={(e) => { const n = [...(gV('projects', data.projects) || [])]; n[i].title = e.target.value; updateField('projects', n); }} className="w-full bg-transparent border-b border-white/10 text-white font-bold text-sm" placeholder="Project Title" />
                      <input value={proj.link} onChange={(e) => { const n = [...(gV('projects', data.projects) || [])]; n[i].link = e.target.value; updateField('projects', n); }} className="w-full bg-transparent border-b border-white/10 text-indigo-400 text-xs" placeholder="Live Link (https://...)" />
                      <textarea value={proj.description} onChange={(e) => { const n = [...(gV('projects', data.projects) || [])]; n[i].description = e.target.value; updateField('projects', n); }} rows={2} className="w-full bg-transparent text-xs text-zinc-500 resize-none" placeholder="Project Description" />
                    </div>
                  ))}
                  {(!gV('projects', data.projects) || gV('projects', data.projects).length === 0) && (
                    <button
                      onClick={() => {
                        const newProjects = [{ title: "New Project", description: "Describe your project here...", technologies: [] }];
                        updateField('projects', newProjects);
                      }}
                      className="w-full py-3 border border-dashed border-white/20 rounded-2xl text-[10px] text-zinc-500 uppercase tracking-widest hover:border-indigo-500/50 hover:text-white transition-all"
                    >
                      + Add First Project
                    </button>
                  )}
                </div>
              </div>

              <div className="sticky bottom-0 bg-[#0a0a0f] pt-6 pb-2 border-t border-white/5 mt-10">
                <button onClick={handleSave} disabled={isSaving || Object.keys(overrides).length === 0} className="w-full flex items-center justify-center gap-3 py-4 bg-indigo-600 rounded-2xl font-bold text-white text-sm shadow-xl shadow-indigo-500/20 disabled:opacity-20 hover:bg-indigo-500 transition-all hover:scale-[1.02] active:scale-95">
                  {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                  Apply Updates
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PortfolioPreview() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-indigo-500" size={48} /></div>}>
      <PortfolioPreviewContent />
    </Suspense>
  );
}