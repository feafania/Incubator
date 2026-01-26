import { CommentDomainDto } from "./comment-domain.dto";
import { ClassFieldsOnly } from "../../../core/types/fields-only";
import { UpdateCommentDomainDto } from "./update-comment-domain.dto";
import { ClassMethodsOnly } from "../../../core/types/methods-only";
import mongoose, { HydratedDocument, model, Model } from "mongoose";
import { SETTINGS } from "../../../core/settings/settings";
import { LikeInfoDomainDto } from "../../likes/domain/like-info-domain.dto";
import { LikeStatus } from "../../likes/domain/like-status-type";
import { Like } from "../../likes/domain/like";

type CommentType = ClassFieldsOnly<CommentEntity>;

type CommentMethods = ClassMethodsOnly<CommentEntity>;

type CommentStatics = typeof CommentEntity;

type CommentModelType = Model<CommentType, {}, CommentMethods> & CommentStatics;

export type CommentDocument = HydratedDocument<CommentType, CommentMethods>;
export type CommentWithStatus = ClassFieldsOnly<CommentEntity> & {
  _id: mongoose.Types.ObjectId;
  likesInfo: {
    myStatus: LikeStatus;
  };
};

const CommentatorInfoSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    userLogin: { type: String },
  },
  { _id: false, timestamps: false },
);

const LikesInfoSchema = new mongoose.Schema(
  {
    likesCount: { type: Number },
    dislikesCount: { type: Number },
  },
  { _id: false, timestamps: false },
);

const commentSchema = new mongoose.Schema<
  CommentType,
  CommentModelType,
  CommentMethods
>({
  content: { type: String, required: true },
  postId: { type: String, required: true },
  commentatorInfo: { type: CommentatorInfoSchema },
  likesInfo: LikesInfoSchema,
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export class CommentEntity {
  declare content: string;
  declare postId: string;
  declare commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  declare likesInfo: LikeInfoDomainDto;
  declare createdAt: Date;
  declare updatedAt: Date;

  static create(dto: CommentDomainDto) {
    const comment = new CommentModel({
      content: dto.content,
      postId: dto.postId,
      commentatorInfo: dto.commentatorInfo,
    });
    if (dto.likesInfo) {
      comment.likesInfo = dto.likesInfo;
    } else {
      comment.likesInfo = {
        likesCount: 0,
        dislikesCount: 0,
      };
    }
    return comment;
  }

  update(dto: UpdateCommentDomainDto) {
    this.content = dto.content;
    if (dto.likesInfo) {
      this.likesInfo = dto.likesInfo;
    }
    this.updatedAt = new Date();
  }

  setLikeCount(status: LikeStatus, oldStatus: LikeStatus) {
    if (oldStatus === status) return;

    const likesInfo = this.likesInfo ?? {
      likesCount: 0,
      dislikesCount: 0,
    };

    Like.setLikeCount<LikeInfoDomainDto>(likesInfo, status, oldStatus);

    this.update({
      content: this.content,
      likesInfo,
    });
  }
}

commentSchema.loadClass(CommentEntity);

export const CommentModel = model<CommentType, CommentModelType>(
  SETTINGS.COLLECTIONS.COMMENTS,
  commentSchema,
);
