export function formattedDate(timestamp: number): String {
  const date = new Date(timestamp);

  const day = date.getDate().toString().padStart(2, "0"); // дзень з 2 лічбамі
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // месяц з 2 лічбамі (месяцы нумаруюцца з 0)
  const year = date.getFullYear(); // год
  const hours = date.getHours().toString().padStart(2, "0"); // гадзіны
  const minutes = date.getMinutes().toString().padStart(2, "0"); // хвіліны
  const seconds = date.getSeconds().toString().padStart(2, "0"); // секунды

  // dd/mm/yyyy hh:mm:ss
  return `${day}/${month}/${year} at ${hours}:${minutes}:${seconds}`;
}
