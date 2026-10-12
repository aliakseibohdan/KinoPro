"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface HistoryItem {
  movieId: number;
  progress: number;
  lastWatch: string;
}

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
}

export default function HistoryPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API;

  useEffect(() => {
    if (!user) return;

    const loadHistory = async () => {
      try {
        const res = await fetch(`${API}/api/user/history`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (Array.isArray(data)) {
          setHistory(data);

          const movieDetails = await Promise.all(
            data.map(async (item: HistoryItem) => {
              const r = await fetch(`${API}/api/movies/${item.movieId}`);
              if (!r.ok) return null;
              return r.json();
            })
          );

          setMovies(movieDetails);
        }
      } catch (err) {
        console.error("Ошибка загрузки истории:", err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [user, API]);

  return (
    <ProtectedRoute>
      <div className="min-h-[70vh] px-4 py-10 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">📺 История просмотров</h1>

        {loading ? (
          <p>Загрузка...</p>
        ) : history.length === 0 ? (
          <div className="text-center opacity-70">
            <p className="mb-4">Вы ещё ничего не смотрели</p>
            <Link
              href="/"
              className="px-6 py-2 rounded bg-pink-600 hover:bg-pink-700 transition"
            >
              На главную
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {history.map((item, index) => {
              const movie = movies[index];
              if (!movie) return null;

              return (
                <Link
                  key={item.movieId}
                  href={`/movie/${item.movieId}`}
                  className="flex gap-4 bg-zinc-900 border border-white/10 rounded-lg p-4 hover:bg-zinc-800 transition"
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_API}/api/img/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                    className="w-24 h-36 object-cover rounded"
                  />

                  <div className="flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">{movie.title}</h2>
                      <p className="text-sm opacity-70">
                        ⭐ {movie.vote_average.toFixed(1)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm opacity-70 mb-1">
                        Прогресс: {item.progress}%
                      </p>

                      <div className="w-full h-2 bg-white/10 rounded">
                        <div
                          className="h-full bg-pink-600 rounded"
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>

                      <p className="text-xs opacity-50 mt-2">
                        Последний просмотр:{" "}
                        {new Date(item.lastWatch).toLocaleString("ru-RU")}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
