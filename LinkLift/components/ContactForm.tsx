"use client";

import { useState } from "react";
import { Loader2, Check, Send } from "lucide-react";

interface ContactFormProps {
    toEmail?: string;
    toName: string;
}

export default function ContactForm({ toEmail, toName }: ContactFormProps) {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, toName }),
            });

            if (res.ok) {
                setStatus("success");
                setFormData({ name: "", email: "", message: "" });
                setTimeout(() => setStatus("idle"), 5000);
            } else {
                setStatus("error");
            }
        } catch (err) {
            setStatus("error");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-indigo-500/50 transition-colors"
                />
                <input
                    type="email"
                    required
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-indigo-500/50 transition-colors"
                />
            </div>
            <textarea
                required
                placeholder="How can I help you?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-indigo-500/50 transition-colors resize-none"
            />

            <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-white text-sm transition-all active:scale-[0.98] ${status === "success"
                        ? "bg-emerald-600 shadow-xl shadow-emerald-500/20"
                        : "bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-500/20"
                    } disabled:opacity-50`}
            >
                {status === "loading" && <Loader2 className="animate-spin" size={18} />}
                {status === "success" && <Check size={18} />}
                {status === "idle" && <Send size={18} />}
                {status === "error" && "Error Sending!"}

                {status === "loading" ? "Sending Message..." : status === "success" ? "Message Sent!" : "Send Message"}
            </button>

            {status === "success" && (
                <p className="text-center text-emerald-500 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-500">
                    I'll get back to you soon! ✨
                </p>
            )}
        </form>
    );
}
