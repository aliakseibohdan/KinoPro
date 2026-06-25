const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// 🔥 РЕГИСТРАЦИЯ (MongoDB)
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Введите email и пароль" });

    // Проверяем, есть ли пользователь
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email уже используется" });

    // Хэшируем пароль
    const hash = await bcrypt.hash(password, 10);

    // Создаём пользователя
    const user = await User.create({
      email,
      password: hash,
      favorites: [],
      history: [],
    });

    // Создаём JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Сохраняем токен в httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // если будет https — поставить true
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Регистрация успешна",
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;
