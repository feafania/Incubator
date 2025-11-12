import { Request, Response } from "express";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import { RegistrationRequestPayload } from "../request-payloads/registration-request.payload";
import authService from "../../application/auth.service";

export async function registrationHandler(
  req: Request<{}, {}, RegistrationRequestPayload>,
  res: Response,
) {
  try {
    await authService.registerUser(req.body);
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
