import { PaginationAndSorting } from "../../../../core/types/pagination-and-sorting";
import { PostSortField } from "../../routes/request-payloads/post-sort-field";

export type PostListQuery = PaginationAndSorting<PostSortField> & {
  searchNameTerm: string;
};
