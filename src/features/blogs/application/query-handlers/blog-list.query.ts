import { PaginationAndSorting } from "../../../../core/types/pagination-and-sorting";
import { BlogSortField } from "../../routes/request-payloads/blog-sort-field";

export type BlogListQuery = PaginationAndSorting<BlogSortField> & {
  searchNameTerm: string;
};
