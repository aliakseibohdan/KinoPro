export default function NavigationPanel() {
  const genres = [
    "Боевики", "Комедии", "Драмы", "Ужасы", "Фантастика", "Мелодрамы"
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Жанры</h2>
      <ul className="space-y-1">
        {genres.map((genre) => (
          <li key={genre} className="hover:text-pink-500 cursor-pointer">
            {genre}
          </li>
        ))}
      </ul>
    </div>
  );
}
