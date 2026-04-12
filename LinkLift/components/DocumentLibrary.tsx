"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, Trash2, ExternalLink, X, File, FileCode, Loader2 } from "lucide-react";

export default function DocumentLibrary({ coverLetter }: { coverLetter?: string }) {
  const [showFull, setShowFull] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(coverLetter || "");
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!coverLetter) return null;

  const handleDownload = (format: 'pdf' | 'word') => {
    if (format === 'word') {
      const blob = new Blob([coverLetter], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Cover_Letter.doc';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // PDF via Print fallback
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Cover Letter</title>
              <style>
                body { font-family: 'Times New Roman', serif; padding: 40px; line-height: 1.6; color: #333; }
                .content { white-space: pre-wrap; font-size: 12pt; }
              </style>
            </head>
            <body>
              <div class="content">${coverLetter}</div>
              <script>
                window.onload = function() { window.print(); window.close(); }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
    setShowDownloadMenu(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this cover letter?")) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch("/api/delete-cover-letter", { method: "POST" });
      if (response.ok) {
        window.location.reload(); // Refresh to update UI
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete document");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch("/api/save-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverLetter: editedContent }),
      });
      if (response.ok) {
        setIsEditing(false);
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update document");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 pt-12 border-t border-white/5">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
          <FileText size={20} />
        </div>
        <h2 className="text-2xl font-bold">Document Library</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ y: -5 }}
          className="group relative p-6 bg-white/5 border border-white/10 rounded-[28px] hover:bg-white/[0.08] transition-all"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
              <FileText size={24} />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <button 
                  onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
                >
                  <Download size={18} />
                </button>
                
                <AnimatePresence>
                  {showDownloadMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-40 bg-[#151520] border border-white/10 rounded-2xl shadow-2xl z-50 p-2 overflow-hidden"
                    >
                      <button 
                        onClick={() => handleDownload('pdf')}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-white/5 rounded-xl transition-colors text-zinc-300"
                      >
                        <File className="text-red-400" size={14} />
                        Download PDF
                      </button>
                      <button 
                         onClick={() => handleDownload('word')}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-white/5 rounded-xl transition-colors text-zinc-300"
                      >
                        <FileCode className="text-blue-400" size={14} />
                        Download Word
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 hover:bg-red-500/20 rounded-full transition-colors text-zinc-400 hover:text-red-400"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          
          <h3 className="font-bold text-lg mb-1">Tailored Cover Letter</h3>
          <p className="text-xs text-zinc-500 mb-4">Saved in your library</p>
          
          <div className="line-clamp-3 text-sm text-zinc-400 leading-relaxed italic">
            {coverLetter.slice(0, 150)}...
          </div>
          
          <button 
            onClick={() => setShowFull(true)}
            className="mt-6 flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-xs font-bold transition-colors"
          >
            View Full Document <ExternalLink size={12} />
          </button>
        </motion.div>
      </div>

      {/* FULL VIEW MODAL */}
      <AnimatePresence>
        {showFull && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFull(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl bg-[#0A0A10] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">Cover Letter Preview</h3>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Document Library</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setShowFull(false); setIsEditing(false); }}
                  className="p-2 hover:bg-white/10 rounded-full transition-all text-zinc-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-10 overflow-y-auto whitespace-pre-wrap text-zinc-300 leading-relaxed font-serif text-lg custom-scrollbar bg-black/20 flex-1">
                {isEditing ? (
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full h-full bg-white/5 border border-white/10 rounded-2xl p-6 text-zinc-300 text-lg leading-relaxed font-serif focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all resize-none"
                  />
                ) : (
                  coverLetter
                )}
              </div>

              <div className="p-8 border-t border-white/5 flex justify-between items-center bg-white/5">
                <p className="text-xs text-zinc-500">
                  {isEditing ? "Editing mode: Your changes will be saved to your library." : "Preview mode."}
                </p>
                <div className="flex gap-4">
                  {isEditing ? (
                    <>
                       <button 
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-full font-bold hover:bg-white/10 transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleUpdate}
                        disabled={isUpdating}
                        className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-500 transition-all flex items-center gap-2"
                      >
                        {isUpdating ? <><Loader2 className="animate-spin" size={18}/> Saving...</> : "Save Changes"}
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-full font-bold hover:bg-white/10 transition-all"
                      >
                        Edit Content
                      </button>
                      <button 
                        onClick={() => setShowFull(false)}
                        className="px-8 py-3 bg-white text-black rounded-full font-bold hover:scale-[1.02] transition-all"
                      >
                        Close Preview
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
