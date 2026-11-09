// Небольшие функции, которые нужны сразу нескольким страницам кабинета.

// "2026-11-10" -> "10 ноября"
export function formatDate(isoDate) {
  if (!isoDate) return "без срока";
  return new Date(isoDate + "T00:00:00").toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
}

// Превращает обычную ссылку на видео в ссылку для вставки на страницу
export function toEmbedUrl(url) {
  if (!url) return null;
  const youtube = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`;
  const rutube = url.match(/rutube\.ru\/video\/(\w+)/);
  if (rutube) return `https://rutube.ru/play/embed/${rutube[1]}`;
  return url; // считаем, что это уже ссылка для вставки
}
