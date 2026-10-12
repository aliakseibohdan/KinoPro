export default async function SearchPage({ searchParams }) {
  const API = process.env.NEXT_PUBLIC_API;
  const query = searchParams.query || "";

  let results: any[] = [];
  try {
    const res = await fetch(
      `${API}/api/search?query=${encodeURIComponent(query)}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const data = await res.json();
      results = data.results || [];
    }
  } catch (e) {
    console.error("Search fetch error:", e);
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">
        Результаты поиска: {query}
      </h1>

      {results.length === 0 ? (
        <p className="opacity-70">Ничего не найдено. Попробуйте другой запрос.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {results.map((movie) => (
            <a
              key={movie.id}
              href={`/movie/${movie.id}`}
              className="bg-zinc-900 rounded-lg overflow-hidden hover:scale-105 transition-transform"
            >
              <img
                src={
                  movie.poster_path
                    ? `${process.env.NEXT_PUBLIC_API}/api/img/t/p/w500${movie.poster_path}`
                    : "/no-poster.jpg"
                }
                alt={movie.title}
              />
              <div className="p-2 text-sm">{movie.title}</div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
