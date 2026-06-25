"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { user, avatar } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Проверяем, открыт ли профиль
  const isProfilePage = pathname === "/profile";

  // Открыть/закрыть профиль
  const toggleProfile = () => {
    if (isProfilePage) {
      router.push("/"); // закрываем профиль
    } else {
      router.push("/profile"); // открываем профиль
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-zinc-900/30 backdrop-blur-lg border-b border-slate-800 z-[1000]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* ЛОГО */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg flex items-center justify-center font-bold text-lg text-white">
            K
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            KinoPro
          </span>
        </Link>

        {/* МЕНЮ — теперь НЕ исчезает */}
        <nav className="hidden lg:flex items-center gap-8 text-white text-lg ml-20">
          <Link href="/" className="hover:text-[#ff6f8f] transition">Главная</Link>
          <Link href="/films" className="hover:text-[#ff6f8f] transition">Фильмы</Link>
          <Link href="/tv" className="hover:text-[#ff6f8f] transition">Сериалы</Link>
          <Link href="/favorites" className="hover:text-[#ff6f8f] transition">Избранное</Link>
        </nav>

        {/* ПОИСК + ПРОФИЛЬ — тоже НЕ исчезает */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="w-72 relative z-[9999]">
            <SearchBar />
          </div>

          {/* ПРОФИЛЬ */}
          <div className="relative">
            {user ? (
              <button
                onClick={toggleProfile}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition text-xl"
                title={isProfilePage ? "Свернуть профиль" : "Открыть профиль"}
              >
                {avatar || "🚀"}
              </button>
            ) : (
              <>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition text-xl"
                >
                  😊
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-zinc-900 border border-white/10 rounded-lg shadow-lg p-2 z-[9999]">
                    <Link href="/login" className="block px-3 py-2 rounded hover:bg-white/10">
                      Вход
                    </Link>
                    <Link href="/register" className="block px-3 py-2 rounded hover:bg-white/10">
                      Регистрация
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* МОБИЛЬНОЕ МЕНЮ */}
        <button
          className="lg:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>
    </header>
  );
}
