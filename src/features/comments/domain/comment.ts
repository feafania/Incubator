import { ObjectId, WithId } from "mongodb";
import { CommentDomainDto } from "./comment-domain.dto";
import { ClassFieldsOnly } from "../../../core/types/fields-only";
import {UpdateCommentDomainDto} from "./update-comment-domain.dto";

export class CommentEntity {
  _id?: ObjectId;
  content: string;
  postId: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: Date;
  updatedAt: Date;

  private constructor(dto: ClassFieldsOnly<CommentEntity>) {
    this.content = dto.content;
    this.postId = String(dto.postId);
    this.commentatorInfo = dto.commentatorInfo;
    this.createdAt = dto.createdAt;
    this.updatedAt = dto.updatedAt;

    if (dto._id) {
      this._id = dto._id;
    }
  }

  static create(dto: CommentDomainDto) {
    return new CommentEntity({
      content: dto.content,
      postId: dto.postId,
      commentatorInfo: dto.commentatorInfo,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  update(dto: UpdateCommentDomainDto) {
    this.content = dto.content;
    this.updatedAt = new Date();
  }

  static reconstitute(
    dto: ClassFieldsOnly<CommentEntity>,
  ): WithId<CommentEntity> {
    const instance = new CommentEntity(dto);

    return instance as WithId<CommentEntity>;
  }
}
