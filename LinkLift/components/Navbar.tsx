"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react"; // Added for the new upload link

export function Navbar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  // 🟢 Hide Navbar on public portfolio pages
  const isPublicPortfolio = pathname !== "/" &&
    !pathname.startsWith("/dashboard") &&
    !pathname.startsWith("/upload") &&
    !pathname.startsWith("/portfolio");

  if (isPublicPortfolio) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-black/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-10">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image
              src="/logo.png"
              alt="LinkLift"
              width={100}
              height={32}
              className="h-8 w-auto invert"
              priority
            />
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {/* 🟢 NEW: Analyze New Resume link to prevent getting stuck */}
            <Link
              href="/upload"
              className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-white ${isActive("/upload") ? "text-white" : "text-zinc-400"}`}
            >
              <Plus size={14} />
              Analyze New
            </Link>

            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-white ${isActive("/dashboard") ? "text-white" : "text-zinc-400"}`}
            >
              Dashboard
            </Link>

            <Link
              href="/portfolio/preview"
              className={`text-sm font-medium transition-colors hover:text-white ${isActive("/portfolio/preview") ? "text-white" : "text-zinc-400"}`}
            >
              Portfolio
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  );
}