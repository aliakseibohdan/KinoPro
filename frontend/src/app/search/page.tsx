export default async function SearchPage({ searchParams }) {
  const API = process.env.NEXT_PUBLIC_API;
  const query = searchParams.query || "";

  const res = await fetch(`${API}/api/search?query=${query}`, {
    cache: "no-store",
  });

  const data = await res.json();

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">
        Результаты поиска: {query}
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {data.results?.map((movie) => (
          <a
            key={movie.id}
            href={`/movie/${movie.id}`}
            className="bg-zinc-900 rounded-lg overflow-hidden hover:scale-105 transition-transform"
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
            <div className="p-2 text-sm">{movie.title}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
