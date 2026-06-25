"use client";

import Link from "next/link";

export default function MediaCard({ item }) {
  const poster = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  return (
    <Link href={`/series/${item.id}`}>
      <div
        className="
          bg-[#111]
          rounded-lg
          overflow-hidden
          shadow-md
          hover:scale-105
          transition-transform
          cursor-pointer
        "
      >
        <img
          src={poster}
          alt={item.title || item.name}
          className="w-full h-auto object-cover"
          loading="lazy"
        />

        <div className="p-3">
          <h3 className="text-sm font-semibold text-white line-clamp-2">
            {item.title || item.name}
          </h3>

          <p className="text-xs text-gray-400 mt-1">
            ⭐ {item.vote_average?.toFixed(1)}
          </p>
        </div>
      </div>
    </Link>
  );
}
