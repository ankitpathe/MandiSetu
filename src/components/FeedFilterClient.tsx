"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import PostCard from "@/components/PostCard";
import CardSkeleton from "@/components/CardSkeleton";
import { PostItem } from "@/lib/types";
import {
  Search,
  Truck,
  Package,
  Layers,
  RefreshCw,
  CheckCircle2,
  X,
} from "lucide-react";

interface FeedFilterClientProps {
  initialPosts: PostItem[];
}

export default function FeedFilterClient({ initialPosts }: FeedFilterClientProps) {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"ALL" | "VEHICLE_AVAILABLE" | "LOAD_AVAILABLE">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [localPosts, setLocalPosts] = useState<PostItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Check for ?posted=true from /post redirect
  useEffect(() => {
    if (searchParams.get("posted") === "true") {
      setShowSuccessToast(true);
      const timer = setTimeout(() => setShowSuccessToast(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  // Load dynamically created posts from localStorage for instant offline/reload persistence
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mandireturn_local_posts");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setLocalPosts(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Merge server initial posts + local dynamic posts (avoiding duplicates)
  const allPosts = useMemo(() => {
    const combined = [...localPosts];
    const localIds = new Set(localPosts.map((p) => p.id));
    for (const post of initialPosts) {
      if (!localIds.has(post.id)) {
        combined.push(post);
      }
    }
    return combined;
  }, [initialPosts, localPosts]);

  // Fast Client-side Filtering by City, Commodity, Vehicle, or Route
  const filteredPosts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allPosts.filter((post) => {
      // Tab filter
      if (activeTab !== "ALL" && post.type !== activeTab) {
        return false;
      }
      // Search filter
      if (q) {
        const titleMatch = post.title?.toLowerCase().includes(q);
        const originMatch = post.origin?.toLowerCase().includes(q);
        const destMatch = post.destination?.toLowerCase().includes(q);
        const vehicleMatch = post.vehicleType?.toLowerCase().includes(q);
        const notesMatch = post.notes?.toLowerCase().includes(q);
        const userCityMatch = post.user?.city?.toLowerCase().includes(q);
        return titleMatch || originMatch || destMatch || vehicleMatch || notesMatch || userCityMatch;
      }
      return true;
    });
  }, [allPosts, activeTab, searchQuery]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      if (data.success && Array.isArray(data.posts)) {
        setLocalPosts([]);
      }
    } catch {
      // ignore
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div>
      {/* Instant Success Toast after posting */}
      {showSuccessToast && (
        <div className="mb-3.5 p-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl flex items-center justify-between animate-fade-in border border-emerald-400/40">
          <div className="flex items-center space-x-2.5">
            <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </span>
            <div>
              <span className="text-xs font-black block">Badhai Ho! Post Live Hai 🎉</span>
              <span className="text-[11px] text-emerald-100">
                Aapka route MandiReturn feed par sabhi vyapariyon aur drivers ko dikh raha hai.
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

      {/* Fast Live Search Bar */}
      <div className="relative mb-3.5">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Mandi ya Fasal khojein: Chhindwara, Indore, Nagpur, Tamatar..."
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
          <button
            onClick={handleRefresh}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-white"
            title="Refresh Feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-400" : ""}`} />
          </button>
        )}
      </div>

      {/* 3-Tab Filter Bar: All, Return Trucks, Maal Loads */}
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
          <span>Sabhi ({allPosts.length})</span>
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
          <span>Return Trucks</span>
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
          <span>Maal Loads</span>
        </button>
      </div>

      {/* Feed Listings or Empty State */}
      <div className="space-y-3.5 min-h-[300px]">
        {isRefreshing ? (
          <div className="space-y-3">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-slate-800/50 rounded-2xl p-8 text-center border border-slate-700/60 my-6">
            <Truck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="font-bold text-white text-sm">Koi Listing Nahi Mili</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              {searchQuery
                ? `"${searchQuery}" ke liye koi result nahi mila.`
                : "Is category mein abhi koi post uplabdh nahi hai."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs"
              >
                Search Reset Karein
              </button>
            )}
          </div>
        ) : (
          filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
