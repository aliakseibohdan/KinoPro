"use client";

import { useEffect, useRef, useState } from "react";

// Зеркала yo.js: если основной домен недоступен, перебираем резервные
const SCRIPT_SOURCES = [
  "//yohoho.cc/yo.js",
  "//4h0y.github.io/yo.js",
  "//4h0y.gitlab.io/yo.js",
  "//4h0y.bitbucket.io/yo.js",
];

type YohohoPlayerProps = {
  title?: string;
  year?: string;
  kinopoiskId?: string;
};

export default function YohohoPlayer({
  title,
  year,
  kinopoiskId,
}: YohohoPlayerProps) {
  const holderRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const holder = holderRef.current;
    if (!holder || (!kinopoiskId && !title)) return;

    setFailed(false);
    holder.innerHTML = "";

    // yo.js при загрузке ищет #yohoho и вставляет в него свой iframe,
    // поэтому div и его содержимое живут вне React
    const target = document.createElement("div");
    target.id = "yohoho";
    if (kinopoiskId) {
      target.setAttribute("data-kinopoisk", kinopoiskId);
    } else {
      target.setAttribute(
        "data-title",
        year ? `${title} (${year})` : (title as string)
      );
    }
    holder.appendChild(target);

    // упавший <script> нельзя перезапустить сменой src — на каждое зеркало
    // создаём новый элемент
    let cancelled = false;
    let script: HTMLScriptElement | null = null;
    let sourceIndex = 0;

    const loadNext = () => {
      if (cancelled) return;
      script?.remove();
      if (sourceIndex >= SCRIPT_SOURCES.length) {
        script = null;
        setFailed(true);
        return;
      }
      script = document.createElement("script");
      script.onerror = loadNext;
      script.src = SCRIPT_SOURCES[sourceIndex++];
      document.body.appendChild(script);
    };

    loadNext();

    return () => {
      cancelled = true;
      if (script) script.onerror = null;
      script?.remove();
      holder.innerHTML = "";
    };
  }, [title, year, kinopoiskId]);

  if (!kinopoiskId && !title) return null;

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
      <div ref={holderRef} className="w-full h-full" />

      {failed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm text-gray-400">
          <i className="fa-solid fa-circle-exclamation text-2xl" aria-hidden="true"></i>
          Плеер недоступен. Попробуйте позже.
        </div>
      )}
    </div>
  );
}
