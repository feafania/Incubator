import { SortDirections } from "./sort-direction";

export interface QueryInput<T> {
  searchNameTerm?: string | null | undefined;
  sortBy: T;
  sortDirection: SortDirections;
  pageNumber: number;
  pageSize: number;
}

export type FindQueryResponse<T> = {
  items: T[];
  totalCount: number;
};
