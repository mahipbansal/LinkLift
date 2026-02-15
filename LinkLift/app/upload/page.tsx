"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Upload, FileText, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

// 🟢 Helper function to turn "Krishna Chaturvedi" into "krishna-chaturvedi"
const slugify = (text: string) =>
  text.toLowerCase()
    .trim()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');

export default function UploadPage() {
  const { user } = useUser();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.type !== "application/pdf") {
        setMessage({ type: "error", text: "Please select a PDF file." });
        return;
      }
      setFile(selected);
      setMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: "error", text: "Please select a file first." });
      return;
    }

    if (!user?.id) {
      setMessage({ type: "error", text: "You must be signed in to upload." });
      return;
    }

    setIsUploading(true);
    setMessage(null);

    const filePath = `${user.id}/${Date.now()}-${file.name}`;

    try {
      // 1. Upload to Supabase Storage
      const { error: storageError } = await supabase.storage
        .from("resumes")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (storageError) throw storageError;

      const { data: urlData } = supabase.storage
        .from("resumes")
        .getPublicUrl(filePath);

      const fileUrl = urlData.publicUrl;

      // 🟢 Create a temporary slug so the initial insert succeeds
      const tempSlug = `user-${Math.floor(100000 + Math.random() * 900000)}`;

      const { data: insertedResume, error: dbError } = await supabase
        .from("resumes")
        .insert({
          user_id: user.id,
          file_path: filePath,
          file_url: fileUrl,
          parsed_json: null,
          slug: tempSlug,
        })
        .select("id")
        .single();

      if (dbError) throw dbError;

      const resumeId = insertedResume?.id;
      if (!resumeId) throw new Error("Failed to get resume ID");

      setMessage({ type: "success", text: "Resume uploaded! Analyzing with AI..." });
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      setIsUploading(false);
      setIsAnalyzing(true);

      // 2. Call the analyze API
      const analyzeResponse = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl, resumeId }),
      });

      const analyzeData = await analyzeResponse.json();

      if (!analyzeResponse.ok) {
        throw new Error(analyzeData.error ?? "Analysis failed");
      }

      // 🟢 2. Safety Check: If AI failed to find a name, use the Clerk user name as backup
      const aiParsedData = analyzeData.data;
      const finalName = aiParsedData?.name || user.fullName || "portfolio";
      const finalSlug = `${slugify(finalName)}-${Math.floor(1000 + Math.random() * 9000)}`;

      // 🟢 3. Final Database Sync: Update both the JSON data AND the final unique slug
      const { error: updateError } = await supabase
        .from("resumes")
        .update({
          parsed_json: aiParsedData,
          slug: finalSlug
        })
        .eq("id", resumeId);

      if (updateError) throw updateError;

      // 🟢 4. THE DELAY FIX: Wait 2.5 seconds for the database and Vercel to sync before redirecting
      setMessage({ type: "success", text: "Analysis complete! Generating your portfolio..." });
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // 3. Final Redirect to the dashboard
      router.push("/dashboard");

    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Upload failed. Please try again.",
      });
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped?.type === "application/pdf") {
      setFile(dropped);
      setMessage(null);
    } else {
      setMessage({ type: "error", text: "Please drop a PDF file." });
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const isLoading = isUploading || isAnalyzing;

  return (
    <div className="relative mx-auto max-w-2xl px-6 py-24">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg md:p-12"
      >
        <h1 className="mb-2 text-2xl font-bold text-white md:text-3xl">
          Generate Portfolio
        </h1>
        <p className="mb-8 text-zinc-400">
          Upload your PDF. Our AI will extract your skills and build your live site instantly.
        </p>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => !isLoading && inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-white/5 py-16 transition-all hover:border-white/30 hover:bg-white/10 ${isLoading ? "pointer-events-none opacity-70" : ""}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          {file ? (
            <div className="flex flex-col items-center gap-2 text-center">
              <FileText className="h-12 w-12 text-indigo-400" />
              <p className="font-medium text-white max-w-[200px] truncate">{file.name}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpload();
                }}
                disabled={isLoading}
                className="mt-6 rounded-full bg-indigo-600 px-8 py-3 font-bold text-white hover:bg-indigo-500 transition-all disabled:opacity-50"
              >
                {isUploading ? "Uploading..." : isAnalyzing ? "Analyzing..." : "Analyze Now"}
              </button>
            </div>
          ) : (
            <>
              <Upload className="mb-4 h-12 w-12 text-zinc-500" />
              <p className="text-white">Click or drag PDF here</p>
            </>
          )}
        </div>

        {message && (
          <div className={`mt-6 flex items-center gap-3 rounded-xl px-4 py-3 ${message.type === "success" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}