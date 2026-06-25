import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";

  const apiKey = process.env.NEXT_PUBLIC_TMDB_KEY;

  const url = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=ru-RU&page=${page}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    return NextResponse.json({ results: data.results });
  } catch (error) {
    console.error("Ошибка API /api/tv/popular:", error);
    return NextResponse.json({ error: "Ошибка загрузки данных" }, { status: 500 });
  }
}
