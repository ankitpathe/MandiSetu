"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PostCard from "@/components/PostCard";
import { PostItem } from "@/lib/types";
import {
  Search,
  Truck,
  Package,
  Layers,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
  X,
} from "lucide-react";

// Robust default dataset ready on 0ms initial load
const INITIAL_SAMPLE_POSTS: PostItem[] = [
  {
    id: "post-1-sample",
    userId: "user-vyapari-suresh",
    type: "LOAD_AVAILABLE",
    title: "Tamatar (Tomato) Load - 80 Peti",
    origin: "Chhindwara Mandi",
    destination: "Nagpur Kalamna Mandi",
    vehicleType: "Chota Hathi / Ace",
    capacity: "1.5 Ton",
    targetPrice: 3500,
    departureTime: "Aaj Shaam 7:00 PM",
    notes: "Tirpal zaroori hai. Urgent delivery by midnight.",
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    user: {
      id: "user-vyapari-suresh",
      name: "Suresh Patidar",
      phone: "9827155678",
      role: "VYAPARI",
      vehicleNumber: null,
      city: "Chhindwara",
      isVerified: true,
      rating: 4.8,
      hasActivePass: false,
    },
  },
  {
    id: "post-2-sample",
    userId: "user-driver-ramesh",
    type: "VEHICLE_AVAILABLE",
    title: "Tata 407 (Open Body) - Khali Return",
    origin: "Nagpur Kalamna Mandi",
    destination: "Betul / Indore Mandi",
    vehicleType: "Tata 407 (Open Body)",
    capacity: "3.5 Ton",
    targetPrice: 4200,
    departureTime: "Aaj Raat 10:30 PM",
    notes: "Nagpur se khali wapas Indore ja rahi hai. Raaste mein Betul bhi utar sakte hain.",
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    user: {
      id: "user-driver-ramesh",
      name: "Ramesh Yadav",
      phone: "9826012345",
      role: "DRIVER",
      vehicleNumber: "MP 09 AB 4589",
      city: "Indore",
      isVerified: true,
      rating: 4.9,
      hasActivePass: true,
    },
  },
  {
    id: "post-3-sample",
    userId: "user-vyapari-rajesh",
    type: "LOAD_AVAILABLE",
    title: "Gehun (Wheat) & Makka (Corn) Bori",
    origin: "Betul Krishi Upaj Mandi",
    destination: "Indore Chhavani Mandi",
    vehicleType: "Bolero Pickup",
    capacity: "2.2 Ton",
    targetPrice: 4800,
    departureTime: "Kal Subah 6:00 AM",
    notes: "50 bori makka aur gehun. Loading par hamare pipal rahenge.",
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    user: {
      id: "user-vyapari-rajesh",
      name: "Rajesh Agrawal",
      phone: "9425099887",
      role: "VYAPARI",
      vehicleNumber: null,
      city: "Betul",
      isVerified: true,
      rating: 4.9,
      hasActivePass: false,
    },
  },
  {
    id: "post-4-sample",
    userId: "user-driver-mukesh",
    type: "VEHICLE_AVAILABLE",
    title: "Bolero Maxi Truck - Return Trip",
    origin: "Indore Mandi",
    destination: "Chhindwara Mandi",
    vehicleType: "Bolero Pickup",
    capacity: "2.0 Ton",
    targetPrice: 3800,
    departureTime: "Kal Dopahar 1:00 PM",
    notes: "Sabzi ya anaj ka load chahiye. Gadi bilkul fit hai.",
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    user: {
      id: "user-driver-mukesh",
      name: "Mukesh Verma",
      phone: "9893244321",
      role: "DRIVER",
      vehicleNumber: "MH 31 CA 7721",
      city: "Nagpur",
      isVerified: true,
      rating: 4.7,
      hasActivePass: true,
    },
  },
  {
    id: "post-5-sample",
    userId: "user-kisan-devendra",
    type: "LOAD_AVAILABLE",
    title: "Pyaz (Onion) Mandi Bhejna Hai",
    origin: "Indore Devi Ahilya Mandi",
    destination: "Mumbai Vashi APMC Mandi",
    vehicleType: "Eicher 6-Wheeler",
    capacity: "7.0 Ton",
    targetPrice: 18500,
    departureTime: "Aaj Raat 11:00 PM",
    notes: "Fresh red onions. Direct delivery to Vashi market stall.",
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    user: {
      id: "user-kisan-devendra",
      name: "Devendra Gurjar",
      phone: "9755123456",
      role: "FARMER",
      vehicleNumber: null,
      city: "Indore",
      isVerified: true,
      rating: 4.8,
      hasActivePass: false,
    },
  },
];

function HomeFeedContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"ALL" | "VEHICLE_AVAILABLE" | "LOAD_AVAILABLE">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<PostItem[]>(INITIAL_SAMPLE_POSTS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Check for newly posted flag
  useEffect(() => {
    if (searchParams && searchParams.get("posted") === "true") {
      setShowSuccessToast(true);
      const timer = setTimeout(() => setShowSuccessToast(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  // Fetch real API data and merge with local storage items
  const loadPosts = async () => {
    try {
      // 1. Check local storage for newly posted items
      let localItems: PostItem[] = [];
      const stored = localStorage.getItem("mandireturn_local_posts");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) localItems = parsed;
        } catch {
          // ignore
        }
      }

      // 2. Fetch from backend API
      const res = await fetch("/api/posts");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.posts) && data.posts.length > 0) {
          const apiPosts: PostItem[] = data.posts;
          // Merge avoiding duplicates
          const seen = new Set<string>();
          const merged: PostItem[] = [];

          for (const p of [...localItems, ...apiPosts, ...INITIAL_SAMPLE_POSTS]) {
            if (!seen.has(p.id)) {
              seen.add(p.id);
              merged.push(p);
            }
          }
          setPosts(merged);
          return;
        }
      }

      // Fallback if API is warming up
      if (localItems.length > 0) {
        const seen = new Set(localItems.map((p) => p.id));
        setPosts([...localItems, ...INITIAL_SAMPLE_POSTS.filter((p) => !seen.has(p.id))]);
      }
    } catch (e) {
      console.warn("API fetch error, using resilient fallback:", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadPosts();
  };

  // Fast Client-side Filtering
  const filteredPosts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return posts.filter((post) => {
      // Filter Tabs: ALL vs Return Gadi (VEHICLE_AVAILABLE) vs Maal Load (LOAD_AVAILABLE)
      if (activeTab !== "ALL" && post.type !== activeTab) {
        return false;
      }
      // Search Bar Query
      if (q) {
        const titleMatch = post.title?.toLowerCase().includes(q);
        const originMatch = post.origin?.toLowerCase().includes(q);
        const destMatch = post.destination?.toLowerCase().includes(q);
        const vehicleMatch = post.vehicleType?.toLowerCase().includes(q);
        const userCityMatch = post.user?.city?.toLowerCase().includes(q);
        const notesMatch = post.notes?.toLowerCase().includes(q);
        return titleMatch || originMatch || destMatch || vehicleMatch || userCityMatch || notesMatch;
      }
      return true;
    });
  }, [posts, activeTab, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 pb-24 text-slate-100">
      {/* 1. Top Header: MandiReturn, Agri Transport Exchange + Bell + Persona Switcher */}
      <Header />

      {/* Main Content Feed */}
      <main className="px-4 pt-3 flex-1">
        {/* Success Toast */}
        {showSuccessToast && (
          <div className="mb-3.5 p-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl flex items-center justify-between animate-fade-in border border-emerald-400/40">
            <div className="flex items-center space-x-2.5">
              <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </span>
              <div>
                <span className="text-xs font-black block">Badhai Ho! Post Live Hai 🎉</span>
                <span className="text-[11px] text-emerald-100">
                  Aapka route MandiReturn feed par turant publish ho chuka hai.
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowSuccessToast(false)}
              className="p-1 rounded-lg hover:bg-white/20 text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Live Marketplace Banner */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-800 to-emerald-950/80 border border-emerald-500/30 rounded-2xl p-3 mb-3.5 shadow-lg flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-black text-emerald-300 uppercase tracking-wider">
                  Live Mandi Exchange
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                MP, Maharashtra & Gujarat ke verified return loads
              </p>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all active:scale-95"
            title="Refresh Feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-400" : ""}`} />
          </button>
        </div>

        {/* 2. Fast Search Bar */}
        <div className="relative mb-3.5">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Mandi ya Fasal khojein: Indore, Nagpur, Chhindwara, Tamatar..."
            className="w-full bg-slate-800/90 text-white placeholder-slate-400 text-xs rounded-xl pl-10 pr-16 py-3 border border-slate-700/80 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white font-semibold"
            >
              Clear
            </button>
          ) : (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-medium">
              Live Filter
            </span>
          )}
        </div>

        {/* 3. Filter Tabs: All, Return Gadi, Maal Load */}
        <div className="flex items-center space-x-1.5 p-1 bg-slate-800/70 rounded-xl border border-slate-700/60 mb-4">
          <button
            onClick={() => setActiveTab("ALL")}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === "ALL"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All ({posts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("VEHICLE_AVAILABLE")}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === "VEHICLE_AVAILABLE"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Return Gadi</span>
          </button>

          <button
            onClick={() => setActiveTab("LOAD_AVAILABLE")}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === "LOAD_AVAILABLE"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Maal Load</span>
          </button>
        </div>

        {/* 4. Transport Listings Feed */}
        <div className="space-y-3.5">
          {filteredPosts.length === 0 ? (
            <div className="bg-slate-800/50 rounded-2xl p-8 text-center border border-slate-700/60 my-6">
              <Truck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="font-bold text-white text-sm">Koi Listing Nahi Mili</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                {searchQuery
                  ? `"${searchQuery}" ke liye koi result nahi mila.`
                  : "Is category mein koi post uplabdh nahi hai."}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </main>

      {/* 5. Fixed Bottom Navigation with Active Home Tab */}
      <BottomNav />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-emerald-400 font-bold text-sm">
          MandiReturn Load Ho Raha Hai...
        </div>
      }
    >
      <HomeFeedContent />
    </Suspense>
  );
}
