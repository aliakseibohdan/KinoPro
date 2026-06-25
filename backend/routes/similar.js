const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();
const TMDB_KEY = process.env.TMDB_API_KEY;

// Универсальная функция запроса к TMDB (V4 Bearer Token)
async function tmdb(endpoint) {
  const url = `https://api.themoviedb.org/3${endpoint}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TMDB_KEY}`,
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.log("TMDB SIMILAR ERROR STATUS:", res.status);
    console.log("TMDB SIMILAR ERROR BODY:", text);
    throw new Error("TMDB similar error");
  }

  return res.json();
}

// 🔥 Похожие фильмы
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const endpoint = `/movie/${id}/similar?language=ru-RU&page=1`;
    const data = await tmdb(endpoint);

    res.json({
      results: data.results || [],
    });
  } catch (err) {
    console.log("SIMILAR MOVIES ERROR:", err.message);
    res.status(500).json({ results: [] });
  }
});

module.exports = router;
