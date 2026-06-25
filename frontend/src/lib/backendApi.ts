export async function fetchPopularMovies(page: number = 1) {
  const API = process.env.NEXT_PUBLIC_API;

  const res = await fetch(`${API}/api/movies/popular?page=${page}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Ошибка загрузки фильмов");
  }

  return await res.json();
}
