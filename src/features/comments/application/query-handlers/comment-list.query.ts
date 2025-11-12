import { PaginationAndSorting } from "../../../../core/types/pagination-and-sorting";
import { CommentSortField } from "../../routes/request-payloads/comment-sort-field";

export type CommentListQuery = PaginationAndSorting<CommentSortField>;
