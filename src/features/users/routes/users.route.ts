import { Router } from "express";
import { adminGuardMiddleware } from "../../../auth/middlewares/admin-guard.middleware";
import { paginationAndSortingValidation } from "../../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import { UserSortField } from "./request-payloads/user-sort-field";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validtion-result.middleware";
import { createUserRequestPayloadValidation } from "./user-request.payload.validation-middlewares";
import { idValidation } from "../../../core/middlewares/validation/params-id.validation-middleware";
import { createUserHandler } from "./http-handlers/create-user.handler";
import { deleteUserHandler } from "./http-handlers/delete-user.handler";
import { getUserListHandler } from "./http-handlers/get-user-list.handler";

export const usersRouter = Router({});

//middleware на весь маршрут
usersRouter.use(adminGuardMiddleware);

usersRouter
  .get(
    "",
    paginationAndSortingValidation(Object.values(UserSortField)),
    inputValidationResultMiddleware,
    getUserListHandler,
  )

  .post(
    "",
    createUserRequestPayloadValidation,
    inputValidationResultMiddleware,
    createUserHandler,
  )

  .delete(
    "/:id",
    idValidation,
    inputValidationResultMiddleware,
    deleteUserHandler,
  );
