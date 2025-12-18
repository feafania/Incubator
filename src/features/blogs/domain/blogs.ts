import { ClassFieldsOnly } from "../../../core/types/fields-only";
import { BlogDomainDto } from "./blog-domain.dto";
import { ClassMethodsOnly } from "../../../core/types/methods-only";
import mongoose, { HydratedDocument, model, Model } from "mongoose";
import { SETTINGS } from "../../../core/settings/settings";

type BlogType = ClassFieldsOnly<Blog>;

type BlogMethods = ClassMethodsOnly<Blog>;

type BlogStatics = typeof Blog;

type BlogModelType = Model<BlogType, {}, BlogMethods> & BlogStatics;

export type BlogDocument = HydratedDocument<BlogType, BlogMethods>;

const blogSchema = new mongoose.Schema<BlogType, BlogModelType, BlogMethods>({
  name: { type: String, required: true },
  description: { type: String },
  websiteUrl: { type: String },
  isMembership: { type: Boolean, default: false },
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

export class Blog {
  declare name: string;
  declare description: string;
  declare websiteUrl: string;
  declare isMembership: boolean; // True if user has not expired membership subscription to blog
  declare createdAt: Date;
  declare updatedAt: Date;

  static create(dto: BlogDomainDto) {
    return new BlogModel({
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      isMembership: dto.isMembership,
    });
  }

  update(dto: BlogDomainDto) {
    this.name = dto.name;
    this.description = dto.description;
    this.websiteUrl = dto.websiteUrl;
    this.isMembership = dto.isMembership ?? this.isMembership;
    this.updatedAt = new Date();
  }
}

blogSchema.loadClass(Blog);

export const BlogModel = model<BlogType, BlogModelType>(
  SETTINGS.COLLECTIONS.BLOGS,
  blogSchema,
);
