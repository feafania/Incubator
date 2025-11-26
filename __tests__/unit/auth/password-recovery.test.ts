import { RepositoryNotFoundError } from "../../../src/core/errors/repository-not-found.error";
import { AuthService } from "../../../src/features/auth/application/auth.service";
import { ResendEmailCommand } from "../../../src/features/auth/application/command-handlers/resend-email-commands";
import { UpdatePasswordCommand } from "../../../src/features/auth/application/command-handlers/update-password-commands";
import { usersRepositoryMock } from "../../__mocks__/users.repository.mock";
import { usersServiceMock } from "../../__mocks__/users.service.mock";

jest.mock("../../../src/core/infrastructure/mailer/nodemailer.service", () => {
  return {
    nodemailerService: {
      sendEmail: jest.fn(),
    },
  };
});
import { nodemailerService } from "../../../src/core/infrastructure/mailer/nodemailer.service";
import { BadRequestError } from "../../../src/core/errors/bad-request.error";

describe("AuthService — password recovery", () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    authService["usersService"] = usersServiceMock;
    authService["usersRepository"] = usersRepositoryMock;

    jest.clearAllMocks();
    (nodemailerService.sendEmail as jest.Mock).mockResolvedValue(true);
  });

  // -------------------------------------------------------------------
  // sendPasswordRecoveryEmail
  // -------------------------------------------------------------------

  describe("sendPasswordRecoveryEmail", () => {
    it("should set new recoveryCode and send email", async () => {
      const fakeUser = {
        _id: "user-1",
        email: "test@example.com",
        passwordRecovery: {
          recoveryCode: "old",
          expiresAt: new Date(),
        },
      };

      usersRepositoryMock.findByIdOrFail.mockResolvedValue(fakeUser as any);
      usersRepositoryMock.save.mockResolvedValue(fakeUser as any);

      await authService.sendPasswordRecoveryEmail({
        id: fakeUser._id,
      } as ResendEmailCommand);

      expect(fakeUser.passwordRecovery.recoveryCode).not.toBe("old");
      expect(usersRepositoryMock.save).toHaveBeenCalledWith(fakeUser);

      expect(nodemailerService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          email: fakeUser.email,
          code: fakeUser.passwordRecovery.recoveryCode,
        }),
      );
    });

    it("should create passwordRecovery field if not exists", async () => {
      const fakeUser: any = {
        _id: "user-2",
        email: "test2@example.com",
        passwordRecovery: null,
      };

      usersRepositoryMock.findByIdOrFail.mockResolvedValue(fakeUser as any);
      usersRepositoryMock.save.mockResolvedValue(fakeUser as any);

      await authService.sendPasswordRecoveryEmail({
        id: fakeUser._id,
      } as ResendEmailCommand);

      expect(fakeUser.passwordRecovery).toBeDefined();

      expect(fakeUser.passwordRecovery.recoveryCode).toBeDefined();
      expect(nodemailerService.sendEmail).toHaveBeenCalled();
    });

    it("should throw RepositoryNotFoundError if user not found", async () => {
      usersRepositoryMock.findByIdOrFail.mockRejectedValue(
        new RepositoryNotFoundError("no user"),
      );

      await expect(
        authService.sendPasswordRecoveryEmail({
          id: "unknown",
        } as ResendEmailCommand),
      ).rejects.toThrow(RepositoryNotFoundError);
    });
  });

  // -------------------------------------------------------------------
  // updatePassword
  // -------------------------------------------------------------------

  describe("updatePassword", () => {
    it("should update password and reset recoveryCode", async () => {
      const fakeUser = {
        _id: "user-3",
        passwordHash: "old-hash",
        passwordRecovery: {
          recoveryCode: "some-code",
          expiresAt: new Date(),
        },
      };

      usersRepositoryMock.findByIdOrFail.mockResolvedValue(fakeUser as any);
      usersRepositoryMock.save.mockResolvedValue(fakeUser as any);

      const command: UpdatePasswordCommand = {
        id: fakeUser._id,
        password: "new-password",
      };

      await authService.updatePassword(command);

      expect(fakeUser.passwordHash).not.toBe("old-hash");
      expect(fakeUser.passwordRecovery.recoveryCode).toBe("");

      expect(usersRepositoryMock.save).toHaveBeenCalledWith(fakeUser);
    });

    it("should throw BadRequestError if user not found", async () => {
      usersRepositoryMock.findByIdOrFail.mockRejectedValue(
        new BadRequestError("User not found", "code"),
      );

      await expect(
        authService.updatePassword({
          id: "invalid",
          password: "newpass",
        } as UpdatePasswordCommand),
      ).rejects.toThrow(BadRequestError);
    });
  });
});
