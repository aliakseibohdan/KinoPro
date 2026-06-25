export default function Popular() {
  const movies = [
    { title: "Оппенгеймер", rating: "9.0", img: "/poster1.jpg" },
    { title: "Джокер", rating: "8.5", img: "/poster2.jpg" },
    { title: "Бэтмен", rating: "8.3", img: "/poster3.jpg" },
    { title: "Дюна", rating: "8.8", img: "/poster4.jpg" },
  ];

  return (
    <section className="px-16 py-12 bg-[#0D0D0F]">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Популярные фильмы
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <div
            key={movie.title}
            className="bg-[#1A1A1F] rounded-md overflow-hidden hover:scale-105 transition-transform"
          >
            <img
              src={movie.img}
              alt={movie.title}
              className="w-full h-[260px] object-cover"
            />
            <div className="p-3 text-center">
              <h3 className="text-white text-sm font-medium">{movie.title}</h3>
              <p className="text-yellow-400 text-xs mt-1">
                ⭐ {movie.rating}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
