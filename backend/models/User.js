const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // ⭐ Избранные фильмы (ID TMDB)
  favorites: {
    type: [Number],
    default: [],
  },

  // 📺 История просмотров
  history: [
    {
      movieId: Number,
      progress: Number, // % просмотра
      lastWatch: Date,
    }
  ],

  // ⚙️ Настройки пользователя
  settings: {
    theme: { type: String, default: "dark" },
    language: { type: String, default: "ru" },
  }
});

module.exports = mongoose.model("User", UserSchema);
