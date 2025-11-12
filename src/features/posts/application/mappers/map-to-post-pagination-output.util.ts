import { PaginatedOutputWithItems } from "../../../../core/types/paginated.output";

export function mapToPostPaginatedOutput<T>(
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
