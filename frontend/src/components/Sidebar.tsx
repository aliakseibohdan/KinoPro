"use client";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#0d0d0d]/90 backdrop-blur-sm border-r border-white/10 h-screen sticky top-0 overflow-y-auto text-gray-300">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-white mb-4">Панель навигации</h2>

        {/* 🔹 ЖАНРЫ */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-pink-500 mb-2">Жанры</h3>
          <ul className="space-y-1 text-sm">
            <li><Link href="#" className="hover:text-white">Боевики</Link></li>
            <li><Link href="#" className="hover:text-white">Комедии</Link></li>
            <li><Link href="#" className="hover:text-white">Драмы</Link></li>
            <li><Link href="#" className="hover:text-white">Ужасы</Link></li>
            <li><Link href="#" className="hover:text-white">Фантастика</Link></li>
            <li><Link href="#" className="hover:text-white">Фэнтези</Link></li>
          </ul>
        </div>

        {/* 🔹 КАТЕГОРИИ */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-pink-500 mb-2">Категории</h3>
          <ul className="space-y-1 text-sm">
            <li><Link href="#" className="hover:text-white">Все фильмы</Link></li>
            <li><Link href="#" className="hover:text-white">Сериалы</Link></li>
            <li><Link href="#" className="hover:text-white">Мультфильмы</Link></li>
            <li><Link href="#" className="hover:text-white">Аниме</Link></li>
          </ul>
        </div>

        {/* 🔹 ГОДЫ */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-pink-500 mb-2">По году</h3>
          <ul className="space-y-1 text-sm">
            <li><Link href="#" className="hover:text-white">2026</Link></li>
            <li><Link href="#" className="hover:text-white">2025</Link></li>
            <li><Link href="#" className="hover:text-white">2024</Link></li>
            <li><Link href="#" className="hover:text-white">2023</Link></li>
          </ul>
        </div>

        {/* 🔹 СТРАНЫ */}
        <div>
          <h3 className="text-sm font-semibold text-pink-500 mb-2">По странам</h3>
          <ul className="space-y-1 text-sm">
            <li><Link href="#" className="hover:text-white">Американские</Link></li>
            <li><Link href="#" className="hover:text-white">Русские</Link></li>
            <li><Link href="#" className="hover:text-white">Турецкие</Link></li>
            <li><Link href="#" className="hover:text-white">Европейские</Link></li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
