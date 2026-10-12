// Аватар хранится как CSS-класс Font Awesome ("fa-solid fa-user").
// Старые значения (эмодзи из localStorage) показываем как текст.
export default function AvatarIcon({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  if (value.startsWith("fa-")) {
    return <i className={`${value} ${className}`} aria-hidden="true" />;
  }
  return <span className={className}>{value}</span>;
}
