"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface User {
  email: string;
  id?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
  avatar: string;
  updateAvatar: (icon: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: () => {},
  refreshUser: async () => {},
  avatar: "👤",
  updateAvatar: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [avatar, setAvatar] = useState("👤");

  const API = process.env.NEXT_PUBLIC_API;

  useEffect(() => {
    const saved = localStorage.getItem("avatar");
    if (saved) setAvatar(saved);
  }, []);

  const updateAvatar = (icon: string) => {
    setAvatar(icon);
    localStorage.setItem("avatar", icon);
  };

  // Защита от параллельных вызовов (в dev-режиме React StrictMode
  // вызывает эффект дважды — без guards улетало два запроса /api/user/me)
  let meInFlight: Promise<void> | null = null;

  const refreshUser = async () => {
    if (meInFlight) return meInFlight;

    meInFlight = (async () => {
      try {
        const res = await fetch(`${API}/api/user/me`, {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
        meInFlight = null;
      }
    })();

    return meInFlight;
  };

  useEffect(() => {
    refreshUser();
  }, [API]);

  const logout = () => {
    document.cookie = "token=; Max-Age=0; path=/;";
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        logout,
        refreshUser,
        avatar,
        updateAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
