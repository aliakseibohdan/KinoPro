const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");
const cookieParser = require("cookie-parser");

// ---------------------------------------------------------
// 🔥 1. Загружаем .env
// ---------------------------------------------------------
dotenv.config({ path: __dirname + "/.env" });

// ---------------------------------------------------------
// 🔥 2. Подключение MongoDB
// ---------------------------------------------------------
const connectDB = require("./config/db");
connectDB();

// Модель пользователя
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------------------------------------------
// 🔥 Middleware
// ---------------------------------------------------------
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// ---------------------------------------------------------
// 🔥 РЕГИСТРАЦИЯ
// ---------------------------------------------------------
app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      return res.status(400).json({ message: "Введите email и пароль" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email уже используется" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hash,
      favorites: [],
      history: [],
    });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Регистрация успешна", user: { email: user.email } });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// ---------------------------------------------------------
// 🔥 ВХОД
// ---------------------------------------------------------
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Неверный email или пароль" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ message: "Неверный email или пароль" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Вход выполнен", user: { email: user.email } });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// ---------------------------------------------------------
// 🔥 Middleware проверки токена
// ---------------------------------------------------------
function auth(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Нет токена" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: "Неверный токен" });
  }
}

// ---------------------------------------------------------
// 🔥 API ПРОФИЛЯ
// ---------------------------------------------------------
app.get("/api/user/me", auth, async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
});

// ---------------------------------------------------------
// ⭐ ИЗБРАННЫЕ
// ---------------------------------------------------------
app.get("/api/user/favorites", auth, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json(user.favorites);
});

app.post("/api/user/favorites", auth, async (req, res) => {
  const { movieId } = req.body;

  const user = await User.findById(req.userId);
  if (!user.favorites.includes(movieId)) {
    user.favorites.push(movieId);
  }

  await user.save();
  res.json(user.favorites);
});

app.delete("/api/user/favorites", auth, async (req, res) => {
  const { movieId } = req.body;

  const user = await User.findById(req.userId);
  user.favorites = user.favorites.filter((id) => id !== movieId);

  await user.save();
  res.json(user.favorites);
});

// ---------------------------------------------------------
// 📺 ИСТОРИЯ ПРОСМОТРА
// ---------------------------------------------------------
app.post("/api/user/history", auth, async (req, res) => {
  const { movieId, progress } = req.body;

  const user = await User.findById(req.userId);

  const item = user.history.find((h) => h.movieId === movieId);

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

// ---------------------------------------------------------
// 🔥 ПРОКСИ ДЛЯ COLLAPS
// ---------------------------------------------------------
app.get("/api/proxy/collaps", async (req, res) => {
  const { id } = req.query;

  if (!id) return res.status(400).json({ error: "Missing TMDB ID" });

  const url = `https://collaps.org/embed/movie/${id}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "*/*",
      },
    });

    const html = await response.text();

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (err) {
    res.status(500).json({ error: "Proxy error", details: err.message });
  }
});

// ---------------------------------------------------------
// 🔥 ПРОКСИ ДЛЯ HDVB
// ---------------------------------------------------------
app.get("/api/proxy/hdvb", async (req, res) => {
  const { id } = req.query;

  if (!id) return res.status(400).json({ error: "Missing TMDB ID" });

  const url = `https://hdvb.me/embed/movie/${id}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "*/*",
      },
    });

    const html = await response.text();

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (err) {
    res.status(500).json({ error: "Proxy error", details: err.message });
  }
});

// ---------------------------------------------------------
// 🔥 ПРОКСИ ДЛЯ KODIK
// ---------------------------------------------------------
app.get("/api/proxy/kodik", async (req, res) => {
  const { id } = req.query;

  if (!id) return res.status(400).json({ error: "Missing IMDb ID" });

  const url = `https://kodik.info/embed/${id}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "*/*",
      },
    });

    const html = await response.text();

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (err) {
    res.status(500).json({ error: "Proxy error", details: err.message });
  }
});

// ---------------------------------------------------------
// 🔥 TMDB маршруты
// ---------------------------------------------------------
const moviesRouter = require("./routes/movies");
const moviesFilterRouter = require("./routes/moviesFilter");
const tvRouter = require("./routes/tv");
const searchRouter = require("./routes/search");
const similarRouter = require("./routes/similar");
const similarTvRouter = require("./routes/similarTv");

app.use("/api/movies", moviesRouter);
app.use("/api/movies", moviesFilterRouter); // ⭐ ДОБАВЛЕНО
app.use("/api/tv", tvRouter);
app.use("/api/search", searchRouter);
app.use("/api/similar", similarRouter);
app.use("/api/similar-tv", similarTvRouter);

// ---------------------------------------------------------
app.get("/", (req, res) => {
  res.json({ message: "Backend is running" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
