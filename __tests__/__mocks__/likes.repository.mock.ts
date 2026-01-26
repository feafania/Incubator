import { LikesRepository } from "../../src/features/likes/repositories/likes.repository";

export const likesRepositoryMock: jest.Mocked<LikesRepository> = {
  findByIdOrFail: jest.fn(),
  save: jest.fn(),
  findByAuthorAndParent: jest.fn(),
  deleteByParentId: jest.fn(),
  delete: jest.fn(),
  deleteMany: jest.fn(),
};
