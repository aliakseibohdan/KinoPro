import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "KinoPro - Смотрите фильмы онлайн",
  description: "Лучший сервис для просмотра фильмов и сериалов",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-slate-950 text-white">

        {/* 🔥 Оборачиваем ВСЁ приложение в AuthProvider */}
        <AuthProvider>

          {/* 🔥 Прозрачная шапка поверх контента */}
          <Header />

          {/* 🔥 Контент начинается ниже шапки */}
          <main className="pt-[90px]">
            {children}
          </main>

        </AuthProvider>

      </body>
    </html>
  );
}
