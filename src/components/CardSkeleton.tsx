import React from "react";

export default function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 animate-pulse text-slate-800 h-[218px] flex flex-col justify-between">
      {/* Header Skeleton */}
      <div className="flex items-center space-x-3">
        <div className="w-11 h-11 rounded-xl bg-slate-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 rounded-md w-3/4" />
          <div className="h-3 bg-slate-100 rounded-md w-1/2" />
        </div>
        <div className="w-16 h-5 bg-slate-200 rounded-full" />
      </div>

      {/* Route Visual Skeleton */}
      <div className="bg-slate-100/70 rounded-xl p-3 my-2 border border-slate-200/60">
        <div className="flex items-center justify-between mb-2">
          <div className="h-2.5 bg-slate-200 rounded w-20" />
          <div className="h-2.5 bg-slate-200 rounded w-20" />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-4 bg-slate-300 rounded w-28" />
          <div className="h-3 bg-slate-200 rounded w-16" />
          <div className="h-4 bg-slate-300 rounded w-28" />
        </div>
      </div>

      {/* Meta Bar Skeleton */}
      <div className="flex items-center justify-between px-1 py-1">
        <div className="h-3 bg-slate-200 rounded w-24" />
        <div className="h-3 bg-slate-200 rounded w-28" />
      </div>

      {/* Action Buttons Skeleton */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <div className="h-9 bg-slate-200 rounded-xl" />
        <div className="h-9 bg-emerald-200 rounded-xl" />
      </div>
    </div>
  );
}
