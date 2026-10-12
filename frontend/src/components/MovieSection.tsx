import MovieCard from './MovieCard';
import { useRef, useState } from 'react';

interface MovieSectionProps {
  title: string;
  movies: Array<{
    id: string;
    title: string;
    rating: number;
    genre: string;
    image: string;
  }>;
  type?: "movie" | "tv";
  page?: number;
  enableFavorites?: boolean;
}

export default function MovieSection({
  title,
  movies,
  type = "movie",
  page = 1,
  enableFavorites = false,
}: MovieSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -900, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 900, behavior: 'smooth' });
  };

  return (
    <section
      className="py-12 px-4 sm:px-6 lg:px-8 w-full mx-auto"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">
          <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            {title}
          </span>
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-full" />
      </div>

      {/* Обёртка с relative: градиенты и кнопки привязаны к ряду фильмов,
          а не ко всей секции — иначе перекрывают заголовок */}
      <div className="relative">
        {hovered && (
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black/70 to-transparent pointer-events-none z-10 hidden md:block" />
        )}

        {hovered && (
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black/70 to-transparent pointer-events-none z-10 hidden md:block" />
        )}

        <button
          onClick={scrollLeft}
          className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-black/60 hover:bg-black/80 text-white text-2xl transition-all hidden md:flex ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <i className="fa-solid fa-chevron-left" aria-hidden="true"></i>
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide py-2 scroll-smooth"
        >
          {movies.map((movie) => (
            <div key={movie.id} className="flex-shrink-0">
              <MovieCard
                id={Number(movie.id)}
                title={movie.title}
                rating={movie.rating}
                genre={movie.genre}
                image={movie.image}
                type={type}                 // ⭐ добавлено
                page={page}                 // ⭐ добавлено
                enableFavorites={enableFavorites} // ⭐ добавлено
              />
            </div>
          ))}
        </div>

        <button
          onClick={scrollRight}
          className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-black/60 hover:bg-black/80 text-white text-2xl transition-all hidden md:flex ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
        </button>
      </div>
    </section>
  );
}
