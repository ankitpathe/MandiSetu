"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, Role } from "./types";

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (phone: string, role: Role, name?: string) => Promise<boolean>;
  logout: () => void;
  switchDemoUser: (role: Role) => void;
  updateUserPass: (status: boolean) => void;
}

const DEFAULT_DEMO_USERS: Record<Role, UserProfile> = {
  DRIVER: {
    id: "demo-driver-ramesh",
    name: "Ramesh Yadav",
    phone: "9826012345",
    role: "DRIVER",
    vehicleNumber: "MP 09 AB 4589",
    vehicleType: "Tata 407 (Open Body)",
    city: "Indore",
    isVerified: true,
    rating: 4.9,
    hasActivePass: true,
  },
  VYAPARI: {
    id: "demo-vyapari-suresh",
    name: "Suresh Patidar",
    phone: "9827155678",
    role: "VYAPARI",
    vehicleNumber: null,
    vehicleType: null,
    city: "Chhindwara",
    isVerified: true,
    rating: 4.8,
    hasActivePass: false,
  },
  FARMER: {
    id: "demo-farmer-devendra",
    name: "Devendra Gurjar",
    phone: "9755123456",
    role: "FARMER",
    vehicleNumber: null,
    vehicleType: null,
    city: "Indore",
    isVerified: true,
    rating: 4.8,
    hasActivePass: false,
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_DEMO_USERS.DRIVER);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for saved session
    const isExplicitlyLoggedOut = localStorage.getItem("mandireturn_logged_out") === "true";
    const savedUser = localStorage.getItem("mandireturn_user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(DEFAULT_DEMO_USERS.DRIVER);
      }
    } else if (isExplicitlyLoggedOut) {
      setUser(null);
    } else {
      setUser(DEFAULT_DEMO_USERS.DRIVER);
      localStorage.setItem("mandireturn_user", JSON.stringify(DEFAULT_DEMO_USERS.DRIVER));
    }
    setIsLoading(false);
  }, []);

  const login = async (phone: string, role: Role, name?: string): Promise<boolean> => {
    try {
      localStorage.removeItem("mandireturn_logged_out");
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, role, name }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem("mandireturn_user", JSON.stringify(data.user));
        return true;
      }
    } catch {
      // Fallback local login if backend is warming up
      const fallbackUser: UserProfile = {
        id: `user-${Date.now()}`,
        name: name || (role === "DRIVER" ? "Driver Ji" : "Vyapari Bhaisaab"),
        phone,
        role,
        vehicleNumber: role === "DRIVER" ? "MP 09 XY 1234" : null,
        vehicleType: role === "DRIVER" ? "Bolero Pickup" : null,
        city: "Indore",
        isVerified: true,
        rating: 4.8,
        hasActivePass: role === "DRIVER",
      };
      localStorage.removeItem("mandireturn_logged_out");
      setUser(fallbackUser);
      localStorage.setItem("mandireturn_user", JSON.stringify(fallbackUser));
      return true;
    }
    return false;
  };

  const switchDemoUser = (role: Role) => {
    localStorage.removeItem("mandireturn_logged_out");
    const selected = DEFAULT_DEMO_USERS[role];
    setUser(selected);
    localStorage.setItem("mandireturn_user", JSON.stringify(selected));
  };

  const updateUserPass = (status: boolean) => {
    if (!user) return;
    const updated = { ...user, hasActivePass: status };
    setUser(updated);
    localStorage.setItem("mandireturn_user", JSON.stringify(updated));
  };

  const logout = () => {
    localStorage.removeItem("mandireturn_user");
    localStorage.setItem("mandireturn_logged_out", "true");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        switchDemoUser,
        updateUserPass,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
