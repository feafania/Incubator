import { WithId } from "mongodb";
import { User } from "../../domain/user";
import { UserListPaginatedOutput } from "../output/user-list-paginated.output";
import { UserOutput } from "../output/user.output";

export function mapToUserListPaginatedOutput(
  users: WithId<User>[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): UserListPaginatedOutput {
  return {
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    totalCount: meta.totalCount,
    items: users.map(
      (user): UserOutput => ({
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
      }),
    ),
  };
}
