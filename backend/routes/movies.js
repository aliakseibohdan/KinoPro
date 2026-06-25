const express = require("express");
const router = express.Router();
const axios = require("axios");

const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Универсальная функция запроса к TMDB (V4 Bearer Token)
async function tmdb(endpoint) {
  const url = `https://api.themoviedb.org/3${endpoint}`;

  try {
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${TMDB_API_KEY}`,
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    return res.data;
  } catch (err) {
    console.log("TMDB ERROR:", err.response?.data || err.message);
    throw new Error("TMDB error");
  }
}

// 🔥 Фильтрация фильмов
router.get("/filter", async (req, res) => {
  try {
    const { page = 1, genre, year, country } = req.query;

    const params = new URLSearchParams({
      language: "ru-RU",
      page,
      include_adult: "false",
    });

    if (genre) params.append("with_genres", genre);
    if (year) params.append("primary_release_year", year);
    if (country) params.append("with_origin_country", country);

    const endpoint = `/discover/movie?${params.toString()}`;
    const data = await tmdb(endpoint);

    res.json({
      page: data.page,
      total_pages: data.total_pages,
      results: data.results,
    });
  } catch (err) {
    console.log("MOVIES FILTER ERROR:", err);
    res.status(500).json({ error: "Movies filter failed" });
  }
});

// 🔥 Популярные фильмы
router.get("/popular", async (req, res) => {
  try {
    const { page = 1 } = req.query;

    const params = new URLSearchParams({
      language: "ru-RU",
      page: String(page),
      sort_by: "popularity.desc",
      include_adult: "false",
    });

    const endpoint = `/discover/movie?${params.toString()}`;
    const data = await tmdb(endpoint);

    res.json({
      page: data.page,
      total_pages: data.total_pages,
      results: data.results,
    });
  } catch (err) {
    console.log("POPULAR MOVIES ERROR:", err);
    res.status(500).json({ error: "Popular movies failed" });
  }
});

// 🔥 Детальная страница фильма
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const endpoint = `/movie/${id}?language=ru-RU`;
    const data = await tmdb(endpoint);

    res.json(data);
  } catch (err) {
    console.log("MOVIE DETAILS ERROR:", err);
    res.status(500).json({ error: "Movie details failed" });
  }
});

// 🔥 Актёры фильма
router.get("/:id/credits", async (req, res) => {
  try {
    const { id } = req.params;

    const endpoint = `/movie/${id}/credits?language=ru-RU`;
    const data = await tmdb(endpoint);

    res.json(data);
  } catch (err) {
    console.log("MOVIE CREDITS ERROR:", err);
    res.status(500).json({ cast: [] });
  }
});

// 🔥 Похожие фильмы
router.get("/:id/similar", async (req, res) => {
  try {
    const { id } = req.params;

    const endpoint = `/movie/${id}/similar?language=ru-RU`;
    const data = await tmdb(endpoint);

    res.json({
      results: data.results || [],
    });
  } catch (err) {
    console.log("MOVIE SIMILAR ERROR:", err);
    res.status(500).json({ results: [] });
  }
});

module.exports = router;
