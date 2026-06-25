"use client";
import { useState } from "react";

export default function KinogoPlayer({ imdbId }: { imdbId: string }) {
  const [activePlayer, setActivePlayer] = useState(1);
  const [activeVoice, setActiveVoice] = useState("Dragon Money Studio");

  // 🔥 Источники 
  const players = {
    1: `https://collaps.org/iframe/${imdbId}`,
    2: `https://hdvb.cc/iframe?imdb=${imdbId}`,
    3: `https://voidboost.net/embed/${imdbId}`,
  };

  // 🔥 Озвучки
  const voices = [
    "Dragon Money Studio",
    "RuDub",
    "Ultradox",
    "NewStudio",
    "LostFilm",
  ];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Смотреть онлайн</h2>

      {/* Кнопки плееров */}
      <div className="flex gap-3 mb-4">
        {[1, 2, 3].map((num) => (
          <button
            key={num}
            onClick={() => setActivePlayer(num)}
            className={`px-4 py-2 rounded transition ${
              activePlayer === num
                ? "bg-pink-600"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            Плеер {num}
          </button>
        ))}
      </div>

      {/* Озвучки */}
      <select
        value={activeVoice}
        onChange={(e) => setActiveVoice(e.target.value)}
        className="mb-4 bg-zinc-800 text-white px-3 py-2 rounded"
      >
        {voices.map((v) => (
          <option key={v} value={v}>
            Дубляж ({v})
          </option>
        ))}
      </select>

      {/* iframe */}
      <iframe
        key={activePlayer}
        src={players[activePlayer]}
        allow="fullscreen; encrypted-media; picture-in-picture"
        allowFullScreen
        className="w-full h-[420px] rounded-lg border border-white/10 bg-black"
      />
    </div>
  );
}
