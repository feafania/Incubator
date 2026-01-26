import { LikeDomainDto } from "./like-domain.dto";
import { ClassFieldsOnly } from "../../../core/types/fields-only";
import { ClassMethodsOnly } from "../../../core/types/methods-only";
import mongoose, { HydratedDocument, model, Model } from "mongoose";
import { SETTINGS } from "../../../core/settings/settings";
import { LikeStatus } from "./like-status-type";
import { UpdateLikeDomainDto } from "./update-like-domain.dto";
import { LikeInfoDomainDto } from "./like-info-domain.dto";
import { ExtendedLikeInfoDomainDto } from "./extended-like-info-domain.dto";

type LikeType = ClassFieldsOnly<Like>;

type LikeMethods = ClassMethodsOnly<Like>;

type LikeStatics = typeof Like;

type LikeModelType = Model<LikeType, {}, LikeMethods> & LikeStatics;

export type LikeDocument = HydratedDocument<LikeType, LikeMethods>;

const likeSchema = new mongoose.Schema<LikeType, LikeModelType, LikeMethods>({
  status: {
    type: String,
    enum: Object.values(LikeStatus),
    required: true,
    default: LikeStatus.NONE,
  },
  authorId: { type: String, required: true },
  parentId: { type: String, required: true },
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

export class Like {
  declare status: LikeStatus;
  declare authorId: string;
  declare parentId: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  static create(dto: LikeDomainDto) {
    return new LikeModel({
      status: dto.status,
      authorId: dto.authorId,
      parentId: dto.parentId,
    });
  }

  update(dto: UpdateLikeDomainDto) {
    this.status = dto.status;
    this.updatedAt = new Date();
  }

  static setLikeCount<
    T extends {
      likesCount: number;
      dislikesCount: number;
    },
  >(entity: T, status: LikeStatus, oldStatus: LikeStatus) {
    if (oldStatus === status) return;

    switch (oldStatus) {
      case LikeStatus.LIKE:
        entity.likesCount--;
        break;
      case LikeStatus.DISLIKE:
        entity.dislikesCount--;
        break;
    }

    switch (status) {
      case LikeStatus.LIKE:
        entity.likesCount++;
        break;
      case LikeStatus.DISLIKE:
        entity.dislikesCount++;
        break;
    }

    entity.likesCount = Math.max(0, entity.likesCount);
    entity.dislikesCount = Math.max(0, entity.dislikesCount);
  }
}

likeSchema.loadClass(Like);

export const LikeModel = model<LikeType, LikeModelType>(
  SETTINGS.COLLECTIONS.LIKES,
  likeSchema,
);
