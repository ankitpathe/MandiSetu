"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import MembershipModal from "@/components/MembershipModal";
import { useAuth } from "@/lib/auth-context";
import {
  Crown,
  ShieldCheck,
  Star,
  MapPin,
  TrendingUp,
  Fuel,
  CheckCircle2,
  Globe,
  FileCheck2,
  PhoneCall,
  Sparkles,
  LogOut,
  Zap,
  LogIn,
  User,
  Truck,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, switchDemoUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("hi");

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "RY";

  const languages = [
    { code: "hi", name: "हिन्दी (Hindi)" },
    { code: "en", name: "Hinglish / English" },
    { code: "mr", name: "मराठी (Marathi)" },
    { code: "gu", name: "ગુજરાતી (Gujarati)" },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 pb-28 text-slate-100">
      <Header />

      <main className="px-4 pt-3 flex-1 max-w-md mx-auto w-full">
        {/* If user is logged out, show clean login prompt */}
        {!user ? (
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 mb-4 text-slate-800 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-3">
              <User className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-black text-slate-900">Aap Logged In Nahi Hain</h2>
            <p className="text-xs text-slate-600 mt-1 mb-5">
              Apne routes post karne, 0% commission pass lene aur vyapariyon se contact karne ke liye login karein.
            </p>
            <Link
              href="/login"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all active:scale-98 mb-3"
            >
              <LogIn className="w-4 h-4" />
              <span>Mobile Number Se Login Karein</span>
            </Link>

            <div className="pt-3 border-t border-slate-100 text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
                Ya Quick Demo Switch Karein:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => switchDemoUser("DRIVER")}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center space-x-1.5"
                >
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ramesh (Driver)</span>
                </button>
                <button
                  type="button"
                  onClick={() => switchDemoUser("VYAPARI")}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center space-x-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Suresh (Vyapari)</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Logged In Profile Header */
          <div className="bg-white rounded-2xl p-4 shadow-xl border border-slate-200 mb-4 text-slate-800 relative overflow-hidden">
            <div className="flex items-center space-x-3.5">
              {/* Avatar Initials */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-emerald-500/30 shrink-0">
                {initials}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1.5">
                  <h2 className="text-base font-bold text-slate-900 truncate">
                    {user.name}
                  </h2>
                  {user.isVerified && (
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                </div>

                <div className="flex items-center space-x-2 mt-0.5 text-xs text-slate-600">
                  <span className="font-semibold text-emerald-700">
                    {user.role === "DRIVER"
                      ? "Verified Driver"
                      : user.role === "VYAPARI"
                      ? "Verified Vyapari"
                      : "Kisan Bhai"}
                  </span>
                  <span>•</span>
                  <span className="flex items-center text-slate-600 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 mr-0.5" />
                    {user.city || "Indore Mandi"}
                  </span>
                </div>

                {/* Vehicle Plate & Model for Driver */}
                {user.role === "DRIVER" && (
                  <div className="flex items-center space-x-2 mt-1.5">
                    <span className="font-mono text-[11px] font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                      {user.vehicleNumber || "MP 09 AB 4589"}
                    </span>
                    <span className="text-[11px] text-slate-500 truncate">
                      {user.vehicleType || "Tata 407 (Open Body)"}
                    </span>
                  </div>
                )}
              </div>

              {/* Rating Box */}
              <div className="flex flex-col items-center justify-center bg-amber-50 px-2.5 py-1.5 rounded-xl border border-amber-200 shrink-0">
                <div className="flex items-center space-x-1 text-amber-700 font-black text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{user.rating?.toFixed(1) || "4.9"}</span>
                </div>
                <span className="text-[9px] text-amber-700 font-semibold">Rating</span>
              </div>
            </div>
          </div>
        )}

        {/* Driver Membership Card (Dark gradient banner with golden crown) */}
        <div className="relative rounded-2xl p-5 mb-4 shadow-2xl border border-emerald-500/30 overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#064E3B] to-[#043327] text-white">
          {/* Ambient Crown Light */}
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between mb-3 relative z-10">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 shadow-md shadow-amber-400/30">
                <Crown className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block">
                  EXCLUSIVE MEMBERSHIP
                </span>
                <h3 className="text-base font-black text-white">
                  Return Load Unlimited Pass
                </h3>
              </div>
            </div>

            {user?.hasActivePass ? (
              <span className="text-[10px] font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-sm">
                <Sparkles className="w-3 h-3 text-emerald-300" />
                <span>ACTIVE</span>
              </span>
            ) : (
              <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-full">
                SPECIAL OFFER
              </span>
            )}
          </div>

          {/* Benefits */}
          <div className="space-y-2 mb-4 text-xs text-slate-200 relative z-10">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>0% Commission - Poora bhada aapka</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Interstate mandi vyapariyon ke verified contacts</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>WhatsApp aur Direct Call support</span>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="pt-3 border-t border-emerald-500/30 flex items-center justify-between relative z-10">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
                MONTHLY PASS
              </span>
              <div className="flex items-baseline space-x-1">
                <span className="text-xl font-black text-amber-400">₹299</span>
                <span className="text-[11px] text-slate-300">/ mahina</span>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className={`py-2 px-3.5 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center space-x-1.5 active:scale-95 ${
                user?.hasActivePass
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30"
                  : "bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 text-slate-950 shadow-amber-400/30 font-black"
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>
                {user?.hasActivePass ? "Pass Details Dekhein" : "Membership Activate Karein"}
              </span>
            </button>
          </div>
        </div>

        {/* Stats Box: Return Trips + Est. Diesel Bachat */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Stat 1: Return Trips */}
          <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700/80 shadow-md">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-[11px] text-slate-400 block">
              Successful Return Trips
            </span>
            <span className="text-lg font-black text-white mt-0.5 block">
              14 Trips
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold">
              +4 is mahine
            </span>
          </div>

          {/* Stat 2: Est. Diesel Bachat */}
          <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700/80 shadow-md">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2">
              <Fuel className="w-4 h-4" />
            </div>
            <span className="text-[11px] text-slate-400 block">
              Est. Diesel Bachat
            </span>
            <span className="text-lg font-black text-amber-400 mt-0.5 block">
              ₹28,500
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              Khali phera bacha kar
            </span>
          </div>
        </div>

        {/* Settings & KYC Cards */}
        <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 shadow-md mb-4 space-y-3.5 text-xs">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
            Verification & Settings
          </h3>

          {/* Document Verification (KYC) */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-white block">Document Verification (KYC)</span>
                <span className="text-[11px] text-slate-400">Aadhaar, RC & Driving License</span>
              </div>
            </div>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Verified</span>
            </span>
          </div>

          {/* App Bhasha (Language selector) */}
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white">App Bhasha (Language)</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-bold">
                {languages.find((l) => l.code === selectedLanguage)?.name}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`py-1.5 px-2 rounded-lg text-left text-[11px] font-semibold transition-all ${
                    selectedLanguage === lang.code
                      ? "bg-emerald-600 text-white font-bold"
                      : "bg-slate-800 text-slate-300 hover:text-white"
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Direct Support Helpline */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white block">24x7 Mandi Helpline</span>
                <span className="text-[11px] text-slate-400">Toll-Free: 1800-889-MANDI</span>
              </div>
            </div>
            <a
              href="tel:18008890000"
              className="text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-emerald-400 px-2.5 py-1 rounded-md border border-slate-700"
            >
              Call Karein
            </a>
          </div>
        </div>

        {/* Persona quick switch buttons & Logout */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => switchDemoUser(user?.role === "DRIVER" ? "VYAPARI" : "DRIVER")}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition-all text-center"
          >
            Switch to {user?.role === "DRIVER" ? "Vyapari" : "Driver"} View
          </button>

          <button
            onClick={handleLogout}
            className="py-2.5 px-4 rounded-xl bg-red-950/70 hover:bg-red-900/90 active:scale-95 text-red-400 hover:text-red-300 text-xs font-bold border border-red-800/60 transition-all flex items-center space-x-1.5 shadow-sm"
            title="Logout from account"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>Logout</span>
          </button>
        </div>
      </main>

      {/* Membership Activation Modal */}
      <MembershipModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <BottomNav />
    </div>
  );
}
