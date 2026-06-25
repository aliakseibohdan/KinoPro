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
    console.log("TMDB ERROR STATUS:", res.status);
    console.log("TMDB ERROR BODY:", text);
    throw new Error("TMDB error");
  }

  return res.json();
}

// 🔥 Карта жанров
const GENRES = {
  "Боевик": 28,
  "Комедия": 35,
  "Драма": 18,
  "Ужасы": 27,
  "Фантастика": 878,
  "Фэнтези": 14,
  "Триллер": 53,
  "Криминал": 80,
  "Мелодрама": 10749,
  "Приключения": 12,
  "Анимация": 16,
  "Аниме": 16,
  "Семейный": 10751,
  "Исторический": 36,
  "Документальный": 99,
  "Военный": 10752
};

// 🔥 Карта категорий
const CATEGORY_MAP = {
  "Фильмы": "movie",
  "Сериалы": "tv"
};

//
// 📌 1. ФИЛЬТРЫ (основная сетка фильмов)
//
router.get("/filter", async (req, res) => {
  try {
    const page = req.query.page || 1;
    const genre = req.query.genre || "";
    const category = req.query.category || "";
    const year = req.query.year || "";

    const type = CATEGORY_MAP[category] || "movie";

    const params = new URLSearchParams({
      language: "ru-RU",
      page: String(page),
      sort_by: "popularity.desc",
      include_adult: "false",
    });

    if (genre && GENRES[genre]) {
      params.append("with_genres", String(GENRES[genre]));
    }

    if (year) {
      if (type === "movie") {
        params.append("primary_release_year", String(year));
      } else {
        params.append("first_air_date_year", String(year));
      }
    }

    const endpoint = `/discover/${type}?${params.toString()}`;
    const data = await tmdb(endpoint);

    res.json({
      results: data.results || [],
      page: data.page || 1,
      total_pages: data.total_pages || 1
    });
  } catch (err) {
    console.error("Ошибка /movies/filter:", err);
    res.status(500).json({ error: "Ошибка фильтрации" });
  }
});

//
// 📌 2. ПОПУЛЯРНЫЕ ФИЛЬМЫ
//
router.get("/popular", async (req, res) => {
  try {
    const page = req.query.page || 1;

    const endpoint = `/movie/popular?language=ru-RU&page=${page}`;
    const data = await tmdb(endpoint);

    res.json({
      results: data.results || [],
      page: data.page || 1,
      total_pages: data.total_pages || 1
    });
  } catch (err) {
    console.error("Ошибка /movies/popular:", err);
    res.status(500).json({ error: "Ошибка загрузки популярных" });
  }
});

//
// 📌 3. НОВЫЕ РЕЛИЗЫ
//
router.get("/new", async (req, res) => {
  try {
    const page = req.query.page || 1;

    const today = new Date().toISOString().split("T")[0];

    const params = new URLSearchParams({
      language: "ru-RU",
      page: String(page),
      sort_by: "release_date.desc",
      "primary_release_date.lte": today,
      include_adult: "false",
    });

    const endpoint = `/discover/movie?${params.toString()}`;
    const data = await tmdb(endpoint);

    res.json({
      results: data.results || [],
      page: data.page || 1,
      total_pages: data.total_pages || 1
    });
  } catch (err) {
    console.error("Ошибка /movies/new:", err);
    res.status(500).json({ error: "Ошибка загрузки новых релизов" });
  }
});

module.exports = router;
