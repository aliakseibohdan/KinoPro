"use client";

import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import Pagination from "./Pagination";

type MovieGridProps = {
  page: number;
  onPageChange: (page: number) => void;
  genres: string[];
  years: string[];
  countries: string[];
  categories: string[];
  enableFavorites?: boolean;
};

const GENRE_MAP: Record<string, number> = {
  Боевик: 28,
  Приключения: 12,
  Анимация: 16,
  Комедия: 35,
  Криминал: 80,
  Документальный: 99,
  Драма: 18,
  Семейный: 10751,
  Фэнтези: 14,
  Исторический: 36,
  Ужасы: 27,
  Музыкальный: 10402,
  Мистический: 9648,
  Мелодрама: 10749,
  Фантастика: 878,
  Триллер: 53,
  Военный: 10752,
  Вестерн: 37,
  Спорт: 10770,
  Аниме: 16,
};

const COUNTRY_MAP: Record<string, string> = {
  Американские: "US",
  Русские: "RU",
  Турецкие: "TR",
  Европейские: "FR",
};

export default function MovieGrid({
  page,
  onPageChange,
  genres,
  years,
  countries,
  categories,
  enableFavorites = false,
}: MovieGridProps) {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API;

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        params.set("page", String(page));

        let endpoint = "/api/movies/filter";
        let type: "movie" | "tv" = "movie";

        if (categories.includes("Сериалы")) {
          endpoint = "/api/tv/filter";
          type = "tv";
        }

        if (categories.includes("Мультфильмы") || categories.includes("Аниме")) {
          params.set("genre", "16");
          type = "movie";
        }

        if (genres.length > 0) {
          const id = GENRE_MAP[genres[0]];
          if (id) params.set("genre", String(id));
        }

        if (years.length > 0) {
          params.set("year", years[0]);
        }

        if (countries.length > 0) {
          const code = COUNTRY_MAP[countries[0]];
          if (code) params.set("country", code);
        }

        const res = await fetch(
          `${API}${endpoint}?${params.toString()}`,
          { cache: "no-store" }
        );

        const data = await res.json();

        setMovies(
          Array.isArray(data.results)
            ? data.results.map((m) => ({ ...m, __type: type }))
            : []
        );
      } catch (err) {
        console.error("FILTER FETCH ERROR:", err);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [page, genres, years, countries, categories, API]);

  return (
    <div className="flex flex-col gap-6 overflow-x-hidden">
      {loading && <div className="text-center opacity-70">Загрузка...</div>}

      {!loading && movies.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 p-4">
          {movies.map((movie) => {
            if (!movie || !movie.id) return null;

            const image = movie.poster_path
              ? `${process.env.NEXT_PUBLIC_API}/api/img/t/p/w500${movie.poster_path}`
              : "/no-poster.jpg";

            const type: "movie" | "tv" = movie.__type || "movie";

            return (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title || movie.name || "Без названия"}
                rating={movie.vote_average || 0}
                genre={
                  movie.release_date?.slice(0, 4) ||
                  movie.first_air_date?.slice(0, 4) ||
                  "—"
                }
                image={image}
                type={type}
                page={page}
                enableFavorites={enableFavorites}
              />
            );
          })}
        </div>
      )}

      {!loading && movies.length === 0 && (
        <div className="text-center opacity-70">
          По выбранным фильтрам ничего не найдено.
        </div>
      )}

      <Pagination currentPage={page} onPageChange={onPageChange} />
    </div>
  );
}
