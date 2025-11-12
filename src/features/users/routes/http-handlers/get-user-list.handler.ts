import { Request, Response } from "express";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import { setDefaultSortAndPaginationIfNotExist } from "../../../../core/helpers/set-default-sort-and-pagination";
import { userQueryService } from "../../application/user.query.service";
import { UserListRequestPayload } from "../request-payloads/user-list-request.payload";

export async function getUserListHandler(
  req: Request<{}, {}, {}, UserListRequestPayload>,
  res: Response,
) {
  try {
    const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);
    const usersListOutput = await userQueryService.findMany(queryInput);
    res.send(usersListOutput); //200 па змоўчаньні і ў json фармаце для аб'екта
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
