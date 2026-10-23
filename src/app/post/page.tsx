"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import VoiceInput from "@/components/VoiceInput";
import { ParsedSpeechData } from "@/lib/speech-parser";
import { useAuth } from "@/lib/auth-context";
import {
  Truck,
  Package,
  MapPin,
  Flag,
  Clock,
  IndianRupee,
  FileText,
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const VEHICLE_OPTIONS = [
  "Bolero Pickup",
  "Tata 407",
  "Chota Hathi / Ace",
  "6-Wheeler (Eicher/17ft)",
  "Tractor Trolley",
];

const POPULAR_MANDIS = [
  "Indore Mandi",
  "Chhindwara Mandi",
  "Betul Mandi",
  "Nagpur Kalamna Mandi",
  "Mumbai Vashi APMC",
  "Bhopal Karond Mandi",
  "Nashik Mandi",
  "Pune Market Yard",
];

export default function PostRouteOrLoadPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Role toggle: VEHICLE_AVAILABLE (Driver) vs LOAD_AVAILABLE (Vyapari)
  const [postType, setPostType] = useState<"VEHICLE_AVAILABLE" | "LOAD_AVAILABLE">(
    user?.role === "VYAPARI" || user?.role === "FARMER"
      ? "LOAD_AVAILABLE"
      : "VEHICLE_AVAILABLE"
  );

  // Form states
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicleType, setVehicleType] = useState("Bolero Pickup");
  const [departureTime, setDepartureTime] = useState("Aaj Shaam (Tonight)");
  const [targetPrice, setTargetPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [title, setTitle] = useState("");

  // UI status
  const [isVoiceFilled, setIsVoiceFilled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle Speech Recognition parsing result
  const handleVoiceParsed = (data: ParsedSpeechData) => {
    setIsVoiceFilled(true);

    if (data.postType) {
      setPostType(data.postType);
    }
    if (data.origin) {
      setOrigin(data.origin);
    }
    if (data.destination) {
      setDestination(data.destination);
    }
    if (data.vehicleType) {
      setVehicleType(data.vehicleType);
    }
    if (data.targetPrice) {
      setTargetPrice(data.targetPrice.toString());
    }
    if (data.departureTime) {
      setDepartureTime(data.departureTime);
    }
    if (data.cropOrLoad) {
      setTitle(
        postType === "LOAD_AVAILABLE"
          ? `${data.cropOrLoad} Load`
          : `${data.cropOrLoad} Return Trip`
      );
    }
    if (data.notes) {
      setNotes(data.notes);
    }

    setTimeout(() => setIsVoiceFilled(false), 5000);
  };

  const persistToLocalStorage = (newPost: any) => {
    try {
      const existing = localStorage.getItem("mandireturn_local_posts");
      const list = existing ? JSON.parse(existing) : [];
      const updated = [newPost, ...list.filter((p: any) => p.id !== newPost.id)];
      localStorage.setItem("mandireturn_local_posts", JSON.stringify(updated));
    } catch (e) {
      console.warn("Local storage write error:", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!origin.trim()) {
      setFormError("Kripya Kahan Se (Origin) chunein ya bolein.");
      return;
    }
    if (!destination.trim()) {
      setFormError("Kripya Kahan Tak (Destination) chunein ya bolein.");
      return;
    }

    setIsSubmitting(true);

    try {
      const defaultTitle =
        title.trim() ||
        (postType === "VEHICLE_AVAILABLE"
          ? `${vehicleType} - Khali Return Trip`
          : `Agri Goods Load (${vehicleType})`);

      const payload = {
        userId: user?.id,
        phone: user?.phone,
        type: postType,
        title: defaultTitle,
        origin: origin.trim(),
        destination: destination.trim(),
        vehicleType,
        targetPrice: targetPrice ? parseInt(targetPrice, 10) : null,
        departureTime: departureTime.trim(),
        notes: notes.trim(),
      };

      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let createdPost = null;
      if (res.ok) {
        const data = await res.json();
        createdPost = data.post;
      } else {
        // Fallback optimistic local post
        createdPost = {
          id: `local-${Date.now()}`,
          ...payload,
          status: "ACTIVE",
          createdAt: new Date().toISOString(),
          user: {
            id: user?.id || "user-local",
            name: user?.name || (postType === "VEHICLE_AVAILABLE" ? "Driver Ji" : "Vyapari Bhaisaab"),
            phone: user?.phone || "9826012345",
            role: user?.role || (postType === "VEHICLE_AVAILABLE" ? "DRIVER" : "VYAPARI"),
            vehicleNumber: user?.vehicleNumber || (postType === "VEHICLE_AVAILABLE" ? "MP 09 AB 4589" : null),
            city: origin.split(" ")[0] || "Indore",
            isVerified: true,
            rating: user?.rating || 4.9,
            hasActivePass: user?.hasActivePass || false,
          },
        };
      }

      if (createdPost) {
        persistToLocalStorage(createdPost);
        setIsSuccess(true);
        // Instant dynamic redirection to feed with success toast flag
        router.push("/?posted=true");
      }
    } catch (err) {
      console.error("Submission error:", err);
      // Fallback local save even on network failure
      const fallbackPost = {
        id: `offline-${Date.now()}`,
        userId: user?.id || "user-local",
        type: postType,
        title: title || `${vehicleType} Route`,
        origin: origin.trim(),
        destination: destination.trim(),
        vehicleType,
        targetPrice: targetPrice ? parseInt(targetPrice, 10) : null,
        departureTime: departureTime.trim(),
        notes: notes.trim(),
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
        user: {
          id: user?.id || "user-local",
          name: user?.name || "Driver Ji",
          phone: user?.phone || "9826012345",
          role: user?.role || "DRIVER",
          vehicleNumber: user?.vehicleNumber || "MP 09 AB 4589",
          city: origin.split(" ")[0] || "Indore",
          isVerified: true,
          rating: 4.9,
          hasActivePass: true,
        },
      };
      persistToLocalStorage(fallbackPost);
      router.push("/?posted=true");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 pb-28 text-slate-100">
      <Header />

      <main className="px-4 pt-3 flex-1 max-w-md mx-auto w-full">
        {/* Screen Title */}
        <div className="mb-3.5">
          <h1 className="text-lg font-black text-white tracking-tight flex items-center space-x-2">
            <span>Post Route / Maal Load</span>
          </h1>
          <p className="text-xs text-slate-400">
            Kisan, Vyapari aur Driver ka 0% commission direct transport platform.
          </p>
        </div>

        {/* Toggle Switch: Driver (Gadi Khali Hai) vs Vyapari (Maal Bhejna Hai) */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-800/90 rounded-2xl border border-slate-700/80 mb-4 shadow-md">
          <button
            type="button"
            onClick={() => setPostType("VEHICLE_AVAILABLE")}
            className={`py-3 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
              postType === "VEHICLE_AVAILABLE"
                ? "bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/30 border border-emerald-400/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center space-x-1.5">
              <Truck className="w-4 h-4" />
              <span>Main Driver Hoon</span>
            </div>
            <span className="text-[10px] opacity-90 font-medium">
              (Gadi Khali Hai)
            </span>
          </button>

          <button
            type="button"
            onClick={() => setPostType("LOAD_AVAILABLE")}
            className={`py-3 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
              postType === "LOAD_AVAILABLE"
                ? "bg-gradient-to-tr from-amber-600 to-yellow-500 text-white shadow-lg shadow-amber-600/30 border border-amber-400/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center space-x-1.5">
              <Package className="w-4 h-4" />
              <span>Main Vyapari Hoon</span>
            </div>
            <span className="text-[10px] opacity-90 font-medium">
              (Maal Bhejna Hai)
            </span>
          </button>
        </div>

        {/* Voice AI Speech-to-Text Component */}
        <div className="mb-4">
          <VoiceInput onParsed={handleVoiceParsed} />
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className={`bg-white rounded-2xl p-4 shadow-xl border transition-all text-slate-800 ${
            isVoiceFilled
              ? "border-emerald-500 ring-2 ring-emerald-400/50"
              : "border-slate-200"
          }`}
        >
          {isVoiceFilled && (
            <div className="mb-3 p-2 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Voice AI dwara fields auto-populate ho chuki hain!</span>
            </div>
          )}

          {formError && (
            <div className="mb-3 p-2.5 bg-red-50 border border-red-300 rounded-xl text-red-700 text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {isSuccess && (
            <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-400 rounded-xl text-emerald-800 text-xs font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Post kamyaabi se publish hua! Feed par le ja rahe hain...</span>
            </div>
          )}

          {/* Optional Title / Crop Name */}
          <div className="mb-3.5">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Title / Maal Ka Naam (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                postType === "LOAD_AVAILABLE"
                  ? "e.g. Tamatar (Tomato) Load - 80 Peti"
                  : "e.g. Tata 407 (Open Body) - Khali Return"
              }
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50"
            />
          </div>

          {/* Kahan Se (Origin Mandi / City)* */}
          <div className="mb-3.5">
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>Kahan Se (Origin Mandi / City)*</span>
            </label>
            <input
              type="text"
              required
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="e.g. Indore Devi Ahilya Mandi"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50 font-medium"
            />
            {/* Quick Mandi Suggestions */}
            <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar mt-1.5">
              {POPULAR_MANDIS.slice(0, 4).map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setOrigin(m)}
                  className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md shrink-0 border border-slate-200"
                >
                  {m.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Kahan Tak (Destination)* */}
          <div className="mb-3.5">
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
              <Flag className="w-3.5 h-3.5 text-emerald-600" />
              <span>Kahan Tak (Destination Mandi / City)*</span>
            </label>
            <input
              type="text"
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Chhindwara / Nagpur Kalamna"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50 font-medium"
            />
            {/* Quick Mandi Suggestions */}
            <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar mt-1.5">
              {POPULAR_MANDIS.slice(1, 5).map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setDestination(m)}
                  className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md shrink-0 border border-slate-200"
                >
                  {m.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Gadi Ka Type Dropdown */}
          <div className="mb-3.5">
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
              <Truck className="w-3.5 h-3.5 text-slate-500" />
              <span>Gadi Ka Type*</span>
            </label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50 font-medium"
            >
              {VEHICLE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Nikalne Ka Samay + Bhada / Target Rate (2-col grid) */}
          <div className="grid grid-cols-2 gap-3 mb-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Nikalne Ka Samay</span>
              </label>
              <input
                type="text"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                placeholder="e.g. Aaj Raat 9:00 PM"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                <span>Bhada / Target Rate</span>
              </label>
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="e.g. 3500 (Optional)"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50 font-medium"
              />
            </div>
          </div>

          {/* Kucch Khas Jaankari (Notes) */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Kucch Khas Jaankari (Notes)</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Tirpal available, urgent pickup, 80 peti tamatar, labor loading support..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-slate-50"
            />
          </div>

          {/* Big Submit Button: Post Publish Karein */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all active:scale-98 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Publish Ho Raha Hai...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Post Publish Karein</span>
              </>
            )}
          </button>
        </form>
      </main>

      <BottomNav />
    </div>
  );
}
