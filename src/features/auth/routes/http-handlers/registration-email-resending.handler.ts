import { Request, Response } from "express";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import authService from "../../application/auth.service";
import { authQueryService } from "../../application/auth.query.service";
import { RegistrationEmailResendingRequestPayload } from "../request-payloads/registration-email-resending-request.payload";
import { BadRequestError } from "../../../../core/errors/bad-request.error";

export async function registrationEmailResendingHandler(
  req: Request<{}, {}, RegistrationEmailResendingRequestPayload>,
  res: Response,
) {
  try {
    const { email } = req.body;
    const user = await authQueryService.getUserByEmail(email);
    if (!user) throw new BadRequestError("email is not registered", "email");

    if (user.emailConfirmation.isConfirmed)
      throw new BadRequestError("email is already confirmed", "email");

    await authService.resendEmail({ id: user.id });
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  } catch (e) {
    errorsHandler(e, res);
  }
}
