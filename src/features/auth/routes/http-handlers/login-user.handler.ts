import { Request, Response } from "express";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import { LoginRequestPayload } from "../request-payloads/login-request.payload";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";
import { authQueryService } from "../../application/auth.query.service";
import { passwordHasher } from "../../../../core/infrastructure/crypto/password-hasher";

export async function loginUserHandler(
  req: Request<{}, {}, LoginRequestPayload>,
  res: Response,
) {
  try {
    const { loginOrEmail, password } = req.body;

    const user = await authQueryService.getUserByLoginOrEmail(loginOrEmail);
    if (!user) {
      return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
    }

    const isPasswordValid = await passwordHasher.checkPassword(
      password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
    }

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  } catch (e: unknown) {
    return errorsHandler(e, res);
  }
}
