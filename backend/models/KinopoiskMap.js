const mongoose = require("mongoose");

// ⭐ Кэш соответствий TMDB → Кинопоиск (kinopoiskId: null = точно нет в Wikidata)
const KinopoiskMapSchema = new mongoose.Schema({
  tmdbId: { type: Number, required: true },
  type: { type: String, enum: ["movie", "tv"], default: "movie" },
  kinopoiskId: { type: Number, default: null },
  resolvedAt: { type: Date, default: Date.now },
});

KinopoiskMapSchema.index({ tmdbId: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("KinopoiskMap", KinopoiskMapSchema);
