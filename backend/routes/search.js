const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();
const TMDB_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Универсальная функция запроса к TMDB (V4 Bearer Token)
async function tmdb(endpoint) {
  const url = `${BASE_URL}${endpoint}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TMDB_KEY}`,
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.log("TMDB SEARCH ERROR STATUS:", res.status);
    console.log("TMDB SEARCH ERROR BODY:", text);
    throw new Error("TMDB search error");
  }

  return res.json();
}

// 🔥 Поиск фильмов, сериалов и персон
router.get("/", async (req, res) => {
  try {
    const query = req.query.query || "";
    const page = req.query.page || 1;

    if (!query) {
      return res.json({ results: [], page: 1, total_pages: 1 });
    }

    const endpoint = `/search/multi?language=ru-RU&query=${encodeURIComponent(
      query
    )}&page=${page}&include_adult=false`;

    const data = await tmdb(endpoint);

    res.json(data);
  } catch (err) {
    console.error("Ошибка /search:", err);
    res.status(500).json({ error: "Ошибка поиска" });
  }
});

module.exports = router;
