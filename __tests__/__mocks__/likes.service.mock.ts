import { LikesService } from "../../src/features/likes/application/likes.service";

export const likesServiceMock: Partial<LikesService> = {
  findByAuthorAndParent: jest.fn(),
  create: jest.fn(),
  update: jest.fn(), // тут update - метад сэрвісу
  delete: jest.fn(),
  deleteMany: jest.fn(),
  deleteByParentId: jest.fn(),
};
