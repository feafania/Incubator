import { CommentsRepository } from "../../src/features/comments/repositories/comments.repository";

export const commentsRepositoryMock: jest.Mocked<CommentsRepository> = {
  findByIdOrFail: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  deleteMany: jest.fn(),
  deleteByPostId: jest.fn(),
};
