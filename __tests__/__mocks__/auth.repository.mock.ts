import { AuthRepository } from "../../src/features/auth/repositories/auth.repository";

export const authRepositoryMock = {
  addRevokedToken: jest.fn(),
  isTokenRevoked: jest.fn(),
  deleteMany: jest.fn(),
} as unknown as jest.Mocked<AuthRepository>;
