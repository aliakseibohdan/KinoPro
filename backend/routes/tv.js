const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Универсальная функция запроса к TMDB (V4 Bearer Token)
async function tmdb(endpoint) {
  const url = `https://api.themoviedb.org/3${endpoint}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TMDB_API_KEY}`,
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.log("TMDB ERROR STATUS:", res.status);
    console.log("TMDB ERROR BODY:", text);
    throw new Error("TMDB error");
  }

  return res.json();
}

// 🔥 Фильтрация сериалов
router.get("/filter", async (req, res) => {
  try {
    const { page = 1, genre, year, country } = req.query;

    const params = new URLSearchParams({
      language: "ru-RU",
      page,
      include_adult: "false",
    });

    if (genre) params.append("with_genres", genre);
    if (year) params.append("first_air_date_year", year);
    if (country) params.append("with_origin_country", country);

    const endpoint = `/discover/tv?${params.toString()}`;
    const data = await tmdb(endpoint);

    res.json({
      page: data.page,
      total_pages: data.total_pages,
      results: data.results,
    });
  } catch (err) {
    console.log("TV FILTER ERROR:", err.message);
    res.status(500).json({ error: "TV filter failed" });
  }
});

// 🔥 Популярные сериалы
router.get("/popular", async (req, res) => {
  try {
    const { page = 1 } = req.query;

    const endpoint = `/tv/popular?language=ru-RU&page=${page}`;
    const data = await tmdb(endpoint);

    res.json({
      page: data.page,
      total_pages: data.total_pages,
      results: data.results,
    });
  } catch (err) {
    console.log("POPULAR TV ERROR:", err.message);
    res.status(500).json({ error: "Popular TV failed" });
  }
});

// 🔥 Детали сериала
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Invalid TV ID" });
    }

    const endpoint = `/tv/${id}?language=ru-RU`;
    const data = await tmdb(endpoint);

    res.json(data);
  } catch (err) {
    console.log("TV DETAILS ERROR:", err.message);
    res.status(500).json({ error: "TV details failed" });
  }
});

// 🔥 Актёры сериала
router.get("/:id/credits", async (req, res) => {
  try {
    const { id } = req.params;

    const endpoint = `/tv/${id}/credits?language=ru-RU`;
    const data = await tmdb(endpoint);

    res.json(data);
  } catch (err) {
    console.log("TV CREDITS ERROR:", err.message);
    res.status(500).json({ cast: [] });
  }
});

module.exports = router;
