import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { HTTP_STATUSES } from "../../../../core/types/http-statuses";
import { errorsHandler } from "../../../../core/errors/errors.handler";
import { LoginRequestPayload } from "../request-payloads/login-request.payload";
import { AuthQueryService } from "../../application/auth.query.service";
import { passwordHasher } from "../../../../core/infrastructure/crypto/password-hasher";
import { AuthService } from "../../application/auth.service";
import { SETTINGS } from "../../../../core/settings/settings";
import { SessionService } from "../../application/session.service";
import { NewPasswordRequestPayload } from "../request-payloads/new-password-request.payload";
import { BadRequestError } from "../../../../core/errors/bad-request.error";
import { PasswordRecoveryRequestPayload } from "../request-payloads/password-recovery-request.payload";
import { RegistrationRequestPayload } from "../request-payloads/registration-request.payload";
import { RegistrationConfirmationRequestPayload } from "../request-payloads/registration-confirmation-request.payload";
import { RegistrationEmailResendingRequestPayload } from "../request-payloads/registration-email-resending-request.payload";

@injectable()
export class AuthController {
  constructor(
    @inject(AuthService) private authService: AuthService,
    @inject(AuthQueryService)
    private authQueryService: AuthQueryService,
    @inject(SessionService)
    private sessionService: SessionService,
  ) {}

  async loginUserHandler(
    req: Request<{}, {}, LoginRequestPayload>,
    res: Response,
  ) {
    try {
      const { loginOrEmail, password } = req.body;
      const user =
        await this.authQueryService.getUserByLoginOrEmail(loginOrEmail);
      if (!user) {
        return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
      }
      if (!user.emailConfirmation.isConfirmed) {
        return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
      }

      const isPasswordValid = await passwordHasher.checkPassword(
        password,
        user.passwordHash,
      );
      if (!isPasswordValid) {
        return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
      }

      const { accessToken, refreshToken } = await this.authService.login(
        user.id,
        req,
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: parseInt(String(SETTINGS.JWT_REFRESH_EXPIRY_PERIOD)) * 1000,
      });

      return res.status(HTTP_STATUSES.OK_200).json({
        accessToken: accessToken,
      });
    } catch (e: unknown) {
      return errorsHandler(e, res);
    }
  }

  async logoutHandler(req: Request, res: Response) {
    try {
      const userId = req.userId!;
      const expiresAt = req.expiresAt!;
      const deviceId = req.deviceId!;
      const oldRefreshToken = req.cookies.refreshToken;

      await this.authService.revokeToken(oldRefreshToken, {
        userId,
        deviceId,
        expiresAt,
      });
      const session = await this.sessionService.findExistingSession(
        userId,
        deviceId,
      );
      if (session?._id) {
        await this.sessionService.delete(session._id.toString());
      }

      return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } catch (e: unknown) {
      return errorsHandler(e, res);
    }
  }

  async meUserHandler(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;

      if (!userId) {
        res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
        return;
      }

      const user = await this.authQueryService.findByIdOrFail(userId);

      if (!user) {
        res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401);
        return;
      }

      res.status(HTTP_STATUSES.OK_200).json(user);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async newPasswordHandler(
    req: Request<{}, {}, NewPasswordRequestPayload>,
    res: Response,
  ) {
    try {
      const { recoveryCode, newPassword } = req.body;
      const user =
        await this.authQueryService.getUserByPasswordRecoveryCode(recoveryCode);
      if (!user)
        throw new BadRequestError("Recovery code is incorrect", "recoveryCode");

      if (
        user.passwordRecovery.expiresAt &&
        user.passwordRecovery.expiresAt <= new Date()
      ) {
        throw new BadRequestError("Recovery code expired", "recoveryCode");
      }

      await this.authService.updatePassword({
        id: user.id,
        password: newPassword,
      });
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } catch (e) {
      errorsHandler(e, res);
    }
  }

  async passwordRecoveryHandler(
    req: Request<{}, {}, PasswordRecoveryRequestPayload>,
    res: Response,
  ) {
    try {
      const { email } = req.body;
      const user = await this.authQueryService.getUserByEmail(email);
      if (user) {
        await this.authService.sendPasswordRecoveryEmail({ id: user.id });
      }

      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } catch (e) {
      errorsHandler(e, res);
    }
  }

  async refreshTokenHandler(req: Request, res: Response) {
    try {
      const userId = req.userId!;
      const expiresAt = req.expiresAt!;
      const deviceId = req.deviceId;
      const oldRefreshToken = req.cookies.refreshToken;

      await this.authService.revokeToken(oldRefreshToken, {
        userId,
        deviceId,
        expiresAt,
      });

      const { accessToken, refreshToken } =
        await this.authService.refreshSession(userId!, deviceId!, req);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: parseInt(String(SETTINGS.JWT_REFRESH_EXPIRY_PERIOD)) * 1000,
      });

      return res.status(HTTP_STATUSES.OK_200).json({
        accessToken: accessToken,
      });
    } catch (e: unknown) {
      return errorsHandler(e, res);
    }
  }

  async registrationHandler(
    req: Request<{}, {}, RegistrationRequestPayload>,
    res: Response,
  ) {
    try {
      await this.authService.registerUser(req.body);
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async registrationConfirmationHandler(
    req: Request<{}, {}, RegistrationConfirmationRequestPayload>,
    res: Response,
  ) {
    try {
      const { code } = req.body;
      const user = await this.authQueryService.getUserByRegistrationCode(code);
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

      await this.authService.confirmRegistrationCode({ id: user.id });
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } catch (e) {
      errorsHandler(e, res);
    }
  }

  async registrationEmailResendingHandler(
    req: Request<{}, {}, RegistrationEmailResendingRequestPayload>,
    res: Response,
  ) {
    try {
      const { email } = req.body;
      const user = await this.authQueryService.getUserByEmail(email);
      if (!user) throw new BadRequestError("email is not registered", "email");

      if (user.emailConfirmation.isConfirmed)
        throw new BadRequestError("email is already confirmed", "email");

      await this.authService.resendEmail({ id: user.id });
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } catch (e) {
      errorsHandler(e, res);
    }
  }
}
