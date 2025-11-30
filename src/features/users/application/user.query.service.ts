import { UserQueryRepository } from "../repositories/user.query.repository";
import { UserListRequestPayload } from "../routes/request-payloads/user-list-request.payload";
import { UserListPaginatedOutput } from "./output/user-list-paginated.output";
import { UserOutput } from "./output/user.output";
import { inject, injectable } from "inversify";

@injectable()
export class UserQueryService {
  constructor(
    @inject(UserQueryRepository)
    private userQueryRepository: UserQueryRepository,
  ) {}
  async findMany(
    queryDto: UserListRequestPayload,
  ): Promise<UserListPaginatedOutput> {
    return this.userQueryRepository.findMany(queryDto);
  }

  async findByIdOrFail(id: string): Promise<UserOutput> {
    return this.userQueryRepository.findByIdOrFail(id);
  }
}
