"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Plus, User, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isHome = pathname === "/";
  const isPost = pathname === "/post";
  const isProfile = pathname === "/profile";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-6 py-2">
      <div className="flex items-center justify-between relative">
        {/* Tab 1: Home Feed */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all group ${
            isHome ? "text-emerald-400 font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <div className="relative">
            <Compass className={`w-6 h-6 transition-transform ${isHome ? "scale-110" : ""}`} />
            {isHome && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-sm shadow-emerald-400" />
            )}
          </div>
          <span className="text-[11px] mt-1 font-medium tracking-tight">Home Feed</span>
        </Link>

        {/* Tab 2: Floating Center '+' Post Button */}
        <div className="flex-1 flex justify-center -mt-6">
          <Link
            href="/post"
            className="group relative flex items-center justify-center"
            aria-label="Post Route or Load"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/40 text-white border-4 border-slate-900 group-hover:scale-105 active:scale-95 transition-all">
              <Plus className={`w-7 h-7 stroke-[2.5] transition-transform ${isPost ? "rotate-45" : ""}`} />
            </div>
            {/* Pulsing micro-glow */}
            <span className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping pointer-events-none" />
          </Link>
        </div>

        {/* Tab 3: Pass & Profile */}
        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all group ${
            isProfile ? "text-emerald-400 font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <div className="relative">
            <User className={`w-6 h-6 transition-transform ${isProfile ? "scale-110" : ""}`} />
            {user?.hasActivePass && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 border border-slate-900 rounded-full flex items-center justify-center">
                <Sparkles className="w-1.5 h-1.5 text-slate-950" />
              </span>
            )}
            {isProfile && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-sm shadow-emerald-400" />
            )}
          </div>
          <span className="text-[11px] mt-1 font-medium tracking-tight">Pass & Profile</span>
        </Link>
      </div>
    </nav>
  );
}
