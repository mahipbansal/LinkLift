"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Sparkles, Loader2, Plus, Trash2, Edit3, Download, File, FileCode, GraduationCap, Briefcase, Code, Award, Medal, User, Link as LinkIcon, Rocket, Settings2, LayoutTemplate, Layers, ChevronUp, ChevronDown, CheckCircle2, Building2, Building2, ExternalLink } from "lucide-react";
import { ResumeData, Education, Experience, Project } from "@/lib/types";

interface ResumeEditorProps {
  resumeId: string;
  initialData: ResumeData;
  onClose: () => void;
}

export default function ResumeEditor({ resumeId, initialData, onClose }: ResumeEditorProps) {
  // Ensure initial data has all arrays initialized
  const [data, setData] = useState<ResumeData>({
    ...initialData,
    contact: initialData.contact || "",
    linkedin: initialData.linkedin || "",
    github: initialData.github || "",
    education: initialData.education || [],
    experience: initialData.experience || [],
    projects: initialData.projects || [],
    customSections: initialData.customSections || [],
    layoutConfig: initialData.layoutConfig || {
       order: ['profile', 'education', 'experience', 'projects', 'skills', 'extras'],
       side: { profile: 'full', education: 'left', experience: 'right', projects: 'full', skills: 'left', extras: 'right' },
       titles: { profile: 'Profile', education: 'Education', experience: 'Experience', projects: 'Projects', skills: 'Expertise', extras: 'Honors & Certs' }
    }
  });
  
  const [showArchitect, setShowArchitect] = useState(false);
  const [activeTab, setActiveTab] = useState("basics");
  const [saving, setSaving] = useState(false);
  const [refining, setRefining] = useState<{ [key: string]: boolean }>({});
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/update-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId, updatedData: data }),
      });
      if (response.ok) {
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const refineField = async (field: keyof ResumeData, value: string) => {
    setRefining(prev => ({ ...prev, [field]: true }));
    try {
      const response = await fetch("/api/refine-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          currentContent: value, 
          action: "custom", 
          tone: "Improve this text to be professional, impactful, and concise for a high-end resume." 
        }),
      });
      const result = await response.json();
      if (response.ok && result.refinedContent) {
        // Clean up markdown code blocks if the AI includes them
        const cleaned = result.refinedContent.replace(/```[a-z]*\n([\s\S]*?)```/g, '$1').trim();
        setData(prev => ({ ...prev, [field]: cleaned }));
      } else {
        alert(result.error || "Failed to refine text. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("A network error occurred while refining your text.");
    } finally {
      setRefining(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleDownload = (format: 'pdf' | 'word') => {
    if (format === 'word') {
      const content = `
        ${data.name}\n${data.role}\n${data.email} | ${data.contact || ''}\n${data.linkedin || ''} | ${data.github || ''}\n\n
        BIO\n${data.bio}\n\n
        EDUCATION\n
        ${data.education.map(e => `${e.degree} - ${e.institution} (${e.timeline}) - ${e.percentage || ''}`).join('\n')}
        \nSKILLS\n${data.skills.join(', ')}\n\n
        EXPERIENCE\n
        ${data.experience.length > 0 ? `\nEXPERIENCE\n${data.experience.map(e => `${e.role} at ${e.company} (${e.duration})\n${e.description}`).join('\n\n')}` : ''}
        ${data.projects.length > 0 ? `\nPROJECTS\n${data.projects.map(p => `${p.title}\n${p.description}`).join('\n\n')}` : ''}
        ${(data.certifications?.length || 0) + (data.achievements?.length || 0) > 0 ? `\nCERTIFICATIONS & ACHIEVEMENTS\n${[...(data.certifications || []), ...(data.achievements || [])].join('\n')}` : ''}
      `;
      const blob = new Blob([content], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.name.replace(/\s+/g, '_')}_Resume.doc`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        // --- PRECISION GRID ENGINE (Strict Rows) ---
        const config = data.layoutConfig || { 
            order: ['basics', 'education', 'experience', 'projects', 'skills', 'extras'],
            side: { basics: 'full', education: 'left', experience: 'right', projects: 'full', skills: 'left', extras: 'right' },
            titles: { basics: 'Profile', education: 'Education', experience: 'Experience', projects: 'Projects', skills: 'Expertise', extras: 'Other' }
        };

        const getSectionHtml = (id: string) => {
            const title = config.titles?.[id] || id;
            if ((id === 'profile' || id === 'basics') && data.bio) return `<div class="full-section"><h2>${title}</h2><div class="desc">${data.bio}</div></div>`;
            if ((id === 'edu' || id === 'education') && data.education.length > 0) return `
                <section>
                    <h2>${title}</h2>
                    ${data.education.map(e => `<div class="item"><div class="it-h"><span>${e.institution}</span></div><div class="it-s">${e.degree}</div><div class="desc" style="color:#666; font-size:7.5pt">${e.timeline} • ${e.percentage || ''}</div></div>`).join('')}
                </section>`;
            if ((id === 'exp' || id === 'experience') && data.experience.length > 0) return `
                <section>
                    <h2>${title}</h2>
                    ${data.experience.map(e => `<div class="item"><div class="it-h"><span>${e.role}</span> <span style="font-size:7pt; color:#666">${e.duration}</span></div><div class="it-s">${e.company}</div><div class="desc">${e.description}</div></div>`).join('')}
                </section>`;
            if ((id === 'proj' || id === 'projects') && data.projects.length > 0) return `
                <div class="full-section">
                    <h2>${title}</h2>
                    ${data.projects.map(p => `<div class="item"><div class="it-h"><span>${p.title}</span></div><div class="desc">${p.description}</div></div>`).join('')}
                </div>`;
            if ((id === 'skills' || id === 'skills') && data.skills.length > 0) return `
                <section>
                    <h2>${title}</h2>
                    <div class="skills-grid" style="grid-template-columns: repeat(2, 1fr); gap: 4px 15px;">
                        ${data.skills.map((s, idx) => {
                            const isLast = idx === data.skills.length - 1;
                            const isOdd = data.skills.length % 2 !== 0;
                            const style = (isLast && isOdd) ? 'grid-column: span 2; display: flex; justify-content: flex-start; width: 100%;' : '';
                            return `<div class="list-item" style="${style}"><span class="bullet" style="color:#6366f1">▪</span> <span style="font-size:8pt">${s}</span></div>`;
                        }).join('')}
                    </div>
                </section>`;
            if ((id === 'certs' || id === 'extras') && ((data.certifications?.length || 0) + (data.achievements?.length || 0) > 0)) {
                const items = [...(data.certifications || []), ...(data.achievements || [])];
                return `
                <section>
                    <h2>${title}</h2>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 3px 15px;">
                        ${items.map((item, idx) => {
                            const isLast = idx === items.length - 1;
                            const isOdd = items.length % 2 !== 0;
                            const style = (isLast && isOdd) ? 'grid-column: span 2; display: flex; justify-content: flex-start; width: 100%;' : '';
                            return `<div class="list-item" style="${style}"><span class="bullet" style="color:#6366f1; font-size:9pt">▹</span> <span style="font-size:8pt">${item}</span></div>`;
                        }).join('')}
                    </div>
                </section>`;
            }
            const custom = data.customSections?.find(c => c.id === id);
            if (custom) return `<section><h2>${title}</h2><div class="desc">${custom.content}</div></section>`;
            return "";
        };

        // Render sections in strict grid rows
        const rowsHtml: string[] = [];
        let i = 0;
        const processedIds = new Set();

        while (i < config.order.length) {
            const id = config.order[i];
            if (processedIds.has(id)) { i++; continue; }
            
            const side = config.side[id];
            const content = getSectionHtml(id);
            processedIds.add(id);

            if (side === 'full') {
                if (content) rowsHtml.push(`<div class="full-section">${content}</div>`);
                i++;
            } else {
                let left = side === 'left' ? content : '';
                let right = side === 'right' ? content : '';

                // Look ahead for a potential pair in the NEXT item only
                // This ensures we don't 'pull' sections from further down up into this row
                if (i + 1 < config.order.length) {
                    const nextId = config.order[i+1];
                    const nextSide = config.side[nextId];
                    if (nextSide !== 'full' && nextSide !== side) {
                        // It's the opposite side, so pair them
                        const nextContent = getSectionHtml(nextId);
                        if (side === 'left') right = nextContent;
                        else left = nextContent;
                        processedIds.add(nextId);
                    }
                }
                
                // Only push if at least one side has content
                if (left || right) {
                    rowsHtml.push(`
                        <div class="grid-row">
                            <div class="grid-col">${left}</div>
                            <div class="grid-col">${right}</div>
                        </div>
                    `);
                }
                i++;
            }
        }

        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${data.name} - Resume</title>
              <style>
                @page { size: A4; margin: 0; }
                * { box-sizing: border-box; }
                body { font-family: 'Inter', system-ui, sans-serif; padding: 30px 45px; color: #111; line-height: 1.25; font-size: 8pt; background: white; margin: 0; }
                header { margin-bottom: 15px; text-align: center; border-bottom: 2px solid #6366f1; padding-bottom: 10px; }
                h1 { margin: 0; text-transform: uppercase; letter-spacing: 2px; font-size: 18pt; color: #000; font-weight: 900; }
                .role { color: #6366f1; font-weight: 700; font-size: 11pt; margin-top: 2px; }
                .contact { font-size: 7.5pt; color: #555; margin-top: 5px; }
                h2 { font-size: 10pt; text-transform: uppercase; color: #000; border-bottom: 2px solid #6366f1; padding-bottom: 2px; margin-top: 15px; margin-bottom: 8px; font-weight: 900; letter-spacing: 1px; }
                .item { margin-bottom: 8px; page-break-inside: avoid; }
                .it-h { display: flex; justify-content: space-between; font-weight: 800; font-size: 9.5pt; }
                .it-s { color: #6366f1; font-size: 8.5pt; font-weight: 700; }
                .desc { font-size: 8.5pt; color: #333; margin-top: 3px; line-height: 1.35; white-space: pre-wrap; }
                .full-section { width: 100%; margin-bottom: 12px; }
                .grid-row { display: flex; gap: 35px; margin-bottom: 12px; width: 100%; }
                .grid-col { flex: 1; min-height: 5px; }
                .skills-grid { display: grid; grid-template-cols: repeat(2, 1fr); gap: 4px 12px; }
                .list-item { display: flex; gap: 6px; align-items: flex-start; margin-bottom: 1px; }
                .bullet { color: #6366f1; font-weight: 900; font-size: 8.5pt; line-height: 1.2; }
              </style>
            </head>
            <body>
              <header>
                <h1>${data.name}</h1>
                <div class="role">${data.role}</div>
                <div class="contact">${data.email} | ${data.contact || ''} | ${data.linkedin || ''} | ${data.github || ''}</div>
              </header>
              ${rowsHtml.join('')}
              <script>window.onload = function() { window.print(); window.close(); }</script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
    setShowDownloadMenu(false);
  };

  const tabs = [
    { id: "basics", icon: User, label: "Profile" },
    { id: "education", icon: GraduationCap, label: "Education" },
    { id: "skills", icon: Code, label: "Expertise" },
    { id: "experience", icon: Briefcase, label: "Experience" },
    { id: "projects", icon: Rocket, label: "Projects" },
    { id: "extras", icon: Award, label: "Other" },
    { id: "companies", icon: Building2, label: "Companies" },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative w-full max-w-[95vw] bg-[#0A0A18] border border-white/10 rounded-[40px] shadow-2xl flex flex-col h-[95vh] overflow-hidden"
      >
        {/* HEADER */}
        <div className="p-4 border-b border-white/5 bg-black/40 px-6 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black text-white uppercase tracking-tight">Resume Builder</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
                onClick={() => setShowArchitect(!showArchitect)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    showArchitect ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/5 text-indigo-400 border border-indigo-500/20 hover:bg-white/10'
                }`}
            >
                <Settings2 size={14} /> {showArchitect ? "Hide Architect" : "Open Architect"}
            </button>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-all">
                <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* SIDEBAR TABS */}
          <div className="w-48 border-r border-white/5 bg-black/20 p-4 space-y-1 overflow-y-auto custom-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                   setActiveTab(tab.id);
                   setShowArchitect(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id && !showArchitect ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-zinc-500 hover:bg-white/5 hover:text-white"
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {!showArchitect ? (
                <motion.div 
                    key="form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-12 bg-zinc-900/10"
                >
                    {activeTab === "basics" && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-1">Full Name</label>
                                    <input value={data.name} onChange={e => setData({...data, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all"/>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-1">Gmail / Email</label>
                                    <input value={data.email} onChange={e => setData({...data, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all"/>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-1">LinkedIn URL</label>
                                    <input value={data.linkedin || ""} onChange={e => setData({...data, linkedin: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all"/>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-1">GitHub URL</label>
                                    <input value={data.github || ""} onChange={e => setData({...data, github: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all"/>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-1">Contact No</label>
                                    <input value={data.contact || ""} onChange={e => setData({...data, contact: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all"/>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-1">Job Role</label>
                                    <input value={data.role} onChange={e => setData({...data, role: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all"/>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">About Me</label>
                                    <button onClick={() => refineField('bio', data.bio)} disabled={refining['bio']} className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 hover:text-indigo-300">
                                        {refining['bio'] ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} IMPROVE WITH AI
                                    </button>
                                </div>
                                <textarea value={data.bio} onChange={e => setData({...data, bio: e.target.value})} className="w-full h-32 bg-white/5 border border-white/10 rounded-3xl p-6 focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all resize-none text-zinc-300"/>
                            </div>
                        </div>
                    )}

                    {activeTab === "education" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">Academic Background</h3>
                                <button onClick={() => setData({...data, education: [...data.education, {institution: "", degree: "", timeline: "", percentage: ""}]})} className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-xl text-xs font-bold"><Plus size={14} /> Add Entry</button>
                            </div>
                            <div className="space-y-6">
                                {data.education.map((edu, i) => (
                                    <div key={i} className="p-8 bg-white/5 border border-white/5 rounded-[32px] space-y-6 relative group transition-all hover:bg-white/10">
                                        <button onClick={() => setData({...data, education: data.education.filter((_, idx) => idx !== i)})} className="absolute top-6 right-6 p-2 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18} /></button>
                                        <div className="grid grid-cols-2 gap-6">
                                            <input value={edu.institution} placeholder="University" onChange={e => {const newE = [...data.education]; newE[i].institution = e.target.value; setData({...data, education: newE});}} className="w-full bg-transparent border-b border-white/10 py-2 outline-none focus:border-indigo-500"/>
                                            <input value={edu.degree} placeholder="Degree" onChange={e => {const newE = [...data.education]; newE[i].degree = e.target.value; setData({...data, education: newE});}} className="w-full bg-transparent border-b border-white/10 py-2 outline-none focus:border-indigo-500"/>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <input value={edu.timeline} placeholder="Timeline" onChange={e => {const newE = [...data.education]; newE[i].timeline = e.target.value; setData({...data, education: newE});}} className="w-full bg-transparent border-b border-white/10 py-2 outline-none focus:border-indigo-500"/>
                                            <input value={edu.percentage || ""} placeholder="Score/Grade" onChange={e => {const newE = [...data.education]; newE[i].percentage = e.target.value; setData({...data, education: newE});}} className="w-full bg-transparent border-b border-white/10 py-2 outline-none focus:border-indigo-500"/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "skills" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h3 className="text-xl font-bold">Skills Arsenal</h3>
                            <textarea value={data.skills.join(", ")} onChange={e => setData({...data, skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean)})} className="w-full h-48 bg-white/5 border border-white/10 rounded-3xl p-8 focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all text-lg font-mono text-zinc-300 leading-relaxed" placeholder="React, Node.js, AWS..."/>
                        </div>
                    )}

                    {activeTab === "experience" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">Experience Timeline</h3>
                                <button onClick={() => setData({...data, experience: [...data.experience, {role: "", company: "", duration: "", description: ""}]})} className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-xl text-xs font-bold"><Plus size={14} /> Add Role</button>
                            </div>
                            {data.experience.map((exp, i) => (
                                <div key={i} className="p-8 bg-white/5 border border-white/5 rounded-[32px] space-y-6 relative group">
                                    <button onClick={() => setData({...data, experience: data.experience.filter((_, idx) => idx !== i)})} className="absolute top-6 right-6 p-2 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18} /></button>
                                    <div className="grid grid-cols-2 gap-6">
                                        <input value={exp.role} placeholder="Job Title" onChange={e => {const newExp = [...data.experience]; newExp[i].role = e.target.value; setData({...data, experience: newExp});}} className="bg-transparent border-b border-white/10 py-2 outline-none text-lg font-bold focus:border-indigo-500 w-full"/>
                                        <input value={exp.company} placeholder="Organization" onChange={e => {const newExp = [...data.experience]; newExp[i].company = e.target.value; setData({...data, experience: newExp});}} className="bg-transparent border-b border-white/10 py-2 outline-none focus:border-indigo-500 w-full"/>
                                    </div>
                                    <textarea value={exp.description} placeholder="Key Responsibilities..." onChange={e => {const newExp = [...data.experience]; newExp[i].description = e.target.value; setData({...data, experience: newExp});}} className="w-full bg-black/20 rounded-2xl p-6 outline-none text-sm text-zinc-300 min-h-[120px] resize-none focus:ring-1 focus:ring-indigo-500/30"/>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "projects" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">Key Projects</h3>
                                <button onClick={() => setData({...data, projects: [...data.projects, {title: "", description: "", technologies: [], link: ""}]})} className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-xl text-xs font-bold"><Plus size={14} /> Add Project</button>
                            </div>
                            {data.projects.map((proj, i) => (
                                <div key={i} className="p-8 bg-white/5 border border-white/5 rounded-[32px] space-y-6 relative group">
                                    <button onClick={() => setData({...data, projects: data.projects.filter((_, idx) => idx !== i)})} className="absolute top-6 right-6 p-2 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18} /></button>
                                    <input value={proj.title} placeholder="Headline" onChange={e => {const newProj = [...data.projects]; newProj[i].title = e.target.value; setData({...data, projects: newProj});}} className="w-full bg-transparent border-b border-white/10 py-2 outline-none text-lg font-bold focus:border-indigo-500"/>
                                    <textarea value={proj.description} placeholder="What did you build?" onChange={e => {const newProj = [...data.projects]; newProj[i].description = e.target.value; setData({...data, projects: newProj});}} className="w-full bg-black/20 rounded-2xl p-6 outline-none text-sm text-zinc-300 min-h-[100px] resize-none focus:ring-1 focus:ring-indigo-500/30"/>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* COMPANIES TAB */}
                    {activeTab === 'companies' && !showArchitect && (
                        <div className="flex-1 flex flex-col bg-black/20 p-8 custom-scrollbar relative overflow-hidden rounded-[40px]">
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] -mr-64 -mt-64" />
                            
                            <div className="relative z-10">
                                <div className="flex justify-between items-end mb-10 px-2">
                                    <div>
                                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Hiring Targets</h2>
                                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-[4px] mt-2 italic">Matched to your Expertise DNA</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col">
                                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Match Score</span>
                                            <span className="text-xl font-black text-indigo-400">92%</span>
                                        </div>
                                        <div className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col">
                                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Leads</span>
                                            <span className="text-xl font-black text-emerald-400">14</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-4">
                                    {[
                                        { name: "Vercel", role: "Frontend Engineer (Next.js)", score: 98, salary: "$140k - 180k", type: "Remote" },
                                        { name: "Linear", role: "Senior Frontend Pro", score: 94, salary: "$160k - 200k", type: "Remote" },
                                        { name: "Supabase", role: "DX Engineer", score: 89, salary: "$130k - 170k", type: "Hybrid" },
                                        { name: "Stripe", role: "Product Engineer", score: 86, salary: "$170k - 220k", type: "San Francisco" },
                                    ].map((job, idx) => (
                                        <motion.div 
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="p-6 bg-white/5 border border-white/10 rounded-3XL flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer shadow-sm relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/50 opacity-0 group-hover:opacity-100 transition-all" />
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-black/40 rounded-2xl flex items-center justify-center font-black text-xs text-white border border-white/10 group-hover:border-indigo-500/30 transition-all">
                                                    {job.name.substring(0,2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-black text-white">{job.name}</h4>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-[11px] font-bold text-zinc-400">{job.role}</span>
                                                        <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                                                        <span className="text-[10px] font-black text-emerald-400/80 uppercase tracking-widest">{job.type}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-8">
                                                <div className="text-right">
                                                    <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[2px] mb-1">Estimate</div>
                                                    <div className="text-sm font-black text-white">{job.salary}</div>
                                                </div>
                                                <div className="flex flex-col items-center justify-center bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-2xl min-w-[70px]">
                                                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Match</span>
                                                    <span className="text-lg font-black text-white">{job.score}%</span>
                                                </div>
                                                <button className="px-6 py-3 bg-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-[2px] hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/20 group-hover:scale-105">
                                                    Auto-Apply
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="mt-10 p-8 border border-dashed border-white/10 rounded-[32px] bg-white/[0.02] text-center">
                                    <Sparkles className="mx-auto text-indigo-400 mb-4" size={32} />
                                    <h5 className="text-sm font-black text-white uppercase tracking-widest mb-2">Automated Pipeline</h5>
                                    <p className="text-xs text-zinc-500 max-w-sm mx-auto font-bold leading-relaxed px-4">
                                        Our AI is scanning 50+ job boards to find roles that perfectly align with your experience and salary expectations.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "extras" && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold">Education Extensions</h3>
                                <textarea value={(data.certifications || []).join("\n")} onChange={e => setData({...data, certifications: e.target.value.split("\n").filter(Boolean)})} className="w-full h-32 bg-white/5 border border-white/10 rounded-3xl p-6 transition-all text-sm text-zinc-300" placeholder="Certificates..."/>
                            </div>
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold">Achievements</h3>
                                <textarea value={(data.achievements || []).join("\n")} onChange={e => setData({...data, achievements: e.target.value.split("\n").filter(Boolean)})} className="w-full h-32 bg-white/5 border border-white/10 rounded-3xl p-6 transition-all text-sm text-zinc-300" placeholder="Awards..."/>
                            </div>
                            <div className="pt-10 border-t border-white/5">
                                <div className="space-y-6">
                                    {(data.customSections || []).map((sec, i) => (
                                        <div key={sec.id} className="p-8 bg-white/5 border border-white/5 rounded-[32px] space-y-4">
                                            <div className="text-sm font-black text-indigo-400 uppercase tracking-widest">{data.layoutConfig?.titles[sec.id] || sec.title}</div>
                                            <textarea value={sec.content} onChange={e => {const newSecs = [...(data.customSections || [])]; newSecs[i].content = e.target.value; setData({...data, customSections: newSecs});}} className="w-full bg-black/20 rounded-2xl p-6 outline-none text-sm text-zinc-300 min-h-[100px] resize-none transition-all focus:ring-1 focus:ring-indigo-500/20" placeholder="Content..."/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            ) : (
                <motion.div 
                    key="architect"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex-1 flex flex-col bg-black/40 overflow-hidden"
                >
                    <div className="p-3 border-b border-white/5 bg-white/5 px-10 flex justify-between items-center">
                        <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[4px]">Grid Architect</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 gap-4 custom-scrollbar px-10 align-content-start">
                        {(() => {
                            const config = data.layoutConfig!;
                            const order = config.order || [];
                            const rows: {ids: string[], number: string}[] = [];
                            let currentNumber = 1;
                            
                            // Calculate Row Groups and Numbers
                            for (let i = 0; i < order.length; i++) {
                                const id = order[i];
                                const side = config.side[id];
                                
                                if (side === 'full') {
                                    rows.push({ ids: [id], number: `${currentNumber}` });
                                    currentNumber++;
                                } else if (side === 'left') {
                                    const nextId = order[i+1];
                                    if (nextId && config.side[nextId] === 'right') {
                                        rows.push({ ids: [id], number: `${currentNumber}.1` });
                                        rows.push({ ids: [nextId], number: `${currentNumber}.2` });
                                        i++; // skip next
                                    } else {
                                        rows.push({ ids: [id], number: `${currentNumber}.1` });
                                    }
                                    currentNumber++;
                                } else if (side === 'right') {
                                    rows.push({ ids: [id], number: `${currentNumber}.2` });
                                    currentNumber++;
                                }
                            }

                            // Flatten back for rendering while preserving indices
                            const finalItems = rows.flatMap(r => r.ids.map(id => ({ id, number: r.number })));

                            return finalItems.map((item, index) => {
                                const id = item.id;
                                const title = config.titles?.[id] || id;
                                const originalIndex = order.indexOf(id);
                                
                                return (
                                    <div key={id} className="p-4 bg-white/5 border border-white/5 rounded-3xl group hover:bg-white/10 transition-all border-l-4 border-l-transparent hover:border-l-indigo-500 shadow-sm relative">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col gap-1">
                                                <button disabled={originalIndex === 0} onClick={() => {const newOrder = [...order]; [newOrder[originalIndex-1], newOrder[originalIndex]] = [newOrder[originalIndex], newOrder[originalIndex-1]]; setData({...data, layoutConfig: {...config, order: newOrder}});}} className="p-1.5 bg-black/40 rounded-lg hover:text-indigo-400 disabled:opacity-20 transition-all"><ChevronUp size={12}/></button>
                                                <button disabled={originalIndex === order.length - 1} onClick={() => {const newOrder = [...order]; [originalIndex, originalIndex+1].forEach(idx => { /* no-op logic to simplify edit */ }); const newOrder2 = [...order]; [newOrder2[originalIndex], newOrder2[originalIndex+1]] = [newOrder2[originalIndex+1], newOrder2[originalIndex]]; setData({...data, layoutConfig: {...config, order: newOrder2}});}} className="p-1.5 bg-black/40 rounded-lg hover:text-indigo-400 disabled:opacity-20 transition-all"><ChevronDown size={12}/></button>
                                            </div>
                                            
                                            <div className="flex-1 min-w-0 space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] font-black bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-lg border border-indigo-500/20">{item.number}</span>
                                                    <input 
                                                        value={title} 
                                                        onChange={e => {
                                                            const newTitles = {...config.titles, [id]: e.target.value};
                                                            let newCustom = [...(data.customSections || [])];
                                                            const cIdx = newCustom.findIndex(c => c.id === id);
                                                            if (cIdx !== -1) newCustom[cIdx].title = e.target.value;
                                                            setData({...data, layoutConfig: {...config, titles: newTitles}, customSections: newCustom});
                                                        }}
                                                        className="bg-transparent text-sm font-black text-white outline-none border-b border-white/5 focus:border-indigo-500 w-full truncate pb-1"
                                                        placeholder="Section Titling..."
                                                    />
                                                </div>
                                                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 w-fit gap-1">
                                                    {['left', 'full', 'right'].map((side) => (
                                                        <button 
                                                            key={side}
                                                            onClick={() => setData({...data, layoutConfig: {...config, side: {...config.side, [id]: side as any}}})}
                                                            className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${config.side[id] === side ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-600 hover:text-zinc-400'}`}
                                                        >
                                                            {side}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {id.startsWith('custom') && (
                                                <button onClick={() => setData({...data, customSections: data.customSections?.filter(s => s.id !== id), layoutConfig: {...config, order: config.order.filter(rid => rid !== id)}})} className="p-2 bg-red-400/5 text-zinc-700 hover:bg-red-500 hover:text-white rounded-xl transition-all"><Trash2 size={16}/></button>
                                            )}
                                        </div>
                                    </div>
                                );
                            });
                        })()}

                        {/* ADD SECTION CARDS */}
                         <button 
                            onClick={() => {
                                const newId = `custom-${Date.now()}`;
                                setData({
                                    ...data, 
                                    customSections: [...(data.customSections || []), {id: newId, title: "New Section", content: ""}],
                                    layoutConfig: {
                                        ...data.layoutConfig!,
                                        order: [...data.layoutConfig!.order, newId],
                                        side: {...data.layoutConfig!.side, [newId]: 'full'},
                                        titles: {...data.layoutConfig!.titles, [newId]: 'New Section'}
                                    }
                                });
                            }}
                            className="p-8 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-indigo-500/5 hover:border-indigo-500/30 transition-all group"
                         >
                            <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-all">
                                <Plus size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-indigo-400">Add New Section</span>
                         </button>
                    </div>
                </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-4 border-t border-white/5 flex justify-end gap-3 bg-white/5 backdrop-blur-md relative px-6">
            <div className="relative">
                <button 
                  onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-bold flex items-center gap-2 hover:bg-white/10 transition-all text-zinc-400 hover:text-white"
                >
                    <Download size={16} /> Export Resume
                </button>
                <AnimatePresence>
                  {showDownloadMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      className="absolute bottom-full mb-4 right-0 w-52 bg-[#151525] border border-white/10 rounded-3xl shadow-2xl p-2 z-50 overflow-hidden"
                    >
                        <button onClick={() => handleDownload('pdf')} className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-all text-xs text-zinc-300">
                             <File size={16} className="text-red-400" /> PDF Document
                        </button>
                        <button onClick={() => handleDownload('word')} className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-all text-xs text-zinc-300">
                             <FileCode size={16} className="text-blue-400" /> Word File
                        </button>
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>

            <button onClick={handleSave} disabled={saving} className="px-10 py-3 bg-indigo-600 rounded-2xl text-[11px] font-bold flex items-center gap-2 hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all">
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                {saving ? "Saving..." : "Save Changes"}
            </button>
        </div>
      </motion.div>
    </div>
  );
}
