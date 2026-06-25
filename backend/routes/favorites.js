const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Получить избранные
router.get("/", async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json(user.favorites || []);
  } catch (err) {
    res.status(500).json({ error: "Ошибка получения избранных" });
  }
});

// Добавить в избранные
router.post("/add", async (req, res) => {
  const { movieId } = req.body;

  try {
    const user = await User.findById(req.userId);

    if (!user.favorites.includes(movieId)) {
      user.favorites.push(movieId);
      await user.save();
    }

    res.json({ success: true, favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ error: "Ошибка добавления" });
  }
});

// Удалить из избранных
router.post("/remove", async (req, res) => {
  const { movieId } = req.body;

  try {
    const user = await User.findById(req.userId);

    user.favorites = user.favorites.filter((id) => id !== movieId);
    await user.save();

    res.json({ success: true, favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ error: "Ошибка удаления" });
  }
});

module.exports = router;
