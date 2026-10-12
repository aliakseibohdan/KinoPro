"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import MovieSection from "@/components/MovieSection";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import { fetchPopularMovies } from "@/lib/backendApi";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  genre_ids: number[];
}

export default function Home() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [newReleases, setNewReleases] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);

        let popularList: Movie[] = [];
        let releasesList: Movie[] = [];

        // 🔥 Загружаем 5 страниц = 100 фильмов
        const dedupe = (list: Movie[]) => {
          const seen = new Set<number>();
          return list.filter((m) =>
            seen.has(m.id) ? false : (seen.add(m.id), true)
          );
        };

        for (let page = 1; page <= 5; page++) {
          const popular = await fetchPopularMovies(page);
          popularList.push(...popular.results);

          const releases = await fetchPopularMovies(page + 5);
          releasesList.push(...releases.results);
        }

        // Список популярного меняется между запросами — страницы могут
        // пересекаться, поэтому убираем дубли по id (иначе duplicate key в React)
        setPopularMovies(dedupe(popularList).slice(0, 100));
        setNewReleases(dedupe(releasesList).slice(0, 100));

        setError(null);
      } catch (err) {
        console.error("Error loading movies:", err);
        setError("Не удалось загрузить фильмы. Проверьте TMDB_API_KEY в backend/.env");

        setPopularMovies([
          {
            id: 1,
            title: "Интерстеллар",
            vote_average: 8.6,
            genre_ids: [878],
            poster_path: "",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  const formatMovies = (movies: Movie[]) => {
    return movies.map((movie) => ({
      id: String(movie.id),   // ←←← ВОТ ИСПРАВЛЕНИЕ
      title: movie.title,
      rating: movie.vote_average,
      genre: "Фильм",
      image: movie.poster_path
        ? `${process.env.NEXT_PUBLIC_API}/api/img/t/p/w400${movie.poster_path}`
        : "/no-poster.jpg",
    }));
  };

  return (
    <main>
      <div className="-mt-10">
        <Hero />
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Загрузка фильмов...</p>
        </div>
      ) : (
        <>
          <MovieSection
            title="Популярные фильмы"
            movies={formatMovies(popularMovies)}
            className="-mt-24 relative"
          />
          <MovieSection
            title="Новые релизы"
            movies={formatMovies(newReleases)}
          />
        </>
      )}

      {error && (
        <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
          <p>{error}</p>
        </div>
      )}

      <Features />
      <Footer />
    </main>
  );
}
