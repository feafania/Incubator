import { ClassFieldsOnly } from "../../../core/types/fields-only";
import { PostDomainDto } from "./post-domain.dto";
import { ClassMethodsOnly } from "../../../core/types/methods-only";
import mongoose, { HydratedDocument, model, Model } from "mongoose";
import { SETTINGS } from "../../../core/settings/settings";
import { LikeStatus } from "../../likes/domain/like-status-type";
import { ExtendedLikeInfoDomainDto } from "../../likes/domain/extended-like-info-domain.dto";
import { Like } from "../../likes/domain/like";
import { LikesDetailsOutput } from "../../likes/application/output/like-details.output";

type PostType = ClassFieldsOnly<Post>;

type PostMethods = ClassMethodsOnly<Post>;

type PostStatics = typeof Post;

type PostModelType = Model<PostType, {}, PostMethods> & PostStatics;

export type PostDocument = HydratedDocument<PostType, PostMethods>;
export type PostForOutput = Omit<ClassFieldsOnly<Post>, "extendedLikesInfo"> & {
  _id: mongoose.Types.ObjectId;
  blogName: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus?: LikeStatus;
    newestLikes: LikesDetailsOutput[];
  };
};

const NewestLikeSchema = new mongoose.Schema(
  {
    addedAt: { type: Date, required: true },
    userId: { type: String, required: true },
  },
  {
    _id: false,
    timestamps: false,
  },
);

const ExtendedLikesInfoSchema = new mongoose.Schema(
  {
    likesCount: { type: Number },
    dislikesCount: { type: Number },
    newestLikes: {
      type: [NewestLikeSchema],
      default: [],
    },
  },
  { _id: false, timestamps: false },
);

const postSchema = new mongoose.Schema<PostType, PostModelType, PostMethods>({
  title: { type: String, required: true },
  shortDescription: { type: String },
  content: { type: String },
  blogId: { type: String, required: true },
  extendedLikesInfo: ExtendedLikesInfoSchema,
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

export class Post {
  declare title: string;
  declare shortDescription: string;
  declare content: string;
  declare blogId: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare extendedLikesInfo: ExtendedLikeInfoDomainDto;
  private static readonly MAX_NEWEST_LIKES = 3;

  static create(dto: PostDomainDto) {
    const post = new PostModel({
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
    });
    if (dto.extendedLikesInfo) {
      post.extendedLikesInfo = dto.extendedLikesInfo;
    } else {
      post.extendedLikesInfo = Post.getEmptyExtendedLikesInfo();
    }
    return post;
  }

  update(dto: Partial<PostDomainDto>) {
    this.title = dto.title ?? this.title;
    this.shortDescription = dto.shortDescription ?? this.shortDescription;
    this.content = dto.content ?? this.content;
    this.blogId = dto.blogId ?? this.blogId;
    if (dto.extendedLikesInfo) {
      this.extendedLikesInfo = dto.extendedLikesInfo;
    }
    this.updatedAt = new Date();
  }

  setLikeCount(status: LikeStatus, oldStatus: LikeStatus) {
    if (oldStatus === status) return;

    const extendedLikesInfo =
      this.extendedLikesInfo ?? Post.getEmptyExtendedLikesInfo();

    Like.setLikeCount<ExtendedLikeInfoDomainDto>(
      extendedLikesInfo,
      status,
      oldStatus,
    );
    this.update({
      extendedLikesInfo,
    });
  }

  addToNewestLikes(userId: string) {
    const extendedLikesInfo =
      this.extendedLikesInfo ?? Post.getEmptyExtendedLikesInfo();

    const newestLikes = (extendedLikesInfo.newestLikes ?? []).filter(
      (like) => like.userId !== userId,
    );

    newestLikes.unshift({
      addedAt: new Date(),
      userId,
    });

    extendedLikesInfo.newestLikes = newestLikes.slice(0, Post.MAX_NEWEST_LIKES);

    this.update({
      extendedLikesInfo,
    });
  }

  removeFromNewestLikes(userId: string) {
    const extendedLikesInfo =
      this.extendedLikesInfo ?? Post.getEmptyExtendedLikesInfo();

    extendedLikesInfo.newestLikes = (
      extendedLikesInfo.newestLikes ?? []
    ).filter((like) => like.userId !== userId);

    this.update({ extendedLikesInfo });
  }

  private static getEmptyExtendedLikesInfo() {
    return {
      likesCount: 0,
      dislikesCount: 0,
      newestLikes: [],
    };
  }
}

postSchema.loadClass(Post);

export const PostModel = model<PostType, PostModelType>(
  SETTINGS.COLLECTIONS.POSTS,
  postSchema,
);
