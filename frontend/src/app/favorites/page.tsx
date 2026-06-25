"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
}

export default function FavoritesPage() {
  const { user } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API;

  // 🔥 Кнопка назад
  const goBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  const removeFavorite = async (movieId: number) => {
    try {
      await fetch(`${API}/api/user/favorites`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId }),
      });

      setMovies((prev) => prev.filter((m) => m.id !== movieId));
    } catch (err) {
      console.error("Ошибка удаления:", err);
    }
  };

  useEffect(() => {
    if (!user) return;

    const loadFavorites = async () => {
      try {
        const res = await fetch(`${API}/api/user/favorites`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (Array.isArray(data)) {
          const movieDetails = await Promise.all(
            data.map(async (id: number) => {
              const r = await fetch(
                `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=ru-RU`
              );
              return r.json();
            })
          );

          setMovies(movieDetails);
        }
      } catch (err) {
        console.error("Ошибка загрузки избранного:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user, API]);

  return (
    <ProtectedRoute>
      <div className="min-h-[70vh] px-4 py-10 max-w-6xl mx-auto">

        {/* 🔥 Кнопка назад */}
        <button
          onClick={goBack}
          className="mb-6 px-4 py-2 bg-white/10 hover:bg-white/20 transition rounded-lg text-sm"
        >
          ← Назад
        </button>

        <h1 className="text-3xl font-bold mb-6">⭐ Избранное</h1>

        {loading ? (
          <p>Загрузка...</p>
        ) : movies.length === 0 ? (
          <div className="text-center opacity-70">
            <p className="mb-4">У вас пока нет избранных фильмов</p>
            <Link
              href="/"
              className="px-6 py-2 rounded bg-pink-600 hover:bg-pink-700 transition"
            >
              На главную
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="relative bg-zinc-900 border border-white/10 rounded-lg overflow-hidden group max-w-[150px]"
              >
                {/* Кнопка удаления */}
                <button
                  onClick={() => removeFavorite(movie.id)}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                >
                  Удалить
                </button>

                <Link href={`/movie/${movie.id}?from=favorites`}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-[225px] object-cover"
                  />
                  <div className="p-2">
                    <h2 className="text-xs font-semibold truncate">{movie.title}</h2>
                    <p className="text-[10px] opacity-70">
                      ⭐ {movie.vote_average.toFixed(1)}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
