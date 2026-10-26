"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import YohohoPlayer from "@/components/YohohoPlayer";
import EmbedPlayer from "@/components/EmbedPlayer";

export default function TVDetailsPage({ params }: { params: { id: string } }) {
  const [tv, setTv] = useState<any | null>(null);
  const [credits, setCredits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // ⭐ ID Кинопоиска (undefined — ищем, null — нет, строка — найден)
  const [kpId, setKpId] = useState<string | null | undefined>(undefined);
  const [activePlayer, setActivePlayer] = useState("vidsrc");

  const API = process.env.NEXT_PUBLIC_API;

  const goBack = () => {
    if (typeof window !== "undefined") window.history.back();
  };

  const cleanId = String(params.id).match(/\d+/)?.[0] ?? "";

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API}/api/tv/${cleanId}`);
        const data = await res.json();

        const creditsRes = await fetch(`${API}/api/tv/${cleanId}/credits`);
        const creditsData = await creditsRes.json();

        setTv(data);
        setCredits(creditsData.cast || []);
      } catch (err) {
        console.error("TV DETAILS ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [cleanId, API]);

  // ⭐ ID Кинопоиска через Wikidata (null → плеер ищет по названию + году)
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);

    fetch(`${API}/api/kinopoisk/tv/${cleanId}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : { kinopoiskId: null }))
      .then((data) =>
        setKpId(data.kinopoiskId ? String(data.kinopoiskId) : null)
      )
      .catch(() => setKpId(null))
      .finally(() => clearTimeout(timer));

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [cleanId, API]);

  if (loading) return <div className="p-6 text-white">Загрузка...</div>;
  if (!tv) return <div className="p-6 text-white">Сериал не найден</div>;

  const poster = tv.poster_path
    ? `${process.env.NEXT_PUBLIC_API}/api/img/t/p/w500${tv.poster_path}`
    : "/no-poster.jpg";

  return (
    <main className="p-4 text-white max-w-5xl mx-auto">

      {/* Назад */}
      <button
        onClick={goBack}
        className="mb-4 px-4 py-2 bg-white/10 hover:bg-white/20 transition rounded-lg text-sm"
      >
        <i className="fa-solid fa-arrow-left" aria-hidden="true"></i> Назад
      </button>

      {/* Постер + Информация */}
      <div className="flex flex-col md:flex-row gap-6">

        {/* Постер */}
        <img
          src={poster}
          alt={tv.name}
          className="rounded-lg shadow-lg w-[200px] h-auto"
          onError={(e) => (e.currentTarget.src = "/no-poster.jpg")}
        />

        <div className="flex flex-col gap-2 text-sm max-w-md">
          <h1 className="text-2xl font-bold">{tv.name}</h1>

          <p><span className="opacity-70">Год:</span> {tv.first_air_date?.slice(0, 4)}</p>
          <p><span className="opacity-70">Страна:</span> {tv.origin_country?.join(", ")}</p>
          <p><span className="opacity-70">Жанры:</span> {tv.genres?.map((g) => g.name).join(" / ")}</p>
          <p>
            <span className="opacity-70">Длительность серии:</span>
            {tv.episode_run_time?.[0] ? ` ${tv.episode_run_time[0]} мин` : " —"}
          </p>

          <div className="mt-3">
            <h2 className="text-lg font-semibold mb-1">Описание</h2>
            <p className="opacity-80 leading-relaxed text-sm">{tv.overview}</p>
          </div>
        </div>
      </div>

      {/* Актёры */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Актёры</h2>

        <div className="flex gap-3 overflow-x-auto pb-3">
          {credits.slice(0, 20).map((actor) => (
            <div key={actor.id} className="flex-shrink-0 w-[70px] text-center">
              <img
                src={
                  actor.profile_path
                    ? `${process.env.NEXT_PUBLIC_API}/api/img/t/p/w185${actor.profile_path}`
                    : "/no-poster.jpg"
                }
                alt={actor.name}
                className="rounded-lg object-cover w-[70px] h-[100px]"
                onError={(e) => (e.currentTarget.src = "/no-poster.jpg")}
              />
              <p className="mt-1 text-[10px] font-semibold truncate">{actor.name}</p>
              <p className="text-[9px] opacity-60 truncate">{actor.character}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Плееры */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Смотреть онлайн</h2>

        <div className="flex gap-3 mb-4">
          {tv.imdb_id && (
            <button
              onClick={() => setActivePlayer("vidsrc")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activePlayer === "vidsrc"
                  ? "bg-pink-600 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              Плеер 1
            </button>
          )}

          <button
            onClick={() => setActivePlayer("embed2")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activePlayer === "embed2"
                ? "bg-pink-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Плеер 2
          </button>

          <button
            onClick={() => setActivePlayer("yohoho")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activePlayer === "yohoho"
                ? "bg-pink-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Плеер 3
          </button>
        </div>

        {activePlayer === "vidsrc" && tv.imdb_id ? (
          <EmbedPlayer src={`https://vidsrc.to/embed/tv/${tv.imdb_id}/1-1`} />
        ) : activePlayer === "embed2" ? (
          <EmbedPlayer
            src={`https://www.2embed.cc/embed/tvmdb/${cleanId}-1-1`}
          />
        ) : kpId === undefined ? (
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden" />
        ) : (
          <YohohoPlayer
            kinopoiskId={kpId ?? undefined}
            title={tv.name}
            year={tv.first_air_date?.slice(0, 4)}
          />
        )}
      </div>
    </main>
  );
}
