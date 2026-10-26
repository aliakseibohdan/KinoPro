const express = require("express");
const router = express.Router();
const axios = require("axios");
const KinopoiskMap = require("../models/KinopoiskMap");

const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Свойство Wikidata, в котором хранится ID фильма/сериала в Кинопоиске
const KINOPOISK_PROPERTY = "P2603";
// Сколько держим в памяти «временный промах» (сбой сети вверх по цепочке)
const TRANSIENT_MISS_TTL = 5 * 60 * 1000;

// Кэш в памяти процесса: `${type}:${tmdbId}` → { kpId, transient?, at }
const memoryCache = new Map();

async function tmdb(endpoint) {
  const url = `https://api.themoviedb.org/3${endpoint}`;
  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${TMDB_API_KEY}` },
    timeout: 8000,
  });
  return res.data;
}

async function wikidataKinopoiskId(wikidataId) {
  const url =
    "https://www.wikidata.org/w/api.php?action=wbgetclaims&format=json" +
    `&entity=${encodeURIComponent(wikidataId)}&property=${KINOPOISK_PROPERTY}`;

  const res = await axios.get(url, {
    headers: { "User-Agent": "KinoPro/1.0 (kinopoisk id resolver)" },
    timeout: 8000,
  });

  const claim = res.data?.claims?.[KINOPOISK_PROPERTY]?.[0];
  const kpId = Number(claim?.mainsnak?.datavalue?.value);
  return Number.isFinite(kpId) && kpId > 0 ? kpId : null;
}

async function resolveKinopoiskId(type, tmdbId) {
  const key = `${type}:${tmdbId}`;

  // 1. Горячий кэш памяти
  const cached = memoryCache.get(key);
  if (cached) {
    if (!cached.transient) return cached.kpId;
    if (Date.now() - cached.at < TRANSIENT_MISS_TTL) return null;
    memoryCache.delete(key);
  }

  // 2. Персистентный кэш в Mongo (null = проверено, ID нет)
  const saved = await KinopoiskMap.findOne({ tmdbId, type }).lean();
  if (saved) {
    memoryCache.set(key, { kpId: saved.kinopoiskId, at: Date.now() });
    return saved.kinopoiskId;
  }

  // 3. Резолвим: TMDB external_ids → wikidata_id → P2603
  const external = await tmdb(`/${type}/${tmdbId}/external_ids`);
  const wikidataId = external?.wikidata_id;
  const kpId = wikidataId ? await wikidataKinopoiskId(wikidataId) : null;

  KinopoiskMap.updateOne(
    { tmdbId, type },
    { tmdbId, type, kinopoiskId: kpId, resolvedAt: new Date() },
    { upsert: true }
  ).catch((e) => console.log("KINOPOISK CACHE SAVE ERROR:", e.message));

  memoryCache.set(key, { kpId, at: Date.now() });
  return kpId;
}

router.get("/:type/:tmdbId", async (req, res) => {
  const { type } = req.params;
  const tmdbId = Number(req.params.tmdbId);

  if ((type !== "movie" && type !== "tv") || !Number.isInteger(tmdbId)) {
    return res.status(400).json({ error: "Invalid request" });
  }

  try {
    const kinopoiskId = await resolveKinopoiskId(type, tmdbId);
    res.json({ kinopoiskId });
  } catch (err) {
    console.log("KINOPOISK RESOLVE ERROR:", err.message);
    // сбой сети — не персистим, чтобы не «заморозить» пустой результат
    memoryCache.set(`${type}:${tmdbId}`, {
      kpId: null,
      transient: true,
      at: Date.now(),
    });
    res.json({ kinopoiskId: null });
  }
});

module.exports = router;
