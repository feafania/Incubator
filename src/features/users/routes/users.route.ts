import { Router } from "express";
import { adminGuardMiddleware } from "../../../auth/middlewares/admin-guard.middleware";
import { paginationAndSortingValidation } from "../../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import { UserSortField } from "./request-payloads/user-sort-field";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { createUserRequestPayloadValidation } from "./user-request.payload.validation-middlewares";
import { idValidation } from "../../../core/middlewares/validation/params-id.validation-middleware";
import { container } from "../../../composition-root";
import { UsersController } from "./controllers/users.controller";

export const usersRouter = Router({});

const usersController = container.get<UsersController>(UsersController);

//middleware на весь маршрут
usersRouter.use(adminGuardMiddleware);

usersRouter
  .get(
    "",
    paginationAndSortingValidation(Object.values(UserSortField)),
    inputValidationResultMiddleware,
    usersController.getUserListHandler.bind(usersController),
  )

  .post(
    "",
    createUserRequestPayloadValidation,
    inputValidationResultMiddleware,
    usersController.createUserHandler.bind(usersController),
  )

  .delete(
    "/:id",
    idValidation,
    inputValidationResultMiddleware,
    usersController.deleteUserHandler.bind(usersController),
  );
