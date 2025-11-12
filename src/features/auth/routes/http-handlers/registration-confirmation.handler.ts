import { Request, Response } from "express";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import authService from "../../application/auth.service";
import { authQueryService } from "../../application/auth.query.service";
import { BadRequestError } from "../../../../core/errors/bad-request.error";
import { RegistrationConfirmationRequestPayload } from "../request-payloads/registration-confirmation-request.payload";

export async function registrationConfirmationHandler(
  req: Request<{}, {}, RegistrationConfirmationRequestPayload>,
  res: Response,
) {
  try {
    const { code } = req.body;
    const user = await authQueryService.getUserByRegistrationCode(code);
    if (!user)
      throw new BadRequestError("Confirmation code is incorrect", "code");

    if (
      user.emailConfirmation.expiresAt &&
      user.emailConfirmation.expiresAt <= new Date()
    ) {
      throw new BadRequestError("Confirmation code expired", "code");
    }

    if (user.emailConfirmation.isConfirmed)
      throw new BadRequestError(
        "Confirmation code has already been applied",
        "code",
      );

    await authService.confirmRegistrationCode({ id: user.id });
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  } catch (e) {
    errorsHandler(e, res);
  }
}
