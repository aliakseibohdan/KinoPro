import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Header from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext";

// Inter — основной текст, Manrope — заголовки (обе с полной кириллицей)
const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

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
    <html lang="ru" className={`${inter.variable} ${manrope.variable}`}>
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
