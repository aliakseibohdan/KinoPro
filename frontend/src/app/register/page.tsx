"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [error, setError] = useState("");

  const API = process.env.NEXT_PUBLIC_API;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== repeat) {
      setError("Пароли не совпадают");
      return;
    }

    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        credentials: "include", // cookie с токеном
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Ошибка регистрации");
        return;
      }

      await refreshUser(); // обновляем профиль
      router.push("/profile");
    } catch {
      setError("Ошибка сервера");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4">Регистрация</h1>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm mb-1 opacity-80">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded bg-zinc-950 border border-white/10 text-sm outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 opacity-80">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded bg-zinc-950 border border-white/10 text-sm outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 opacity-80">Повтор пароля</label>
            <input
              type="password"
              value={repeat}
              onChange={(e) => setRepeat(e.target.value)}
              className="w-full px-3 py-2 rounded bg-zinc-950 border border-white/10 text-sm outline-none focus:border-pink-500"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full mt-2 py-2 rounded bg-pink-600 hover:bg-pink-700 transition text-sm font-semibold"
          >
            Зарегистрироваться
          </button>
        </form>
      </div>
    </div>
  );
}
