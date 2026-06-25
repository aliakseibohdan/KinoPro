import axios from "axios";

const TMDB_BASE_URL = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Создаём axios клиент с Bearer Token (V4)
const axiosTMDB = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${TMDB_API_KEY}`,
    "Content-Type": "application/json;charset=utf-8",
  },
  params: {
    language: "ru-RU",
  },
});

export const tmdbService = {
  // ============================
  // 🎬 ФИЛЬМЫ
  // ============================

  getPopularMovies: async (page = 1) => {
    const response = await axiosTMDB.get("/movie/popular", {
      params: { page },
    });
    return response.data;
  },

  searchMovies: async (query, page = 1) => {
    const response = await axiosTMDB.get("/search/movie", {
      params: { query, page },
    });
    return response.data;
  },

  getMovieDetails: async (movieId) => {
    const response = await axiosTMDB.get(`/movie/${movieId}`);
    return response.data;
  },

  getMovieRecommendations: async (movieId, page = 1) => {
    const response = await axiosTMDB.get(`/movie/${movieId}/recommendations`, {
      params: { page },
    });
    return response.data;
  },

  getMoviesByGenre: async (genreId, page = 1) => {
    const response = await axiosTMDB.get("/discover/movie", {
      params: { with_genres: genreId, page },
    });
    return response.data;
  },

  getGenres: async () => {
    const response = await axiosTMDB.get("/genre/movie/list");
    return response.data;
  },

  // ============================
  // 📺 СЕРИАЛЫ
  // ============================

  getPopularTV: async (page = 1) => {
    const response = await axiosTMDB.get("/tv/popular", {
      params: { page },
    });
    return response.data;
  },

  getTopRatedTV: async (page = 1) => {
    const response = await axiosTMDB.get("/tv/top_rated", {
      params: { page },
    });
    return response.data;
  },

  getLatestTV: async () => {
    const response = await axiosTMDB.get("/tv/latest");
    return response.data;
  },

  getTVDetails: async (tvId) => {
    const response = await axiosTMDB.get(`/tv/${tvId}`);
    return response.data;
  },

  searchTV: async (query, page = 1) => {
    const response = await axiosTMDB.get("/search/tv", {
      params: { query, page },
    });
    return response.data;
  },

  getTVGenres: async () => {
    const response = await axiosTMDB.get("/genre/tv/list");
    return response.data;
  },

  getTVByGenre: async (genreId, page = 1) => {
    const response = await axiosTMDB.get("/discover/tv", {
      params: { with_genres: genreId, page },
    });
    return response.data;
  },

  getTVRecommendations: async (tvId, page = 1) => {
    const response = await axiosTMDB.get(`/tv/${tvId}/recommendations`, {
      params: { page },
    });
    return response.data;
  },
};
