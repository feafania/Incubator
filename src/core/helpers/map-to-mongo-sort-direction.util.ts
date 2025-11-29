import { SortDirections } from "../types/sort-direction";

export function mapToMongoSortDirection(direction: SortDirections): 1 | -1 {
  return direction === SortDirections.Asc ? 1 : -1;
}
