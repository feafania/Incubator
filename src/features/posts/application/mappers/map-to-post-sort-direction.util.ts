import { SortDirections } from "../../../../core/types/sort-direction";

export function mapPostSortDirection(direction: SortDirections): 1 | -1 {
  return direction === SortDirections.Asc ? 1 : -1;
}
