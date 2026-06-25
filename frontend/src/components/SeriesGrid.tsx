"use client";

import { useEffect, useState } from "react";
import MediaCard from "@/components/MediaCard";
import Pagination from "@/components/Pagination";

export default function SeriesGrid() {
  const [series, setSeries] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API;

  const loadSeries = () => {
    setLoading(true);

    fetch(`${API}/api/tv/popular?page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("TV DATA:", data);

        if (data && Array.isArray(data.results)) {
          setSeries(data.results);
        } else {
          setSeries([]);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("FETCH ERROR:", err);
        setSeries([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadSeries();
  }, [page, API]);

  return (
    <div className="flex flex-col gap-6 overflow-x-hidden">
      {loading && (
        <div className="text-center opacity-70">Сериалы загружаются...</div>
      )}

      {!loading && series.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 p-4">
          {series.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <Pagination
        currentPage={page}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}
