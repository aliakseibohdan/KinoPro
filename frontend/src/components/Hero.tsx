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

      {/* Кинематографичное затемнение: виньетка + плавный переход
          картинки в фон страницы (#030712) вместо резкой нижней границы */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            "linear-gradient(to bottom, rgba(3,7,18,0.55) 0%, transparent 25%)",
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.45) 100%)",
            "linear-gradient(to top, #030712 0%, rgba(3,7,18,0.8) 20%, rgba(3,7,18,0.35) 50%, transparent 80%)",
          ].join(", "),
        }}
      />

      {/* Дизеринг-шум: разбивает полосы квантования (banding) на длинном
          тёмном градиенте — без него плавный переход показывает ступеньки */}
      <div
        className="absolute inset-x-0 bottom-0 h-[75%] pointer-events-none opacity-[0.045]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

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
