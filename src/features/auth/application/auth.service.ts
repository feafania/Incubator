import { RegisterUserCommand } from "./command-handlers/registration-commands";
import { UsersRepository } from "../../users/repositories/users.repository";
import { nodemailerService } from "../../../core/infrastructure/mailer/nodemailer.service";
import { emailTemplates } from "../../../core/infrastructure/mailer/email-templates";
import { emailSubjects } from "../../../core/infrastructure/mailer/email-subjects";
import { UsersService } from "../../users/application/users.service";
import { ResendEmailCommand } from "./command-handlers/resend-email-commands";
import { ConfirmRegistrationCommand } from "./command-handlers/registration-confirmation-commands";
import { BadRequestError } from "../../../core/errors/bad-request.error";
import { randomUUID } from "node:crypto";
import { jwtService } from "../../../core/infrastructure/token/jwt";
import { SETTINGS } from "../../../core/settings/settings";
import { JwtConfig, JwtPayload } from "../../../core/types/jwt-token";
import { TokenType } from "../domain/token-type";
import { AuthRepository } from "../repositories/auth.repository";
import { RevokedTokenDomainDto } from "../domain/revoked-token-domain.dto";
import { tokenHasher } from "../../../core/infrastructure/crypto/token-hasher";
import { SessionService } from "./session.service";
import { RequestWithBody } from "../../../core/types/request";
import extractDeviceInfo from "../../../core/helpers/extract-device-info";
import { SessionRepository } from "../repositories/session.repository";
import { UpdateSessionCommand } from "./command-handlers/session-commands";
import { truncateDateToSeconds } from "../../../core/helpers/truncate-date-to-seconds";
import { addHours, addMinutes } from "date-fns";
import { UpdatePasswordCommand } from "./command-handlers/update-password-commands";
import { passwordHasher } from "../../../core/infrastructure/crypto/password-hasher";
import { inject } from "inversify";

export class AuthService {
  constructor(
    @inject(UsersService) private usersService: UsersService,
    @inject(UsersRepository) private usersRepository: UsersRepository,
    @inject(AuthRepository) private authRepository: AuthRepository,
    @inject(SessionRepository) private sessionRepository: SessionRepository,
    @inject(SessionService) private sessionService: SessionService,
  ) {}

  generateToken(payload: JwtPayload, tokenType: TokenType = TokenType.ACCESS) {
    return jwtService.createToken(payload, this.getTokenConfig(tokenType));
  }

  async registerUser(command: RegisterUserCommand): Promise<void> {
    const { login, password, email } = command;

    const userId = await this.usersService.create({ login, password, email });
    if (!userId) throw new Error("Error creating user");
    const newUser = await this.usersRepository.findByIdOrFail(userId);

    const registrationEmail = {
      email: newUser.email,
      template: emailTemplates.registrationEmail,
      code: newUser.emailConfirmation.confirmationCode,
      subject: emailSubjects.registration,
    };
    // setImmediate(async () => {
    try {
      await nodemailerService.sendEmail(registrationEmail);
    } catch (error) {
      console.error("Error sending email:", error);
      await this.usersRepository.delete(userId);
    }
    // });
  }

  async resendEmail(command: ResendEmailCommand): Promise<void> {
    const { id: userId } = command;

    const user = await this.usersRepository.findByIdOrFail(userId);
    if (!user) throw new BadRequestError("User not found", "email");
    user.emailConfirmation.confirmationCode = randomUUID();
    user.emailConfirmation.expiresAt = addHours(
      new Date(),
      SETTINGS.REGISTRATION_CODE_LIFE,
    );

    await this.usersRepository.save(user);

    const resendingEmailConfirmation = {
      email: user.email,
      template: emailTemplates.registrationEmail,
      code: user.emailConfirmation.confirmationCode,
      subject: emailSubjects.registration,
    };
    // setImmediate(async () => {
    try {
      await nodemailerService.sendEmail(resendingEmailConfirmation);
    } catch (error) {
      console.error("Error resending email:", error);
    }
    // });
  }

  async confirmRegistrationCode(
    command: ConfirmRegistrationCommand,
  ): Promise<void> {
    const { id: userId } = command;

    const user = await this.usersRepository.findByIdOrFail(userId);
    if (!user) throw new BadRequestError("User not found", "code");
    user.emailConfirmation = {
      ...user.emailConfirmation,
      isConfirmed: true,
    };

    await this.usersRepository.save(user);
  }

  async sendPasswordRecoveryEmail(command: ResendEmailCommand): Promise<void> {
    const { id: userId } = command;

    const user = await this.usersRepository.findByIdOrFail(userId);

    if (!user.passwordRecovery) {
      user.passwordRecovery = {
        recoveryCode: "",
        expiresAt: new Date(),
      };
    }

    user.passwordRecovery.recoveryCode = randomUUID();
    user.passwordRecovery.expiresAt = addMinutes(
      new Date(),
      SETTINGS.PASSWORD_CODE_LIFE,
    );
    await this.usersRepository.save(user);

    const recoveryPasswordEmail = {
      email: user.email,
      template: emailTemplates.passwordRecoveryEmail,
      code: user.passwordRecovery.recoveryCode,
      subject: emailSubjects.recoveryPassword,
    };
    // setImmediate(async () => {
    try {
      await nodemailerService.sendEmail(recoveryPasswordEmail);
    } catch (error) {
      console.error("Error resending email:", error);
    }
    // });
  }

