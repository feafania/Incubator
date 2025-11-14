import { AuthService } from "../../../src/features/auth/application/auth.service";
import { tokenHasher } from "../../../src/core/infrastructure/crypto/token-hasher";
import { BadRequestError } from "../../../src/core/errors/bad-request.error";
import { authRepositoryMock } from "../../__mocks__/auth.repository.mock";
import { usersRepositoryMock } from "../../__mocks__/users.repository.mock";

describe("AuthService - token methods", () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService(
      undefined,
      usersRepositoryMock,
      authRepositoryMock,
    );
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
      await expect(
        authService.revokeToken("", "user1", new Date()),
      ).rejects.toThrow(BadRequestError);
    });

    it("should throw error if user not found", async () => {
      usersRepositoryMock.findByIdOrFail.mockRejectedValue(
        new BadRequestError("User not found", "userId"),
      );
      await expect(
        authService.revokeToken("token1", "user1", new Date()),
      ).rejects.toThrow(BadRequestError);
    });

    it("should call addRevokedToken with correct hash and data", async () => {
      const fakeUser = { _id: "user1" };
      usersRepositoryMock.findByIdOrFail.mockResolvedValue(fakeUser as any);

      const expiresAt = new Date();
      await authService.revokeToken("token1", "user1", expiresAt);

      expect(tokenHasher.generateHash).toHaveBeenCalledWith("token1");
      expect(authRepositoryMock.addRevokedToken).toHaveBeenCalledWith({
        tokenHash: "hashed-token1",
        userId: "user1",
        deviceId: null,
        expiresAt,
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
