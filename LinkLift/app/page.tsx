"use client";
import Link from "next/link";
import { UploadCloud, Wand2, Globe, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* 🟢 NO NAVBAR HERE - Layout.tsx handles it! */}

      <motion.main
        className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-40 pb-20 relative overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Feature Steps */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 relative z-10"
          variants={itemVariants}
        >
          <FeatureCard
            icon={<UploadCloud className="text-blue-400" size={24} />}
            title="Upload PDF"
            desc="Drag & drop your resume"
          />
          <FeatureCard
            icon={<Wand2 className="text-purple-400" size={24} />}
            title="AI Analysis"
            desc="Gemini 2.0 Intelligence"
          />
          <FeatureCard
            icon={<Globe className="text-pink-400" size={24} />}
            title="Web Portfolio"
            desc="Instant live website"
          />
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent max-w-4xl leading-tight"
          variants={itemVariants}
        >
          Turn Your Resume into a <br />
          <span className="text-white">Live Portfolio Website.</span>
        </motion.h1>

        <motion.p
          className="text-xl text-gray-400 max-w-2xl mx-auto mb-12"
          variants={itemVariants}
        >
          Stop sending boring PDFs. Create a stunning, shareable personal website in seconds.
        </motion.p>

        <motion.div variants={itemVariants}>
          <Link href="/dashboard">
            <button className="group relative inline-flex items-center gap-2 px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:scale-[1.02] transition-transform">
              Get Started Free
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </motion.main>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-500 text-sm">
          <div className="flex justify-center gap-8 opacity-50 mb-4">
            <TechBadge name="Gemini 2.0" />
            <TechBadge name="Supabase" />
            <TechBadge name="Next.js 15" />
          </div>
          <p>© 2026 stackd AI</p>
        </div>
      </footer>
    </div>
  );
}

// Helper Components
function FeatureCard({ icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <motion.div
      className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 w-64 text-left backdrop-blur-sm"
      whileHover={{ scale: 1.02 }}
    >
      <div className="p-3 rounded-xl bg-black/40 border border-white/5">{icon}</div>
      <div>
        <div className="font-bold text-white text-sm">{title}</div>
        <div className="text-xs text-gray-400">{desc}</div>
      </div>
    </motion.div>
  );
}

function TechBadge({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 font-medium">
      <CheckCircle2 size={14} className="text-indigo-500" />
      {name}
    </div>
  );
}