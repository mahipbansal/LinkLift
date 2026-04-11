"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, Copy, Check, FileText, Send } from "lucide-react";

export default function CoverLetterGenerator() {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [refining, setRefining] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!jobDescription.trim()) return;

    setLoading(true);
    setError("");
    setCoverLetter("");

    try {
      const response = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate cover letter");
      }

      setCoverLetter(data.coverLetter);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate cover letter");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToPortfolio = async () => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      const response = await fetch("/api/save-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverLetter }),
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        throw new Error("Failed to save");
      }
    } catch (err: unknown) {
      console.error(err);
      alert("Error saving to portfolio");
    } finally {
      setSaving(false);
    }
  };

  const handleRefine = async (action: string, tone?: string) => {
    setRefining(true);
    try {
      const response = await fetch("/api/refine-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentContent: coverLetter, action, tone }),
      });
      const data = await response.json();
      if (response.ok) {
        setCoverLetter(data.refinedContent);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRefining(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
          <FileText size={20} />
        </div>
        <h2 className="text-2xl font-bold">AI Cover Letter</h2>
      </div>

      <div className="relative group p-1 bg-gradient-to-b from-white/10 to-transparent rounded-[32px]">
        <div className="bg-[#0A0A10] rounded-[31px] p-8 border border-white/5">
          <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
            Paste the job description below, and LinkLift will craft a tailored cover letter using your resume data.
          </p>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            className="w-full h-40 bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all resize-none mb-6"
          />

          <button
            onClick={handleGenerate}
            disabled={loading || !jobDescription.trim()}
            className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Crafting Letter...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate Tailored Letter
              </>
            )}
          </button>

          {error && (
            <p className="mt-4 text-red-400 text-sm text-center font-medium">
              {error}
            </p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {coverLetter && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative p-1 bg-gradient-to-b from-purple-500/20 to-transparent rounded-[32px]"
          >
            <div className="bg-[#0A0A10] rounded-[31px] p-8 border border-white/5">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 italic">Generated Cover Letter</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-bold transition-all text-zinc-400 hover:text-white"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4 p-2 bg-black/40 rounded-2xl border border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 px-2 py-1">Tones:</span>
                <button 
                  onClick={() => handleRefine('tone', 'confident')}
                  disabled={refining}
                  className="px-3 py-1 bg-white/5 hover:bg-indigo-500/20 text-[10px] font-bold rounded-lg border border-white/5 transition-all"
                >
                  💪 Confident
                </button>
                <button 
                  onClick={() => handleRefine('tone', 'creative')}
                  disabled={refining}
                  className="px-3 py-1 bg-white/5 hover:bg-purple-500/20 text-[10px] font-bold rounded-lg border border-white/5 transition-all"
                >
                  🎨 Creative
                </button>
                <button 
                  onClick={() => handleRefine('tone', 'friendly')}
                  disabled={refining}
                  className="px-3 py-1 bg-white/5 hover:bg-amber-500/20 text-[10px] font-bold rounded-lg border border-white/5 transition-all"
                >
                  🤝 Friendly
                </button>
                <button 
                  onClick={() => handleRefine('tone', 'enthusiastic')}
                  disabled={refining}
                  className="px-3 py-1 bg-white/5 hover:bg-rose-500/20 text-[10px] font-bold rounded-lg border border-white/5 transition-all"
                >
                  🚀 Enthusiastic
                </button>
                <button 
                  onClick={() => handleRefine('tone', 'minimalist')}
                  disabled={refining}
                  className="px-3 py-1 bg-white/5 hover:bg-zinc-500/20 text-[10px] font-bold rounded-lg border border-white/5 transition-all"
                >
                  简洁 Minimalist
                </button>

                <div className="w-full h-px bg-white/10 my-1" />
                
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 px-2 py-1">Length:</span>
                <button 
                  onClick={() => handleRefine('expand')}
                  disabled={refining}
                  className="px-3 py-1 bg-white/5 hover:bg-emerald-500/20 text-[10px] font-bold rounded-lg border border-white/5 transition-all"
                >
                  ➕ Expand
                </button>
                <button 
                  onClick={() => handleRefine('reduce')}
                  disabled={refining}
                  className="px-3 py-1 bg-white/5 hover:bg-red-500/20 text-[10px] font-bold rounded-lg border border-white/5 transition-all"
                >
                  ➖ Reduce
                </button>
              </div>

              {/* CUSTOM INSTRUCTION */}
              <div className="mb-6 flex gap-3">
                <input 
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Need something specific? (e.g. 'Focus more on my Python skills')"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                  onKeyDown={(e) => e.key === 'Enter' && handleRefine('custom', customPrompt)}
                />
                <button 
                  onClick={() => handleRefine('custom', customPrompt)}
                  disabled={refining || !customPrompt}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs font-bold rounded-xl transition-all"
                >
                  Apply Instruction
                </button>
                {refining && <Loader2 className="animate-spin text-indigo-400 h-4 w-4 self-center" />}
              </div>

              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full h-[400px] bg-white/5 border border-white/10 rounded-2xl p-6 text-zinc-300 text-sm leading-relaxed font-serif focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all resize-none custom-scrollbar"
              />
              
              <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-[10px] text-zinc-500 italic">
                  Tip: You can edit the text above before saving it to your library.
                </p>
                <button 
                  onClick={handleSaveToPortfolio}
                  disabled={saving}
                  className={`flex items-center gap-2 text-xs font-bold transition-all ${
                    saveSuccess ? "text-emerald-400" : "text-indigo-400 hover:text-indigo-300"
                  }`}
                >
                  {saving ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : saveSuccess ? (
                    <Check size={14} />
                  ) : (
                    <Send size={14} />
                  )}
                  {saveSuccess ? "Saved to Library!" : "Save to Library"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
