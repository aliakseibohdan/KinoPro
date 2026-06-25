"use client";

type PaginationProps = {
  currentPage: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, onPageChange }: PaginationProps) {
  const totalPages = 500;
  const windowSize = 10;

  let startPage = currentPage - Math.floor(windowSize / 2);
  let endPage = currentPage + Math.floor(windowSize / 2);

  if (startPage < 1) {
    endPage += 1 - startPage;
    startPage = 1;
  }

  if (endPage > totalPages) {
    startPage -= endPage - totalPages;
    endPage = totalPages;
  }

  if (startPage < 1) startPage = 1;

  // ⭐ Исправление: типизируем массив
  const pages: number[] = [];

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="w-full flex justify-center items-center gap-1 mt-4 -ml-20">
      {/* Раньше */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-2 py-1 text-sm bg-[#222] text-white rounded hover:bg-[#333] disabled:opacity-40"
      >
        Раньше
      </button>

      {/* Страницы */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-2 py-1 text-sm rounded ${
            page === currentPage
              ? "bg-red-600 text-white"
              : "bg-[#222] text-gray-300 hover:bg-[#333]"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Позже */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-2 py-1 text-sm bg-[#222] text-white rounded hover:bg-[#333] disabled:opacity-40"
      >
        Позже
      </button>
    </div>
  );
}
