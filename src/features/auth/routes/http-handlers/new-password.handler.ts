import { Request, Response } from "express";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import authService from "../../application/auth.service";
import { authQueryService } from "../../application/auth.query.service";
import { BadRequestError } from "../../../../core/errors/bad-request.error";
import { NewPasswordRequestPayload } from "../request-payloads/new-password-request.payload";

export async function newPasswordHandler(
  req: Request<{}, {}, NewPasswordRequestPayload>,
  res: Response,
) {
  try {
    const { recoveryCode, newPassword } = req.body;
    const user =
      await authQueryService.getUserByPasswordRecoveryCode(recoveryCode);
    if (!user)
      throw new BadRequestError("Recovery code is incorrect", "recoveryCode");

    if (
      user.passwordRecovery.expiresAt &&
      user.passwordRecovery.expiresAt <= new Date()
    ) {
      throw new BadRequestError("Recovery code expired", "recoveryCode");
    }

    await authService.updatePassword({ id: user.id, password: newPassword });
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  } catch (e) {
    errorsHandler(e, res);
  }
}
