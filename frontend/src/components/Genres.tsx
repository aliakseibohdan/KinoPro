const genres = ["Боевик", "Триллер", "Фантастика", "Комедия", "Драма", "Ужасы"];

export default function Genres() {
  return (
    <section className="px-20 py-16 bg-[#1A1A1F]">
      <h2 className="text-2xl font-semibold text-white mb-6">Жанры</h2>
      <div className="flex flex-wrap gap-4">
        {genres.map((genre) => (
          <button key={genre} className="bg-[#2A2A2F] text-white px-5 py-2 rounded-md hover:bg-red-600 transition">
            {genre}
          </button>
        ))}
      </div>
    </section>
  );
}
