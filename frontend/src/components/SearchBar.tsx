"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Portal from "@/components/Portal";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const API = process.env.NEXT_PUBLIC_API;

  // 🔒 Блокировка прокрутки при открытом поиске
  useEffect(() => {
    if (showDropdown) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showDropdown]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const delay = setTimeout(() => {
      fetch(`${API}/api/search?query=${query}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data.results || []);
          setShowDropdown(true);
        });
    }, 300);

    return () => clearTimeout(delay);
  }, [query, API]);

  const closeSearch = () => {
    setShowDropdown(false);
    setQuery("");
  };

  return (
    <div
      className="relative z-[1000001] -ml-14"
      style={{ width: "170px" }}
    >
      {/* 🔍 Уменьшенный поиск */}
      <div className="flex items-center bg-zinc-900 rounded-lg overflow-hidden border border-zinc-700">
        <input
          type="text"
          placeholder="Поиск..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-2 py-1 text-xs bg-transparent text-white outline-none"
        />

        <Link
          href={`/search?query=${query}`}
          className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white"
        >
          OK
        </Link>
      </div>

      {/* Выпадающий список + затемнение через портал */}
      {showDropdown && results.length > 0 && (
        <Portal>
          <>
            {/* Затемнение */}
            <div
              className="fixed left-0 right-0 bottom-0 bg-black/60 backdrop-blur-sm z-[999998] fade-slide"
              style={{ top: "70px" }}
              onClick={closeSearch}
            />

            {/* Список */}
            <div
              className="fixed bg-zinc-900 border border-zinc-700 rounded-lg max-h-96 overflow-y-auto z-[999999] w-80 shadow-xl fade-slide"
              style={{
                top: "85px",
                right: "60px",
              }}
            >
              {/* Кнопка закрыть */}
              <button
                onClick={closeSearch}
                className="absolute top-2 right-2 text-white text-xl hover:text-red-500"
              >
                ✕
              </button>

              <div className="pt-8">
                {results.map((movie) => (
                  <Link
                    key={movie.id}
                    href={`/movie/${movie.id}`}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-zinc-800 text-white border-b border-zinc-700 transition"
                    onClick={closeSearch}
                  >
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                          : "/no-poster.jpg"
                      }
                      alt={movie.title || movie.name}
                      className="w-12 h-16 object-cover rounded"
                    />

                    <div className="flex-1">
                      <p className="font-semibold truncate">
                        {movie.title || movie.name}
                      </p>

                      <p className="text-sm text-zinc-400">
                        {(movie.release_date || movie.first_air_date || "----").slice(0, 4)} •{" "}
                        {movie.media_type === "tv" ? "Сериал" : "Фильм"}
                      </p>

                      <div className="flex gap-2 text-xs mt-1">
                        <span className="bg-yellow-600 px-2 py-0.5 rounded">
                          IMDb: {movie.vote_average?.toFixed(1) || "—"}
                        </span>
                        <span className="bg-red-600 px-2 py-0.5 rounded">
                          КП: {movie.kinopoisk_rating || "—"}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        </Portal>
      )}
    </div>
  );
}
