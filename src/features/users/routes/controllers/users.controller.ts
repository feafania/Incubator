import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import { UsersService } from "../../application/users.service";
import { UserQueryService } from "../../application/user.query.service";
import { CreateUserRequestPayload } from "../request-payloads/create-user-request.payload";
import { UserListRequestPayload } from "../request-payloads/user-list-request.payload";
import { setDefaultSortAndPaginationIfNotExist } from "../../../../core/helpers/set-default-sort-and-pagination";

@injectable()
export class UsersController {
  constructor(
    @inject(UsersService) private usersService: UsersService,
    @inject(UserQueryService)
    private userQueryService: UserQueryService,
  ) {}

  async createUserHandler(
    req: Request<{}, {}, CreateUserRequestPayload>,
    res: Response,
  ) {
    try {
      const createdUserId = await this.usersService.create(req.body, true);

      const userOutput =
        await this.userQueryService.findByIdOrFail(createdUserId);

      res.status(HTTP_STATUSES.CREATE_201).send(userOutput);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async deleteUserHandler(req: Request<{ id: string }>, res: Response) {
    try {
      const id = req.params.id;

      await this.usersService.delete(id);

      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async getUserListHandler(
    req: Request<{}, {}, {}, UserListRequestPayload>,
    res: Response,
  ) {
    try {
      const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);
      const usersListOutput = await this.userQueryService.findMany(queryInput);
      res.send(usersListOutput); //200 па змоўчаньні і ў json фармаце для аб'екта
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }
}
