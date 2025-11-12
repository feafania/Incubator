// функция для быстрой очистки/заполнения базы данных для тестов
//T extends keyof DBType – гэта абмежаванне, якое кажа, што T павінен быць адным з ключоў тыпу DBType
import { SortDirections } from "./types/sort-direction";
import { PaginatedOutputWithItems } from "./types/paginated.output";

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

export function mapSortDirection(direction: SortDirections): 1 | -1 {
  return direction === SortDirections.Asc ? 1 : -1;
}

export function mapToPaginatedOutput<T>(
  items: T[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): PaginatedOutputWithItems<T> {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items: items,
  };
}
