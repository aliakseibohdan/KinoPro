"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full h-[600px] flex items-center justify-center">
      {/* Баннер */}
      <img
        src="/banner.jpg"
        alt="banner"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Затемнение */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Контент */}
      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
          <span className="bg-gradient-to-r from-white via-red-500 to-pink-500 bg-clip-text text-transparent">
            Смотрите лучшие
          </span>
          <br />
          <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            фильмы и сериалы
          </span>
        </h1>

        <p
          className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          Более 100 000 фильмов и сериалов в вашем распоряжении. Смотрите без
          ограничений 24/7
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          {/* 🔥 Кнопка ведёт на /films */}
          <Link
            href="/films"
            className="px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-red-600/50"
          >
            Начать смотреть
          </Link>
        </div>
      </div>
    </section>
  );
}
