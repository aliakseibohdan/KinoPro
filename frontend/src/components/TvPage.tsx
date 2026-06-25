"use client";

import { useEffect, useState } from "react";

export default function TvPage({ id }: { id: string }) {
  const [tv, setTv] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API;

  const goBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  const cleanId = String(id).match(/\d+/)?.[0] ?? "";

  console.log("TV PAGE ID:", id);
  console.log("TV PAGE CLEAN ID:", cleanId);

  useEffect(() => {
    const load = async () => {
      try {
        if (!cleanId) {
          setTv(null);
          setLoading(false);
          return;
        }

        const res = await fetch(`${API}/api/tv/${cleanId}`);
        const data = await res.json();

        if (!data || data.error) {
          setTv(null);
        } else {
          setTv(data);
        }
      } catch (err) {
        console.error("TV DETAILS ERROR:", err);
        setTv(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [cleanId, API]);

  if (loading) return <div className="p-6 text-white">Загрузка...</div>;
  if (!tv)
    return (
      <div className="p-6 text-white">
        Сериал не найден (ID: {cleanId || "нет ID"})
      </div>
    );

  return (
    <div className="p-6 text-white max-w-4xl mx-auto">

      <button
        onClick={goBack}
        className="mb-6 px-4 py-2 bg-white/10 hover:bg-white/20 transition rounded-lg text-sm"
      >
        ← Назад
      </button>

      <h1 className="text-3xl font-bold mb-4">
        {tv.name || tv.original_name}
      </h1>

      <p className="opacity-80 mb-4 leading-relaxed">{tv.overview}</p>
    </div>
  );
}
