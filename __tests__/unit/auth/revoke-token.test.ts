import { AuthService } from "../../../src/features/auth/application/auth.service";
import { tokenHasher } from "../../../src/core/infrastructure/crypto/token-hasher";
import { BadRequestError } from "../../../src/core/errors/bad-request.error";
import { authRepositoryMock } from "../../__mocks__/auth.repository.mock";
import { usersRepositoryMock } from "../../__mocks__/users.repository.mock";
import { UsersRepository } from "../../../src/features/users/repositories/users.repository";
import { AuthRepository } from "../../../src/features/auth/repositories/auth.repository";
import { Container } from "inversify";
import { UsersService } from "../../../src/features/users/application/users.service";
import { SessionService } from "../../../src/features/auth/application/session.service";
import { usersServiceMock } from "../../__mocks__/users.service.mock";
import { SessionRepository } from "../../../src/features/auth/repositories/session.repository";

describe("AuthService - token methods", () => {
  let authService: AuthService;
  const payload = {
    userId: "user1",
    deviceId: "dev1",
    expiresAt: new Date(),
  };

  beforeEach(() => {
    const container = new Container();
    container.bind(UsersRepository).toConstantValue(usersRepositoryMock);
    container.bind(AuthRepository).toConstantValue(authRepositoryMock);
    container.bind(UsersService).toConstantValue(usersServiceMock);
    container.bind(SessionService).toSelf();
    container.bind(SessionRepository).toSelf();
    container.bind(AuthService).toSelf();
    authService = container.get<AuthService>(AuthService);

    jest
      .spyOn(tokenHasher, "generateHash")
      .mockImplementation((token: string) => {
        return `hashed-${token}`;
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("revokeToken", () => {
    it("should throw error if token not provided", async () => {
      await expect(authService.revokeToken("", payload)).rejects.toThrow(
        BadRequestError,
      );
    });

    it("should throw error if user not found", async () => {
      usersRepositoryMock.findByIdOrFail.mockRejectedValue(
        new BadRequestError("User not found", "userId"),
      );
      await expect(authService.revokeToken("token1", payload)).rejects.toThrow(
        BadRequestError,
      );
    });

    it("should call addRevokedToken with correct hash and data", async () => {
      const fakeUser = { _id: "user1" };
      usersRepositoryMock.findByIdOrFail.mockResolvedValue(fakeUser as any);

      await authService.revokeToken("token1", payload);

      expect(tokenHasher.generateHash).toHaveBeenCalledWith("token1");
      expect(authRepositoryMock.addRevokedToken).toHaveBeenCalledWith({
        tokenHash: "hashed-token1",
        userId: payload.userId,
        deviceId: payload.deviceId,
        expiresAt: payload.expiresAt,
      });
    });
  });

  describe("isRefreshTokenRevoked", () => {
    it("should return true if authRepository returns true", async () => {
      authRepositoryMock.isTokenRevoked.mockResolvedValue(true);

      const result = await authService.isRefreshTokenRevoked("token1");
      expect(result).toBe(true);
      expect(authRepositoryMock.isTokenRevoked).toHaveBeenCalledWith("token1");
    });

    it("should return false if authRepository returns false", async () => {
      authRepositoryMock.isTokenRevoked.mockResolvedValue(false);

      const result = await authService.isRefreshTokenRevoked("token2");
      expect(result).toBe(false);
      expect(authRepositoryMock.isTokenRevoked).toHaveBeenCalledWith("token2");
    });
  });
});
