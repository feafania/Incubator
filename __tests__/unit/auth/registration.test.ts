import { RepositoryNotFoundError } from "../../../src/core/errors/repository-not-found.error";

jest.mock("../../../src/core/infrastructure/mailer/nodemailer.service", () => {
  return {
    nodemailerService: {
      sendEmail: jest.fn(),
    },
  };
});

import { nodemailerService } from "../../../src/core/infrastructure/mailer/nodemailer.service";
import { AuthService } from "../../../src/features/auth/application/auth.service";
import { RegisterUserCommand } from "../../../src/features/auth/application/command-handlers/registration-commands";
import { ConfirmRegistrationCommand } from "../../../src/features/auth/application/command-handlers/registration-confirmation-commands";
import { ResendEmailCommand } from "../../../src/features/auth/application/command-handlers/resend-email-commands";
import { usersRepositoryMock } from "../../__mocks__/users.repository.mock";
import { usersServiceMock } from "../../__mocks__/users.service.mock";
import { container } from "../../../src/composition-root";

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(() => {
    // Створым AuthService і падменім рэальныя сэрвісы на моки
    authService = container.get<AuthService>(AuthService);
    authService["usersService"] = usersServiceMock;
    authService["usersRepository"] = usersRepositoryMock;

    jest.clearAllMocks();

    (nodemailerService.sendEmail as jest.Mock).mockResolvedValue(true);
  });

  describe("registerUser", () => {
    it("should create user and send registration email", async () => {
      const command: RegisterUserCommand = {
        login: "testuser",
        password: "123",
        email: "test@example.com",
      };

      usersServiceMock.create.mockResolvedValue("user-id-1");

      const fakeUser = {
        _id: "user-id-1",
        email: "test@example.com",
        emailConfirmation: { confirmationCode: "code-123", isConfirmed: false },
      };

      usersRepositoryMock.findByIdOrFail.mockResolvedValue(fakeUser as any);

      await authService.registerUser(command);

      expect(usersServiceMock.create).toHaveBeenCalledWith({
        login: "testuser",
        password: "123",
        email: "test@example.com",
      });

      expect(usersRepositoryMock.findByIdOrFail).toHaveBeenCalledWith(
        "user-id-1",
      );

      expect(nodemailerService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({ code: "code-123" }),
      );
    });
  });

  describe("resendEmail", () => {
    it("should throw RepositoryNotFoundError if user not found", async () => {
      usersRepositoryMock.findByIdOrFail.mockRejectedValue(
        new RepositoryNotFoundError("User not exist"),
      );

      await expect(
        authService.resendEmail({ id: "invalid-id" } as ResendEmailCommand),
      ).rejects.toThrow(RepositoryNotFoundError);
    });

    it("should update confirmation code and send email", async () => {
      const fakeUser = {
        _id: "user-id-2",
        email: "test2@example.com",
        emailConfirmation: { confirmationCode: "old-code", isConfirmed: false },
      };

      usersRepositoryMock.findByIdOrFail.mockResolvedValue(fakeUser as any);
      usersRepositoryMock.save.mockResolvedValue(fakeUser as any);

      await authService.resendEmail({ id: "user-id-2" } as ResendEmailCommand);

      expect(fakeUser.emailConfirmation.confirmationCode).not.toBe("old-code");
      expect(nodemailerService.sendEmail).toHaveBeenCalled();
    });
  });

  describe("confirmRegistrationCode", () => {
    it("should confirm user's email", async () => {
      const command: ConfirmRegistrationCommand = { id: "user-id-1" };
      const fakeUser = {
        _id: "user-id-1",
        emailConfirmation: { confirmationCode: "code-123", isConfirmed: false },
      };

      usersRepositoryMock.findByIdOrFail.mockResolvedValue(fakeUser as any);
      usersRepositoryMock.save.mockResolvedValue(fakeUser as any);

      await authService.confirmRegistrationCode(command);

      expect(fakeUser.emailConfirmation.isConfirmed).toBe(true);
      expect(usersRepositoryMock.save).toHaveBeenCalledWith(fakeUser);
    });
  });
});
