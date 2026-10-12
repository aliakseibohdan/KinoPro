"use client";

import Link from "next/link";

export default function MovieCard({
  id,
  title,
  rating,
  genre,
  image,
  type,
  page,
  enableFavorites = false,
}: {
  id: number | string;
  title: string;
  rating: number;
  genre: string;
  image: string;
  type: "movie" | "tv";
  page?: number;
  enableFavorites?: boolean;
}) {
  const href =
    type === "tv"
      ? `/tv/${id}?page=${page ?? 1}`
      : `/movie/${id}?page=${page ?? 1}`;

  return (
    <Link href={href}>
      <div className="bg-zinc-900 rounded-lg overflow-hidden shadow-md hover:scale-105 transition-transform cursor-pointer max-w-[150px]">
        <img
          src={image}
          alt={title}
          className="w-full h-[225px] object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/300x450?text=No+Image";
          }}
        />

        <div className="p-2">
          <h3 className="text-white text-xs font-semibold truncate">
            {title}
          </h3>

          <div className="flex justify-between items-center mt-1">
            <p className="text-gray-400 text-[10px]">{genre}</p>
            <span className="text-yellow-400 text-[10px] font-semibold">
              <i className="fa-solid fa-star" aria-hidden="true"></i>{" "}
              {rating?.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
