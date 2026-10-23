import Link from "next/link";
import { Truck } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center text-white">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
        <Truck className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-white mb-1">Page Nahi Mila (404)</h2>
      <p className="text-xs text-slate-400 mb-6">
        Yeh rasta ya listing uplabdh nahi hai. MandiReturn home page par wapas jayein.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30"
      >
        Home Feed Par Wapas Jayein
      </Link>
    </div>
  );
}
