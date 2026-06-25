"use client";

import Link from "next/link";

type TVCardProps = {
  id: number;
  title: string;
  rating: number;
  year: string;
  image: string;
};

export default function TVCard({ id, title, rating, year, image }: TVCardProps) {
  const safeImage =
    image && image !== "undefined"
      ? image
      : "/no-poster.jpg";

  return (
    <Link href={`/tv/${id}`}>
      <div className="bg-zinc-900 rounded-lg overflow-hidden shadow-md hover:scale-105 transition-transform cursor-pointer max-w-[150px]">
        <img
          src={safeImage}
          alt={title}
          className="w-full h-[225px] object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "/no-poster.jpg";
          }}
        />

        <div className="p-2">
          <h3 className="text-white text-xs font-semibold truncate">
            {title}
          </h3>

          <div className="flex justify-between items-center mt-1">
            <p className="text-gray-400 text-[10px]">{year}</p>

            <span className="text-yellow-400 text-[10px] font-semibold">
              ⭐ {rating?.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
