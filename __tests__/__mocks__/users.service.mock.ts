import { UsersService } from "../../src/features/users/application/users.service";

export const usersServiceMock = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  deleteMany: jest.fn(),
} as unknown as jest.Mocked<UsersService>;
