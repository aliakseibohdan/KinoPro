"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";

export default function TVDetailsPage({ params }: { params: { id: string } }) {
  const [tv, setTv] = useState<any | null>(null);
  const [credits, setCredits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

      {/* Плеер */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Смотреть онлайн</h2>

        <iframe
          src={`${API}/api/proxy/collaps?id=${cleanId}`}
          allowFullScreen
          className="w-full rounded-lg border border-white/10 bg-black"
          style={{ height: "320px" }}
        />
      </div>
    </main>
  );
}
