import { PaginatedOutputWithItems } from "../../../../core/types/paginated.output";
import { CommentOutput } from "./comment.output";

export type CommentListPaginatedOutput =
  PaginatedOutputWithItems<CommentOutput>;
