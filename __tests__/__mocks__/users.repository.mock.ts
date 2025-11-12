import { UsersRepository } from "../../src/features/users/repositories/users.repository";

export const usersRepositoryMock: jest.Mocked<UsersRepository> = {
  findByIdOrFail: jest.fn() as jest.MockedFunction<
    UsersRepository["findByIdOrFail"]
  >,
  findByLogin: jest.fn() as jest.MockedFunction<UsersRepository["findByLogin"]>,
  findByEmail: jest.fn() as jest.MockedFunction<UsersRepository["findByEmail"]>,
  save: jest.fn() as jest.MockedFunction<UsersRepository["save"]>,
  delete: jest.fn() as jest.MockedFunction<UsersRepository["delete"]>,
  deleteMany: jest.fn() as jest.MockedFunction<UsersRepository["deleteMany"]>,
};
