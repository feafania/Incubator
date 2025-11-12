type PaginationBase = {
  page: number;
  pageSize: number;
  totalCount: number;
  pagesCount: number;
};

export type PaginatedOutput = PaginationBase;

export type PaginatedOutputWithItems<T> = PaginationBase & {
  items: T[];
};
