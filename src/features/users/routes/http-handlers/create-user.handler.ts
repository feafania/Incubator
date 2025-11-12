import { Request, Response } from "express";
import { CreateUserRequestPayload } from "../request-payloads/create-user-request.payload";
import usersService from "../../application/users.service";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import { userQueryService } from "../../application/user.query.service";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserRequestPayload>,
  res: Response,
) {
  try {
    const createdUserId = await usersService.create(req.body, true);

    const userOutput = await userQueryService.findByIdOrFail(createdUserId);

    res.status(HTTP_STATUSES.CREATE_201).send(userOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
