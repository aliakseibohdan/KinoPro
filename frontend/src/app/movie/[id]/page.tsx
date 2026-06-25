"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Movie = {
  id: number;
  imdb_id?: string;
  title?: string;
  name?: string;
  poster_path?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  overview?: string;
  production_countries?: { name: string }[];
  genres?: { name: string }[];
  runtime?: number;
};

export default function MoviePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [actors, setActors] = useState<any[]>([]);
  const [similar, setSimilar] = useState<any[]>([]);
  const [isFav, setIsFav] = useState(false);

  const [activePlayer, setActivePlayer] = useState("collaps");

  const API = process.env.NEXT_PUBLIC_API || "";

  const pageFrom = searchParams.get("page");
  const fromFavorites = searchParams.get("from") === "favorites";

  const goBack = () => {
    if (fromFavorites) return router.push("/favorites");
    if (pageFrom) return router.push(`/films?page=${pageFrom}`);
    window.history.back();
  };

  // ⭐ Сбрасываем состояние при смене фильма
  useEffect(() => {
    setMovie(null);
    setActors([]);
    setSimilar([]);
  }, [id]);

  useEffect(() => {
    const load = async () => {
      try {
        const resMovie = await fetch(`${API}/api/movies/${id}`);
        if (!resMovie.ok) return;

        const movieData = await resMovie.json();
        setMovie(movieData);

        const resCredits = await fetch(`${API}/api/movies/${id}/credits`);
        const creditsData = await resCredits.json();
        setActors(creditsData.cast || []);

        const resSimilar = await fetch(`${API}/api/movies/${id}/similar`);
        const similarData = await resSimilar.json();
        setSimilar(similarData.results || []);
      } catch (e) {
        console.log("Movie load error:", e);
      }
    };

    load();
  }, [id, API]);

  useEffect(() => {
    const checkFav = async () => {
      if (!user) return;

      try {
        const res = await fetch(`${API}/api/user/favorites`, {
          credentials: "include",
        });

        const data = await res.json();
        if (Array.isArray(data)) {
          setIsFav(data.includes(Number(id)));
        }
      } catch (e) {
        console.log("Fav check error:", e);
      }
    };

    checkFav();
  }, [user, id, API]);

  const toggleFavorite = async () => {
    if (!user) return alert("Войдите в аккаунт");

    const method = isFav ? "DELETE" : "POST";

    try {
      await fetch(`${API}/api/user/favorites`, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: Number(id) }),
      });

      setIsFav(!isFav);
    } catch (e) {
      console.log("Fav toggle error:", e);
    }
  };

  if (!movie) return <div className="text-white p-6">Загрузка...</div>;

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/no-poster.jpg";

  // ⭐ Плееры
  const players = {
    collaps: `${API}/api/proxy/collaps?id=${movie.id}`,
    hdvb: `${API}/api/proxy/hdvb?id=${movie.id}`,
    kodik: movie.imdb_id ? `${API}/api/proxy/kodik?id=${movie.imdb_id}` : null,
  };

  return (
    <div className="p-4 text-white max-w-5xl mx-auto">
      <button
        onClick={goBack}
        className="mb-4 px-4 py-2 bg-white/10 hover:bg-white/20 transition rounded-lg text-sm"
      >
        ← Назад
      </button>

      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-2xl font-bold">{movie.title}</h1>

        <button
          onClick={toggleFavorite}
          className={`px-3 py-1 rounded-lg text-xs transition ${
            isFav
              ? "bg-pink-600 hover:bg-pink-700"
              : "bg-white/10 hover:bg-white/20"
          }`}
        >
          {isFav ? "💖 В избранном" : "⭐ В избранное"}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={poster}
          alt={movie.title ?? "poster"}
          className="rounded-lg shadow-lg w-[200px] h-auto"
          onError={(e) => (e.currentTarget.src = "/no-poster.jpg")}
        />

        <div className="flex flex-col gap-2 text-sm max-w-md">
          <p>
            <span className="opacity-70">Год:</span>{" "}
            {movie.release_date?.slice(0, 4)}
          </p>
          <p>
            <span className="opacity-70">Страна:</span>{" "}
            {movie.production_countries?.[0]?.name || "—"}
          </p>
          <p>
            <span className="opacity-70">Жанры:</span>{" "}
            {movie.genres?.map((g) => g.name).join(" / ")}
          </p>
          <p>
            <span className="opacity-70">Длительность:</span>
            {movie.runtime
              ? ` ${Math.floor(movie.runtime / 60)} ч ${movie.runtime % 60} мин`
              : " —"}
          </p>

          <div className="mt-3">
            <h2 className="text-lg font-semibold mb-1">Описание</h2>
            <p className="opacity-80 leading-relaxed text-sm">
              {movie.overview}
            </p>
          </div>
        </div>
      </div>

      {/* ⭐ Актёры */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Актёры</h2>

        <div className="flex gap-4 overflow-x-auto pb-3">
          {actors.slice(0, 12).map((actor) => (
            <div key={actor.id} className="flex-shrink-0 w-[90px] text-center">
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                    : "/no-avatar.png"
                }
                alt={actor.name}
                className="rounded-lg object-cover w-[90px] h-[120px]"
                onError={(e) => (e.currentTarget.src = "/no-avatar.png")}
              />
              <p className="mt-1 text-xs font-semibold truncate">
                {actor.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ⭐ Плееры */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Смотреть онлайн</h2>

        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setActivePlayer("collaps")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activePlayer === "collaps"
                ? "bg-pink-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Плеер 1
          </button>

          <button
            onClick={() => setActivePlayer("hdvb")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activePlayer === "hdvb"
                ? "bg-pink-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Плеер 2
          </button>

          {players.kodik && (
            <button
              onClick={() => setActivePlayer("kodik")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activePlayer === "kodik"
                  ? "bg-pink-600 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              Плеер 3
            </button>
          )}
        </div>

        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
          <iframe
            src={players[activePlayer] || ""}
            allowFullScreen
            className="w-full h-full border-0"
          ></iframe>
        </div>
      </div>

      {/* ⭐ Похожие фильмы */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Похожие фильмы</h2>

        <div className="flex gap-4 overflow-x-auto pb-3">
          {similar.slice(0, 12).map((film) => (
            <a
              key={film.id}
              href={`/movie/${film.id}`}
              className="flex-shrink-0 w-[110px]"
            >
              <img
                src={
                  film.poster_path
                    ? `https://image.tmdb.org/t/p/w300${film.poster_path}`
                    : "/no-poster.jpg"
                }
                alt={film.title ?? "poster"}
                className="rounded-lg object-cover w-[110px] h-[160px]"
                onError={(e) => (e.currentTarget.src = "/no-poster.jpg")}
              />
              <p className="mt-2 text-xs font-semibold truncate">
                {film.title}
              </p>
              <p className="text-[10px] opacity-60">
                {film.release_date?.slice(0, 4)}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
