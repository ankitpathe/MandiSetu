"use client";

import React, { useState } from "react";
import {
  Crown,
  CheckCircle2,
  X,
  ShieldCheck,
  Zap,
  ArrowRight,
  Phone,
  MessageCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function MembershipModal({
  isOpen,
  onClose,
  onSuccess,
}: MembershipModalProps) {
  const { user, updateUserPass } = useAuth();
  const [selectedUpi, setSelectedUpi] = useState("gpay");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleActivate = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/membership/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          phone: user?.phone,
          planName: "Return Load Unlimited Pass",
          amount: 299,
        }),
      });

      if (res.ok) {
        updateUserPass(true);
        setIsSuccess(true);
        if (onSuccess) onSuccess();
      } else {
        // Fallback simulate activation
        updateUserPass(true);
        setIsSuccess(true);
      }
    } catch {
      updateUserPass(true);
      setIsSuccess(true);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 text-white relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Glow decoration */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <div>
            {/* Header with Golden Crown */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30">
                <Crown className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block">
                  VIP DRIVER PASS
                </span>
                <h2 className="text-xl font-black text-white">
                  Return Load Unlimited Pass
                </h2>
              </div>
            </div>

            {/* Price Tag */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-800/80 rounded-2xl p-4 border border-amber-500/30 mb-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium block">
                  Subscription Plan
                </span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-black text-amber-400">₹299</span>
                  <span className="text-xs text-slate-300">/ 30 Din (Monthly)</span>
                </div>
              </div>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold px-3 py-1 rounded-full">
                0% Commission
              </span>
            </div>

            {/* Benefits list */}
            <div className="space-y-3 mb-6 text-xs text-slate-300">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">0% Commission - Poora Bhada Aapka</span>
                  <span className="text-slate-400">Har trip par bina kisi katoti ke 100% bhada direct vyapari se lein.</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Interstate Mandi Vyapari Contacts</span>
                  <span className="text-slate-400">MP, Maharashtra, Gujarat ke verified sabzi va anaj vyapariyon ke direct numbers.</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">WhatsApp aur Direct Call Support</span>
                  <span className="text-slate-400">Ek click par phone milayein ya WhatsApp par rate finalize karein.</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector (Mock UPI) */}
            <div className="mb-6">
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Fast Payment via UPI (Simulated):
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "gpay", name: "Google Pay" },
                  { id: "phonepe", name: "PhonePe" },
                  { id: "paytm", name: "Paytm UPI" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedUpi(opt.id)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      selectedUpi === opt.id
                        ? "bg-amber-500/20 border-amber-400 text-amber-300"
                        : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white"
                    }`}
                  >
                    {opt.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Activate CTA */}
            <button
              onClick={handleActivate}
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center space-x-2 transition-all hover:brightness-105 active:scale-98 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Pass Activate Ho Raha Hai...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 fill-slate-950" />
                  <span>Membership Activate Karein (₹299)</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Success Screen */
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 mx-auto flex items-center justify-center mb-4 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
              Badhai Ho! 🎉
            </span>
            <h2 className="text-2xl font-black text-white mb-2">
              Pass Successfully Activated!
            </h2>
            <p className="text-xs text-slate-300 mb-6">
              Aapka <span className="text-emerald-400 font-semibold">&ldquo;Return Load Unlimited Pass&rdquo;</span> agle 30 dinon ke liye chalu ho gaya hai. Ab aap bina commission har route par maal utha sakte hain.
            </p>

            <button
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30"
            >
              Feed Par Wapas Jayein
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
