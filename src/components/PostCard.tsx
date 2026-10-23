"use client";

import React from "react";
import {
  Phone,
  MessageCircle,
  MapPin,
  Flag,
  Clock,
  Truck,
  Package,
  ShieldCheck,
  Star,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { PostItem } from "@/lib/types";

interface PostCardProps {
  post: PostItem;
}

export default function PostCard({ post }: PostCardProps) {
  const isMaalLoad = post.type === "LOAD_AVAILABLE";
  const user = post.user;

  // Clean phone number for links
  const rawPhone = user.phone.replace(/[^0-9]/g, "");
  const formattedPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;

  // Prefilled WhatsApp message
  const whatsappText = isMaalLoad
    ? `Namaste ${user.name} ji, maine MandiReturn par aapka ${post.title} ka load (${post.origin} se ${post.destination}) dekha. Gadi rate aur loading ki baat karni hai.`
    : `Namaste ${user.name} ji, maine MandiReturn par aapki return gadi ${post.vehicleType} (${post.origin} se ${post.destination}) dekhi. Maal load ke baare mein baat karni hai.`;

  const waLink = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(whatsappText)}`;
  const callLink = `tel:${user.phone}`;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 transition-all hover:shadow-md relative overflow-hidden text-slate-800">
      {/* Top Banner Tag for Pass / Verified */}
      {user.hasActivePass && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-600 to-teal-500 text-white text-[9px] font-black px-2.5 py-0.5 rounded-bl-xl uppercase tracking-wider flex items-center space-x-1 shadow-sm">
          <span>0% Commission Verified</span>
        </div>
      )}

      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          {/* Header Icon */}
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
              isMaalLoad
                ? "bg-amber-100 text-amber-700 border border-amber-200"
                : "bg-emerald-100 text-emerald-700 border border-emerald-200"
            }`}
          >
            {isMaalLoad ? <Package className="w-6 h-6" /> : <Truck className="w-6 h-6" />}
          </div>

          <div>
            {/* Title / Good Name / Vehicle Model */}
            <h3 className="font-bold text-slate-900 text-[15px] leading-tight">
              {post.title}
            </h3>

            {/* Poster Name + Sub-meta */}
            <div className="flex items-center space-x-1.5 mt-0.5 text-xs text-slate-600">
              <span className="font-medium text-slate-700">{user.name}</span>
              {user.isVerified && (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline shrink-0" />
              )}
              {user.vehicleNumber && !isMaalLoad && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="font-mono text-[11px] font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200">
                    {user.vehicleNumber}
                  </span>
                </>
              )}
              <div className="flex items-center text-amber-600 font-bold text-[11px] ml-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                {user.rating.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Type Badge */}
        <div className="shrink-0 mt-3 sm:mt-0">
          {isMaalLoad ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-300">
              Maal Load
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
              Available
            </span>
          )}
        </div>
      </div>

      {/* Route Visual Section */}
      <div className="bg-slate-50 rounded-xl p-3 my-3 border border-slate-100">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
          <span className="flex items-center text-slate-600 font-bold">
            <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5" />
            Origin Mandi
          </span>
          <span className="flex items-center text-slate-600 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
            Destination
          </span>
        </div>

        <div className="flex items-center justify-between font-bold text-slate-900 text-sm">
          {/* Origin with Red Pin */}
          <div className="flex items-center space-x-1.5 max-w-[42%] truncate">
            <MapPin className="w-4 h-4 text-red-500 shrink-0" />
            <span className="truncate" title={post.origin}>
              {post.origin}
            </span>
          </div>

          {/* Dotted Line Connection with Target Bhada */}
          <div className="flex-1 px-2 flex flex-col items-center">
            <div className="w-full flex items-center justify-center space-x-1 text-slate-300">
              <span className="h-0.5 flex-1 border-t-2 border-dashed border-slate-300" />
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </div>
            {post.targetPrice ? (
              <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 mt-0.5 whitespace-nowrap shadow-xs">
                ₹{post.targetPrice.toLocaleString("en-IN")}
                <span className="text-[9px] font-medium text-emerald-600"> (Bhada)</span>
              </span>
            ) : (
              <span className="text-[10px] font-medium text-slate-500 mt-0.5">
                Rate on Call
              </span>
            )}
          </div>

          {/* Destination with Green Checkered Flag */}
          <div className="flex items-center space-x-1.5 max-w-[42%] justify-end truncate">
            <span className="truncate text-right" title={post.destination}>
              {post.destination}
            </span>
            <Flag className="w-4 h-4 text-emerald-600 shrink-0" />
          </div>
        </div>

        {/* Notes if present */}
        {post.notes && (
          <div className="mt-2 pt-2 border-t border-slate-200/60 text-xs text-slate-600 italic flex items-center">
            <span className="font-semibold text-slate-700 not-italic mr-1">Note:</span>
            {post.notes}
          </div>
        )}
      </div>

      {/* Meta Bar: Time + Vehicle Requirement / Capacity */}
      <div className="flex items-center justify-between text-xs text-slate-600 px-1 py-1 border-b border-slate-100 mb-3">
        <div className="flex items-center space-x-1">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium text-slate-700">{post.departureTime}</span>
        </div>

        <div className="flex items-center space-x-1 font-semibold text-slate-700">
          <Truck className="w-3.5 h-3.5 text-slate-400" />
          <span>{post.vehicleType}</span>
          {post.capacity && (
            <span className="text-slate-400 font-normal">({post.capacity})</span>
          )}
        </div>
      </div>

      {/* Action Buttons: Call & WhatsApp */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        {/* Call Button */}
        <a
          href={callLink}
          className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all active:scale-98 shadow-sm"
        >
          <Phone className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
          <span>{isMaalLoad ? "Call Vyapari" : "Call Driver"}</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all active:scale-98 shadow-md shadow-emerald-600/20"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
