import { Request, Response } from "express";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import authService from "../../application/auth.service";
import { authQueryService } from "../../application/auth.query.service";
import { PasswordRecoveryRequestPayload } from "../request-payloads/password-recovery-request.payload";

export async function passwordRecoveryHandler(
  req: Request<{}, {}, PasswordRecoveryRequestPayload>,
  res: Response,
) {
  try {
    const { email } = req.body;
    const user = await authQueryService.getUserByEmail(email);
    if (user) {
      await authService.sendPasswordRecoveryEmail({ id: user.id });
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  } catch (e) {
    errorsHandler(e, res);
  }
}
