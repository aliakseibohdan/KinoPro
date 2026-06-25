const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Middleware проверки токена
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Нет токена" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: "Неверный токен" });
  }
}

// Получить профиль
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
});

// Добавить в избранное
router.post("/favorites", auth, async (req, res) => {
  const { movieId } = req.body;

  const user = await User.findById(req.userId);
  if (!user.favorites.includes(movieId)) {
    user.favorites.push(movieId);
  }

  await user.save();
  res.json(user.favorites);
});

// Удалить из избранного
router.delete("/favorites", auth, async (req, res) => {
  const { movieId } = req.body;

  const user = await User.findById(req.userId);
  user.favorites = user.favorites.filter(id => id !== movieId);

  await user.save();
  res.json(user.favorites);
});

// История просмотров
router.post("/history", auth, async (req, res) => {
  const { movieId, progress } = req.body;

  const user = await User.findById(req.userId);

  const item = user.history.find(h => h.movieId === movieId);

  if (item) {
    item.progress = progress;
    item.lastWatch = new Date();
  } else {
    user.history.push({
      movieId,
      progress,
      lastWatch: new Date(),
    });
  }

  await user.save();
  res.json(user.history);
});

module.exports = router;
