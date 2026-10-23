"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Truck,
  ShieldCheck,
  User,
  ArrowRight,
  KeyRound,
  CheckCircle2,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Role } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const { login, switchDemoUser } = useAuth();

  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>("DRIVER");
  const [otp, setOtp] = useState(["8", "8", "9", "9"]);
  const [generatedOtp, setGeneratedOtp] = useState("8899");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length !== 10) {
      setErrorMsg("Kripya 10 ankon ka mobile number darj karein.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("OTP");
    }, 500);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const enteredOtp = otp.join("");
    if (enteredOtp !== generatedOtp && enteredOtp.length !== 4) {
      setErrorMsg("Galat OTP. Kripya 8899 darj karein.");
      setIsLoading(false);
      return;
    }

    const success = await login(phone, selectedRole, fullName || undefined);
    setIsLoading(false);

    if (success) {
      // Direct redirect to root '/' Home Feed
      router.push("/");
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } else {
      setErrorMsg("Login me samasya aayi. Dobara try karein.");
    }
  };

  const handleQuickDemo = (role: Role) => {
    switchDemoUser(role);
    // Direct redirect to root '/' Home Feed
    router.push("/");
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 px-4 py-8 text-white max-w-md mx-auto w-full justify-between">
      {/* Top Branding & Navigation */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
                  MandiReturn
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  0% BHADA
                </span>
              </div>
              <p className="text-xs text-slate-400">Agri Transport Exchange</p>
            </div>
          </div>

          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 p-2 rounded-xl bg-slate-800/80 border border-slate-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Feed</span>
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-black tracking-tight text-white">
            {step === "PHONE" ? "Namaste! Login / Register" : "OTP Darj Karein"}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            {step === "PHONE"
              ? "Apna role aur mobile number darj karein bina kisi registration fee ke."
              : `Humne mobile number +91 ${phone} par 4-digit OTP bheja hai.`}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {step === "PHONE" ? (
          /* Step 1: Role Chooser + Phone Input */
          <form onSubmit={handleSendOtp} className="space-y-4">
            {/* One-Click Role Chooser */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2 uppercase tracking-wider">
                Aap Ka Role Chunein:
              </label>

              <div className="grid grid-cols-3 gap-2">
                {/* Driver */}
                <button
                  type="button"
                  onClick={() => setSelectedRole("DRIVER")}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center ${
                    selectedRole === "DRIVER"
                      ? "bg-emerald-950/70 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30"
                      : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1.5">
                    <Truck className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black block">Driver</span>
                  <span className="text-[10px] opacity-80 leading-tight mt-0.5">
                    Gadi Return
                  </span>
                </button>

                {/* Vyapari */}
                <button
                  type="button"
                  onClick={() => setSelectedRole("VYAPARI")}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center ${
                    selectedRole === "VYAPARI"
                      ? "bg-amber-950/70 border-amber-500 text-amber-300 ring-2 ring-amber-500/30"
                      : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-1.5">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black block">Vyapari</span>
                  <span className="text-[10px] opacity-80 leading-tight mt-0.5">
                    Maal Bhejna
                  </span>
                </button>

                {/* Kisan */}
                <button
                  type="button"
                  onClick={() => setSelectedRole("FARMER")}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center ${
                    selectedRole === "FARMER"
                      ? "bg-blue-950/70 border-blue-500 text-blue-300 ring-2 ring-blue-500/30"
                      : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-1.5">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black block">Kisan</span>
                  <span className="text-[10px] opacity-80 leading-tight mt-0.5">
                    Khet se Mandi
                  </span>
                </button>
              </div>
            </div>

            {/* Optional Full Name */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Aapka Naam (Optional)
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ramesh Yadav / Suresh Vyapari"
                className="w-full bg-slate-800 text-white placeholder-slate-500 text-xs rounded-xl px-3.5 py-3 border border-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Mobile Number Input */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Mobile Number*
              </label>
              <div className="flex items-center space-x-2">
                <span className="bg-slate-800 border border-slate-700 px-3 py-3 rounded-xl text-xs font-bold text-slate-300">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="9826012345"
                  className="w-full bg-slate-800 text-white placeholder-slate-500 text-sm font-bold tracking-wider rounded-xl px-3.5 py-3 border border-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all active:scale-98 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>OTP Bheja Ja Raha Hai...</span>
                </>
              ) : (
                <>
                  <span>OTP Prapt Karein</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Step 2: OTP Verification */
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            {/* Simulated OTP Notification Banner */}
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <KeyRound className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Simulated Demo OTP: <strong className="text-white text-sm">8899</strong></span>
              </div>
              <button
                type="button"
                onClick={() => setOtp(["8", "8", "9", "9"])}
                className="text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2 py-1 rounded"
              >
                Auto Fill
              </button>
            </div>

            {/* 4 Digit OTP Inputs */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2 text-center uppercase tracking-wider">
                4-Digit OTP Code
              </label>
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, "");
                      const newOtp = [...otp];
                      newOtp[index] = val;
                      setOtp(newOtp);
                      if (val && index < 3) {
                        const next = document.getElementById(`otp-${index + 1}`);
                        next?.focus();
                      }
                    }}
                    className="w-14 h-14 bg-slate-800 text-center text-xl font-black text-emerald-400 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                  />
                ))}
              </div>
            </div>

            {/* Verify Button -> Redirects to '/' */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all active:scale-98 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verify Ho Raha Hai...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify Karein Aur Home Feed Jayein</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep("PHONE")}
              className="w-full text-center text-xs text-slate-400 hover:text-white"
            >
              Mobile number badlein
            </button>
          </form>
        )}
      </div>

      {/* Bottom Instant Demo Switcher -> Redirects directly to '/' */}
      <div className="pt-6 border-t border-slate-800 mt-6">
        <span className="text-[11px] text-slate-400 font-semibold block mb-2 text-center uppercase tracking-wider">
          Ya Seedha Demo Persona Se Home Feed Jayein:
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemo("DRIVER")}
            className="p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700 text-left transition-all group"
          >
            <div className="flex items-center space-x-1.5 text-emerald-400 font-bold text-xs">
              <Truck className="w-3.5 h-3.5" />
              <span>Ramesh (Driver)</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Tata 407 • Indore Mandi
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo("VYAPARI")}
            className="p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700 text-left transition-all group"
          >
            <div className="flex items-center space-x-1.5 text-amber-400 font-bold text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Suresh (Vyapari)</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Chhindwara • Tomato Load
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
