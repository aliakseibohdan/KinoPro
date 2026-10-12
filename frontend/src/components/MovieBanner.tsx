'use client';

import { useState, useEffect } from 'react';

const featuredMovies = [
  {
    id: 1,
    title: 'Дюна: Часть вторая',
    rating: 8.5,
    image: 'fa-solid fa-earth-europe',
    description: 'Эпическая фантастика в космосе',
  },
  {
    id: 2,
    title: 'Оппенгеймер',
    rating: 8.4,
    image: 'fa-brands fa-react',
    description: 'История создания атомной бомбы',
  },
  {
    id: 3,
    title: 'Барби',
    rating: 7.9,
    image: 'fa-solid fa-heart',
    description: 'Веселая комедия о кукле Барби',
  },
];

export default function MovieBanner() {
  const [currentMovie, setCurrentMovie] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMovie((prev) => (prev + 1) % featuredMovies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const movie = featuredMovies[currentMovie];

  return (
    <div className="relative h-96 md:h-screen bg-gradient-to-r from-red-600 to-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 flex items-center justify-center text-8xl md:text-9xl opacity-20">
        <i className={movie.image} aria-hidden="true"></i>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center px-4 md:px-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {movie.title}
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 mb-6">
            {movie.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                <i className="fa-solid fa-star text-yellow-400" aria-hidden="true"></i>
              </span>
              <span className="text-2xl font-bold text-yellow-400">
                {movie.rating}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 flex-wrap">
            <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold text-lg transition transform hover:scale-105">
              <i className="fa-solid fa-clapperboard mr-2" aria-hidden="true"></i>
              Смотреть трейлер
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-bold text-lg transition border-2 border-red-600">
              <i className="fa-solid fa-ticket mr-2" aria-hidden="true"></i>
              Купить билет
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentMovie(index)}
            className={`w-3 h-3 rounded-full transition ${
              index === currentMovie ? 'bg-red-600 w-8' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
