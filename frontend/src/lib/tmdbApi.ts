const BACKEND_URL = process.env.NEXT_PUBLIC_API;

// ===============================
// 🎬 ФИЛЬМЫ
// ===============================

export const fetchPopularMovies = async (page = 1) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/movies/popular?page=${page}`);
    if (!response.ok) throw new Error('Failed to fetch popular movies');
    return response.json();
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

export const searchMovies = async (query: string, page = 1) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/movies/search?q=${encodeURIComponent(query)}&page=${page}`
    );
    if (!response.ok) throw new Error('Failed to search movies');
    return response.json();
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const getMovieDetails = async (movieId: number) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/movies/${movieId}`);
    if (!response.ok) throw new Error('Failed to fetch movie details');
    return response.json();
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

export const getRecommendations = async (movieId: number, page = 1) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/movies/${movieId}/recommendations?page=${page}`
    );
    if (!response.ok) throw new Error('Failed to fetch recommendations');
    return response.json();
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};

export const getGenres = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/movies/genres/list`);
    if (!response.ok) throw new Error('Failed to fetch genres');
    return response.json();
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

export const getMoviesByGenre = async (genreId: number, page = 1) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/movies/genre/${genreId}?page=${page}`
    );
    if (!response.ok) throw new Error('Failed to fetch movies by genre');
    return response.json();
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    throw error;
  }
};

// ===============================
// 📺 СЕРИАЛЫ
// ===============================

export const fetchPopularTV = async (page = 1) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/tv/popular?page=${page}`);
    if (!response.ok) throw new Error('Failed to fetch popular TV shows');
    return response.json();
  } catch (error) {
    console.error('Error fetching popular TV shows:', error);
    throw error;
  }
};

export const fetchTopRatedTV = async (page = 1) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/tv/top_rated?page=${page}`);
    if (!response.ok) throw new Error('Failed to fetch top rated TV shows');
    return response.json();
  } catch (error) {
    console.error('Error fetching top rated TV shows:', error);
    throw error;
  }
};

export const fetchLatestTV = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/tv/latest`);
    if (!response.ok) throw new Error('Failed to fetch latest TV show');
    return response.json();
  } catch (error) {
    console.error('Error fetching latest TV show:', error);
    throw error;
  }
};
