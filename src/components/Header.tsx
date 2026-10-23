"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Truck, CheckCircle2, ChevronDown, User, ShieldCheck, LogOut, LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function Header() {
  const router = useRouter();
  const { user, switchDemoUser, logout } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "Naya Maal Load Available!",
      desc: "Chhindwara se Nagpur ke liye Tamatar load post hua hai.",
      time: "5 min pehle",
      isNew: true,
    },
    {
      id: 2,
      title: "Return Truck Alert",
      desc: "Nagpur Kalamna se Indore ke liye Tata 407 khali hai.",
      time: "20 min pehle",
      isNew: true,
    },
    {
      id: 3,
      title: "Pass Expiring Soon",
      desc: "Aapka 0% Commission Pass 25 dinon tak valid hai.",
      time: "1 ghanta pehle",
      isNew: false,
    },
  ];

  const getRoleBadge = () => {
    if (!user) {
      return { initial: "+", label: "Login", bg: "bg-emerald-600 text-white border-emerald-400" };
    }
    if (user.role === "DRIVER") {
      return { initial: "R", label: "R Driver", bg: "bg-emerald-600 text-white border-emerald-400" };
    }
    if (user.role === "VYAPARI") {
      return { initial: "S", label: "S Vyapari", bg: "bg-amber-600 text-white border-amber-400" };
    }
    return { initial: "D", label: "D Kisan", bg: "bg-blue-600 text-white border-blue-400" };
  };

  const badge = getRoleBadge();

  const handleLogout = () => {
    logout();
    setShowRoleMenu(false);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 text-white">
      <div className="flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <Link href="/" className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
                MandiReturn
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">
                0% BHADA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-tight">
              Agri Transport Exchange
            </p>
          </div>
        </Link>

        {/* Right Actions: Notification Bell + Role Badge Switcher */}
        <div className="flex items-center space-x-2.5">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowRoleMenu(false);
              }}
              className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-300 transition-colors border border-slate-700/50"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-400" />
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-3 z-50 text-slate-100">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Soochana / Alerts
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                    2 New
                  </span>
                </div>
                <div className="space-y-2 mt-2 max-h-60 overflow-y-auto">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-2.5 rounded-xl text-xs ${
                        item.isNew ? "bg-slate-800/90 border border-emerald-900/40" : "bg-slate-800/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-[12px]">{item.title}</span>
                        <span className="text-[10px] text-slate-400">{item.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="w-full mt-2 text-center text-xs text-emerald-400 font-semibold py-1.5 hover:underline"
                >
                  Sabhi Dekhein
                </button>
              </div>
            )}
          </div>

          {/* Role Badge Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                if (!user) {
                  router.push("/login");
                } else {
                  setShowRoleMenu(!showRoleMenu);
                  setShowNotifications(false);
                }
              }}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${badge.bg} shadow-md`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px] font-black">
                {badge.initial}
              </span>
              <span>{badge.label}</span>
              {user && <ChevronDown className="w-3.5 h-3.5 opacity-80" />}
            </button>

            {/* Quick Role Switcher Modal Dropdown */}
            {showRoleMenu && user && (
              <div className="absolute right-0 mt-2 w-60 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 text-slate-200">
                <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 flex items-center justify-between">
                  <span>Switch Persona</span>
                  <span className="text-[10px] text-emerald-400 font-bold">{user.city}</span>
                </div>
                <div className="py-1 space-y-1">
                  <button
                    onClick={() => {
                      switchDemoUser("DRIVER");
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors ${
                      user?.role === "DRIVER"
                        ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800"
                        : "hover:bg-slate-800 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div>Ramesh Yadav (Driver)</div>
                        <div className="text-[10px] text-slate-400">Tata 407 • MP 09</div>
                      </div>
                    </div>
                    {user?.role === "DRIVER" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </button>

                  <button
                    onClick={() => {
                      switchDemoUser("VYAPARI");
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors ${
                      user?.role === "VYAPARI"
                        ? "bg-amber-950/60 text-amber-400 border border-amber-800"
                        : "hover:bg-slate-800 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <div>
                        <div>Suresh Patidar (Vyapari)</div>
                        <div className="text-[10px] text-slate-400">Chhindwara Mandi</div>
                      </div>
                    </div>
                    {user?.role === "VYAPARI" && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                  </button>

                  <button
                    onClick={() => {
                      switchDemoUser("FARMER");
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors ${
                      user?.role === "FARMER"
                        ? "bg-blue-950/60 text-blue-400 border border-blue-800"
                        : "hover:bg-slate-800 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-blue-400" />
                      <div>
                        <div>Devendra Gurjar (Kisan)</div>
                        <div className="text-[10px] text-slate-400">Indore Devi Ahilya</div>
                      </div>
                    </div>
                    {user?.role === "FARMER" && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                  </button>
                </div>

                <div className="pt-1.5 border-t border-slate-800 space-y-1">
                  <Link
                    href="/login"
                    onClick={() => setShowRoleMenu(false)}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Naya Number Login</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/50 transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-400" />
                    <span>Logout (Log Out)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
