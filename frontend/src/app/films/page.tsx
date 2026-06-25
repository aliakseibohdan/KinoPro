"use client";

import { useState } from "react";
import MovieGrid from "@/components/MovieGrid";

export default function FilmsPage() {
  const [page, setPage] = useState(1);

  const [showGenres, setShowGenres] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showYears, setShowYears] = useState(false);
  const [showCountries, setShowCountries] = useState(false);

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  const item =
    "block w-full px-3 py-2 bg-[#151515] border border-white/10 rounded-md text-white hover:border-[#ff6f8f] transition";
  const activeItem =
    "block w-full px-3 py-2 bg-[#151515] border border-[#ff6f8f] rounded-md text-white transition";
  const box =
    "w-full px-3 py-2 bg-[#0f0f0f] border border-white/20 rounded-md hover:border-[#ff6f8f] transition text-white";

  const toggle = (value: string, list: string[], setList: (v: string[]) => void) => {
    if (list.includes(value)) setList(list.filter((v) => v !== value));
    else setList([...list, value]);
    setPage(1);
  };

  const resetFilters = () => {
    setSelectedGenres([]);
    setSelectedCategories([]);
    setSelectedYears([]);
    setSelectedCountries([]);
    setPage(1);
  };

  return (
    <main className="flex overflow-x-hidden">

      <button
        onClick={() => window.history.back()}
        className="absolute top-4 left-4 z-50 px-4 py-2 bg-white/10 hover:bg-white/20 transition rounded-lg text-sm text-white"
      >
        ← Назад
      </button>

      <aside className="w-44 bg-[#0d0d0d]/90 border-r border-white/10 h-screen sticky top-0 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-white mb-4">Фильтры</h2>

          {/* ЖАНРЫ */}
          <div className="mb-4">
            <button
              onClick={() => setShowGenres(!showGenres)}
              className={`${box} text-left text-sm font-semibold`}
            >
              Жанры {showGenres ? "▲" : "▼"}
            </button>

            {showGenres && (
              <ul className="space-y-2 mt-2 text-sm">
                {[
                  "Боевик",
                  "Комедия",
                  "Драма",
                  "Ужасы",
                  "Фантастика",
                  "Фэнтези",
                  "Триллер",
                  "Криминал",
                  "Мелодрама",
                  "Приключения",
                  "Анимация",
                  "Аниме",
                  "Семейный",
                  "Исторический",
                  "Документальный",
                  "Военный",
                  "Вестерн",
                  "Музыкальный",
                  "Спорт",
                ].map((g) => (
                  <li key={g}>
                    <button
                      onClick={() => toggle(g, selectedGenres, setSelectedGenres)}
                      className={selectedGenres.includes(g) ? activeItem : item}
                    >
                      {g}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* КАТЕГОРИИ */}
          <div className="mb-4">
            <button
              onClick={() => setShowCategories(!showCategories)}
              className={`${box} text-left text-sm font-semibold`}
            >
              Категории {showCategories ? "▲" : "▼"}
            </button>

            {showCategories && (
              <ul className="space-y-2 mt-2 text-sm">
                {["Фильмы", "Сериалы", "Мультфильмы", "Аниме"].map((c) => (
                  <li key={c}>
                    <button
                      onClick={() => toggle(c, selectedCategories, setSelectedCategories)}
                      className={selectedCategories.includes(c) ? activeItem : item}
                    >
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ГОДЫ */}
          <div className="mb-4">
            <button
              onClick={() => setShowYears(!showYears)}
              className={`${box} text-left text-sm font-semibold`}
            >
              По году {showYears ? "▲" : "▼"}
            </button>

            {showYears && (
              <ul className="space-y-2 mt-2 text-sm">
                {["2026", "2025", "2024", "2023"].map((y) => (
                  <li key={y}>
                    <button
                      onClick={() => toggle(y, selectedYears, setSelectedYears)}
                      className={selectedYears.includes(y) ? activeItem : item}
                    >
                      {y}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* СТРАНЫ */}
          <div className="mb-4">
            <button
              onClick={() => setShowCountries(!showCountries)}
              className={`${box} text-left text-sm font-semibold`}
            >
              По странам {showCountries ? "▲" : "▼"}
            </button>

            {showCountries && (
              <ul className="space-y-2 mt-2 text-sm">
                {["Американские", "Русские", "Турецкие", "Европейские"].map((c) => (
                  <li key={c}>
                    <button
                      onClick={() => toggle(c, selectedCountries, setSelectedCountries)}
                      className={selectedCountries.includes(c) ? activeItem : item}
                    >
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </aside>

      <div className="flex-1 px-6 py-8 overflow-x-hidden">
        <h1 className="text-3xl font-bold text-white mb-6">
          Фильмы — страница {page}
        </h1>

        {(selectedGenres.length ||
          selectedCategories.length ||
          selectedYears.length ||
          selectedCountries.length) > 0 && (
          <div className="mb-6 flex flex-wrap gap-2 items-center">
            {selectedGenres.map((g) => (
              <span key={g} className="px-3 py-1 bg-pink-600 text-white rounded-full text-sm">
                {g}
              </span>
            ))}
            {selectedCategories.map((c) => (
              <span key={c} className="px-3 py-1 bg-pink-600 text-white rounded-full text-sm">
                {c}
              </span>
            ))}
            {selectedYears.map((y) => (
              <span key={y} className="px-3 py-1 bg-pink-600 text-white rounded-full text-sm">
                {y}
              </span>
            ))}
            {selectedCountries.map((c) => (
              <span key={c} className="px-3 py-1 bg-pink-600 text-white rounded-full text-sm">
                {c}
              </span>
            ))}

            <button
              onClick={resetFilters}
              className="ml-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm transition"
            >
              Сбросить все
            </button>
          </div>
        )}

        <MovieGrid
          page={page}
          onPageChange={setPage}
          genres={selectedGenres}
          years={selectedYears}
          countries={selectedCountries}
          categories={selectedCategories}
          enableFavorites={true}
        />
      </div>
    </main>
  );
}
