import { PaginationAndSorting } from "../../../../core/types/pagination-and-sorting";
import { UserSortField } from "../../routes/request-payloads/user-sort-field";

export type UserListQuery = PaginationAndSorting<UserSortField> &
  Partial<{
    searchLoginTerm: string;
    searchEmailTerm: string;
  }>;
