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
// 🔥 Обход DNS-блокировки TMDB на локальной машине
// (если резолвер отдаёт 127.0.0.1 для TMDB — резолвим через 1.1.1.1)
// ---------------------------------------------------------
const dns = require("dns");

function installTmdbDnsOverride() {
  const TMDB_HOSTS = new Set(["api.themoviedb.org", "image.tmdb.org"]);
  const resolver = new dns.Resolver();
  resolver.setServers(["1.1.1.1"]);
  const originalLookup = dns.lookup.bind(dns);

  dns.lookup = function (hostname, options, callback) {
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    if (!TMDB_HOSTS.has(hostname)) {
      return originalLookup(hostname, options, callback);
    }

    const wantV6 = options.family === 6;
    resolver[wantV6 ? "resolve6" : "resolve4"](hostname, (err, addresses) => {
      if (err || !addresses || !addresses.length) {
        return originalLookup(hostname, options, callback);
      }
      if (options.all) {
        callback(
          null,
          addresses.map((address) => ({ address, family: wantV6 ? 6 : 4 }))
        );
      } else {
        callback(null, addresses[0], wantV6 ? 6 : 4);
      }
    });
  };
}

(async () => {
  try {
    const { address } = await dns.promises.lookup("api.themoviedb.org");
    if (address === "127.0.0.1" || address === "::1") {
      installTmdbDnsOverride();
      console.warn(
        `⚠️  DNS этой машины блокирует TMDB (api.themoviedb.org → ${address}). Включён обход через публичный DNS 1.1.1.1 только для доменов TMDB в этом процессе.`
      );
    }
  } catch {}
})();

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

app.get("/api/user/history", auth, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json(user.history);
});

// ---------------------------------------------------------
// 🖼️ ПРОКСИ КАРТИНОК TMDB (браузер машины с DNS-блокировкой
// не может грузить image.tmdb.org напрямую)
// ---------------------------------------------------------
app.get("/api/img/*", async (req, res) => {
  try {
    const response = await fetch(`https://image.tmdb.org/${req.params[0]}`, {
      headers: { "User-Agent": "Mozilla/5.0", Accept: "image/*" },
    });

    if (!response.ok) return res.status(response.status).end();

    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") || "image/jpeg"
    );
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(Buffer.from(await response.arrayBuffer()));
  } catch (err) {
    res.status(502).end();
  }
});

// ---------------------------------------------------------
// 🔥 ПРОКСИ ДЛЯ COLLAPS
// ---------------------------------------------------------
// Плеер-провайдеры (collaps/hdvb/kodik) не отвечают — вместо 500
// отдаём страницу-заглушку, чтобы плеер падал без ошибок в консоли
function playerUnavailable(res, provider) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(
    `<html><body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;background:#09090b;color:#a1a1aa;font-family:system-ui;text-align:center">` +
      `<div><div style="font-size:42px;margin-bottom:12px">📺</div>` +
      `<p>Плеер «${provider}» временно недоступен.<br/>Провайдер не отвечает.</p></div>` +
      `</body></html>`
  );
}

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

    if (!response.ok) return playerUnavailable(res, "Collaps");

    const html = await response.text();

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (err) {
    playerUnavailable(res, "Collaps");
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

    if (!response.ok) return playerUnavailable(res, "HDVB");

    const html = await response.text();

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (err) {
    playerUnavailable(res, "HDVB");
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

    if (!response.ok) return playerUnavailable(res, "Kodik");

    const html = await response.text();

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (err) {
    playerUnavailable(res, "Kodik");
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
