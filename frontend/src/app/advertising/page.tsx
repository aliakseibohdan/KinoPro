"use client";

import { useState } from "react";

export default function AdvertisingPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Ваше сообщение отправлено отделу рекламы KinoPro!");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-xl p-8 shadow-xl">

        {/* Заголовок */}
        <h1 className="text-3xl font-bold text-center text-white">
          <i className="fa-solid fa-briefcase mr-2" aria-hidden="true"></i>
          Рекламодателям
        </h1>

        {/* 🔥 Почта — маленький шрифт */}
        <p className="text-center text-[20px] opacity-50 mb-6">
          Наша почта: administration_kinopro@proton.me
        </p>

        <p className="text-center text-sm opacity-70 mb-8">
          Здесь вы можете связаться с отделом рекламы KinoPro — предложить сотрудничество, разместить рекламу или задать вопрос. Ответ в течение 24 часа.
        </p>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm opacity-80">Ваше имя:</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm opacity-80">Ваш E‑Mail:</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm opacity-80">Тема:</label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-500"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm opacity-80">Сообщение:</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white resize-none focus:outline-none focus:border-pink-500"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Отправить сообщение
          </button>
        </form>
      </div>
    </div>
  );
}