  async updatePassword(command: UpdatePasswordCommand): Promise<void> {
    const { id: userId } = command;

    const user = await this.usersRepository.findByIdOrFail(userId);
    if (!user) throw new BadRequestError("User not found", "code");
    user.passwordHash = await passwordHasher.generateHash(command.password);
    user.passwordRecovery.recoveryCode = "";

    await this.usersRepository.save(user);
  }

  async login(
    userId: string,
    req: RequestWithBody<any>,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const refreshTokenConfig = this.getTokenConfig(TokenType.REFRESH);
    let deviceId: string | null = "";

    if (req.cookies?.refreshToken) {
      const token = req.cookies.refreshToken;
      const payload = jwtService.verifyToken(token, refreshTokenConfig);
      if (payload && payload.userId && payload.expiresAt) {
        if (userId === payload.userId) {
          deviceId = payload.deviceId ?? null;
          await this.revokeToken(token, {
            userId,
            deviceId,
            expiresAt: payload.expiresAt,
          });
        }
      }
    }

    // 1. Device info
    const { deviceId: newDeviceId, deviceName, ip } = extractDeviceInfo(req);
    deviceId = deviceId ? deviceId : newDeviceId;

    // 2. Tokens
    const accessToken = this.generateToken({ userId });
    const refreshToken = this.generateToken(
      { userId, deviceId },
      TokenType.REFRESH,
    );

    // 3. Decode refresh payload
    const payload = jwtService.verifyToken(refreshToken, refreshTokenConfig);
    if (!payload) throw new Error("Invalid refresh token");

    const existing = await this.sessionService.findExistingSession(
      userId,
      deviceId,
    );

    if (existing) {
      // 3. Абнавіць issuedAt

      await this.sessionService.update({
        deviceId: existing.deviceId,
        issuedAt: payload.issuedAt ?? truncateDateToSeconds(),
        deviceName,
        ip,
        expiresAt: payload.expiresAt ?? new Date(),
      });
    } else {
      // 4. Create session
      await this.sessionService.create({
        userId,
        deviceId,
        deviceName,
        ip,
        issuedAt: payload.issuedAt ?? truncateDateToSeconds(),
        expiresAt: payload.expiresAt ?? new Date(),
      });
    }

    // 5. Return everything to handler
    return { accessToken, refreshToken };
  }

  async refreshSession(
    userId: string,
    deviceId: string,
    req: RequestWithBody<any>,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { ip, deviceName } = extractDeviceInfo(req);

    const accessToken = this.generateToken({ userId });
    const refreshToken = this.generateToken(
      { userId, deviceId },
      TokenType.REFRESH,
    );

    const payload = jwtService.verifyToken(
      refreshToken,
      this.getTokenConfig(TokenType.REFRESH),
    );
    if (!payload) throw new Error("Invalid refresh token");

    const existing = await this.sessionRepository.findByDeviceId(deviceId);
    if (existing) {
      existing.update({
        issuedAt: payload.issuedAt ?? truncateDateToSeconds(),
        ip,
        expiresAt: payload.expiresAt ?? new Date(),
      });

      const updateCommand: UpdateSessionCommand = {
        deviceId: existing.deviceId,
        deviceName,
        ip,
        issuedAt: payload.issuedAt ?? truncateDateToSeconds(),
        expiresAt: payload.expiresAt ?? new Date(),
      };

      await this.sessionService.update(updateCommand);
    } else {
      await this.sessionService.create({
        userId,
        deviceId,
        deviceName,
        ip,
        issuedAt: payload.issuedAt ?? truncateDateToSeconds(),
        expiresAt: payload.expiresAt ?? new Date(),
      });
    }

    return { accessToken, refreshToken };
  }

  async revokeToken(
    token: string,
    payload: Omit<RevokedTokenDomainDto, "tokenHash">,
  ): Promise<void> {
    if (!token) throw new BadRequestError("Token not found", "refreshToken");
    const userId = payload.userId;
    const user = await this.usersRepository.findByIdOrFail(userId);
    if (!user) throw new BadRequestError("User not found", "userId");

    const deviceId = payload.deviceId;
    if (!deviceId) throw new BadRequestError("Wrong tpken", "deviceId");

    const hash = tokenHasher.generateHash(token);
    const revokedToken: RevokedTokenDomainDto = {
      tokenHash: hash,
      userId,
      deviceId,
      expiresAt: payload.expiresAt,
    };
    await this.authRepository.addRevokedToken(revokedToken);
  }

  async isRefreshTokenRevoked(refreshToken: string) {
    return this.authRepository.isTokenRevoked(refreshToken);
  }

  async deleteMany(): Promise<void> {
    await this.authRepository.deleteMany();
  }

  private getTokenConfig(tokenType: TokenType = TokenType.ACCESS): JwtConfig {
    const configOptions: JwtConfig = {};
    switch (tokenType) {
      case TokenType.REFRESH: {
        configOptions.expiresIn = SETTINGS.JWT_REFRESH_EXPIRY_PERIOD;
        configOptions.secret = SETTINGS.JWT_REFRESH_SECRET;
        break;
      }
      case TokenType.ACCESS:
      default: {
        configOptions.expiresIn = SETTINGS.JWT_ACCESS_EXPIRY_PERIOD;
        configOptions.secret = SETTINGS.JWT_ACCESS_SECRET;
      }
    }
    return configOptions;
  }
}
