"use client";

import { useEffect, useState } from "react";
import TVCard from "./TVCard";
import Pagination from "./Pagination";

const TV_GENRES: Record<string, number> = {
  Боевик: 10759,
  Анимация: 16,
  Комедия: 35,
  Криминал: 80,
  Документальный: 99,
  Драма: 18,
  Семейный: 10751,
  Фэнтези: 10765,
  Исторический: 36,
  Ужасы: 27,
  Мистический: 9648,
  Мелодрама: 10749,
  Фантастика: 10765,
  Триллер: 53,
  Военный: 10768,
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

interface TVGridProps {
  page: number;
  onPageChange: (page: number) => void;
  genres: string[];
  years: string[];
  countries: string[];
  categories?: string[];
}

export default function TVGrid({
  page,
  onPageChange,
  genres = [],
  years = [],
  countries = [],
}: TVGridProps) {
  const [shows, setShows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API;

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        params.set("page", String(page));

        if (genres.length > 0) {
          const ids = genres
            .map((g) => TV_GENRES[g])
            .filter(Boolean)
            .join(",");
          if (ids) params.set("genre", ids);
        }

        if (years.length > 0) {
          params.set("year", years[0]);
        }

        if (countries.length > 0) {
          const code = COUNTRY_MAP[countries[0]];
          if (code) params.set("country", code);
        }

        const res = await fetch(
          `${API}/api/tv/filter?${params.toString()}`,
          { cache: "no-store" }
        );

        const data = await res.json();

        setShows(Array.isArray(data.results) ? data.results : []);
      } catch (err) {
        console.error("TV FILTER ERROR:", err);
        setShows([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [page, genres, years, countries, API]);

  return (
    <div className="flex flex-col gap-6 overflow-x-hidden">
      {loading && (
        <div className="text-center opacity-70">Сериалы загружаются...</div>
      )}

      {!loading && shows.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 p-4">
          {shows.map((show) => {
            if (!show || !show.id) return null;

            const image = show.poster_path
              ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
              : "/no-poster.jpg";

            return (
              <TVCard
                key={show.id}
                id={show.id}
                title={show.name || "Без названия"}
                rating={show.vote_average || 0}
                year={show.first_air_date?.slice(0, 4) || "—"}
                image={image}
              />
            );
          })}
        </div>
      )}

      {!loading && shows.length === 0 && (
        <div className="text-center opacity-70">
          По выбранным фильтрам ничего не найдено.
        </div>
      )}

      <Pagination
        currentPage={page}
        onPageChange={(newPage) => onPageChange(newPage)}
      />
    </div>
  );
}
