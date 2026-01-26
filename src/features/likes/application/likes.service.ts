import { ForbiddenError } from "../../../core/errors/forbidden.error";
import { inject, injectable } from "inversify";
import { LikesRepository } from "../repositories/likes.repository";
import { LikeDomainDto } from "../domain/like-domain.dto";
import { Like, LikeDocument } from "../domain/like";
import {
  CreateLikeCommand,
  UpdateLikeCommand,
} from "./command-handlers/like-commands";

@injectable()
export class LikesService {
  constructor(
    @inject(LikesRepository)
    private likesRepository: LikesRepository,
  ) {}

  async findByAuthorAndParent(
    authorId: string,
    parentId: string,
  ): Promise<LikeDocument | null> {
    return this.likesRepository.findByAuthorAndParent(authorId, parentId);
  }

  async create(command: CreateLikeCommand): Promise<string> {
    const { status, authorId, parentId } = command;

    const newLikeCommand: LikeDomainDto = {
      status,
      authorId,
      parentId,
    };
    const newComment = Like.create(newLikeCommand);

    const createdComment = await this.likesRepository.save(newComment);
    return createdComment._id!.toString();
  }

  async update(command: UpdateLikeCommand): Promise<void> {
    const { id, ...updateLikeDomainDto } = command;

    const like = await this.likesRepository.findByIdOrFail(id);

    like.update(updateLikeDomainDto);

    await this.likesRepository.save(like);

    return;
  }

  async delete(id: string, authorId: string): Promise<void> {
    const like = await this.likesRepository.findByIdOrFail(id);

    if (like.authorId !== authorId) {
      throw new ForbiddenError("You cannot delete someone else's like");
    }

    await this.likesRepository.delete(id);
  }

  async deleteMany(idForDelete: string[] = []): Promise<void> {
    await this.likesRepository.deleteMany(idForDelete);
  }

  async deleteByParentId(id: string): Promise<void> {
    await this.likesRepository.deleteByParentId(id);
  }
}
