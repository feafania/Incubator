import { ClassFieldsOnly } from "../../../core/types/fields-only";
import { PostDomainDto } from "./post-domain.dto";
import { ClassMethodsOnly } from "../../../core/types/methods-only";
import mongoose, { HydratedDocument, model, Model } from "mongoose";
import { SETTINGS } from "../../../core/settings/settings";

type PostType = ClassFieldsOnly<Post>;

type PostMethods = ClassMethodsOnly<Post>;

type PostStatics = typeof Post;

type PostModelType = Model<PostType, {}, PostMethods> & PostStatics;

export type PostDocument = HydratedDocument<PostType, PostMethods>;

const postSchema = new mongoose.Schema<PostType, PostModelType, PostMethods>({
  title: { type: String, required: true },
  shortDescription: { type: String },
  content: { type: String },
  blogId: { type: String, required: true },
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

  static create(dto: PostDomainDto) {
    return new PostModel({
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
    });
  }

  update(dto: PostDomainDto) {
    this.title = dto.title;
    this.shortDescription = dto.shortDescription;
    this.content = dto.content;
    this.blogId = dto.blogId;
    this.updatedAt = new Date();
  }
}

postSchema.loadClass(Post);

export const PostModel = model<PostType, PostModelType>(
  SETTINGS.COLLECTIONS.POSTS,
  postSchema,
);
