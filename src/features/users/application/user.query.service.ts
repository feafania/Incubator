import { UserQueryRepository } from "../repositories/user.query.repository";
import { UserListRequestPayload } from "../routes/request-payloads/user-list-request.payload";
import { UserListPaginatedOutput } from "./output/user-list-paginated.output";
import { UserOutput } from "./output/user.output";

class UserQueryService {
  private userQueryRepository: UserQueryRepository;
  constructor() {
    this.userQueryRepository = new UserQueryRepository();
  }
  async findMany(
    queryDto: UserListRequestPayload,
  ): Promise<UserListPaginatedOutput> {
    return this.userQueryRepository.findMany(queryDto);
  }

  async findByIdOrFail(id: string): Promise<UserOutput> {
    return this.userQueryRepository.findByIdOrFail(id);
  }
}

export const userQueryService = new UserQueryService();
