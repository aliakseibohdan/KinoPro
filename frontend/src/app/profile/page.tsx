"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, logout, avatar, updateAvatar } = useAuth();
  const [showPicker, setShowPicker] = useState(false);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-bold mb-4">Вы не авторизованы</h1>
        <p className="opacity-80 mb-4">Чтобы открыть профиль — войдите в аккаунт</p>
        <Link
          href="/login"
          className="px-6 py-2 rounded bg-pink-600 hover:bg-pink-700 transition"
        >
          Войти
        </Link>
      </div>
    );
  }

  // 9 молодёжных аватарок
  const icons = [
    "😎",
    "🤟",
    "🧢",
    "🎧",
    "🚀",
    "🔥",
    "🐼",
    "👾",
    "💀",
  ];

  const handleSelect = (icon: string) => {
    updateAvatar(icon);
    setShowPicker(false);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-zinc-900 border border-white/10 rounded-xl p-6 relative">

        <h1 className="text-3xl font-bold mb-6">Профиль</h1>

        {/* Блок пользователя */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setShowPicker(true)}
            className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-3xl hover:bg-white/20 transition"
            title="Изменить аватар"
          >
            {avatar}
          </button>

          <div>
            <p className="text-lg font-semibold">{user.email}</p>
            <p className="text-sm opacity-70">Аккаунт активен</p>
          </div>
        </div>

        {/* Разделы */}
        <div className="flex flex-col gap-3 mb-6">
          <Link
            href="/favorites"
            className="px-4 py-3 rounded bg-white/5 hover:bg-white/10 transition"
          >
            ⭐ Избранное
          </Link>

          <Link
            href="/history"
            className="px-4 py-3 rounded bg-white/5 hover:bg-white/10 transition"
          >
            📺 История просмотров
          </Link>

          <Link
             href="/admin"
             className="px-4 py-3 rounded bg-white/5 hover:bg-white/10 transition"
          >
            🛠 Администрация сайта
          </Link>
        </div>

        {/* Кнопка выхода */}
        <button
          onClick={logout}
          className="w-full py-2 rounded bg-red-600 hover:bg-red-700 transition"
        >
          Выйти
        </button>

        {/* Модальное окно выбора аватарки */}
        {showPicker && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-xl">
            <div className="bg-zinc-800 p-6 rounded-xl border border-white/10 text-center">
              <h2 className="text-lg font-semibold mb-4">Выберите аватар</h2>

              <div className="grid grid-cols-3 gap-4 text-3xl">
                {icons.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => handleSelect(icon)}
                    className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                  >
                    {icon}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowPicker(false)}
                className="mt-6 px-4 py-2 rounded bg-pink-600 hover:bg-pink-700 transition text-sm"
              >
                Отмена
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
