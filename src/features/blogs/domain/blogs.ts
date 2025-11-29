import { ObjectId, WithId } from "mongodb";
import { ClassFieldsOnly } from "../../../core/types/fields-only";
import { BlogDomainDto } from "./blog-domain.dto";

export class Blog {
  _id?: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  isMembership: boolean; // True if user has not expired membership subscription to blog
  createdAt: Date;
  updatedAt: Date;

  private constructor(dto: ClassFieldsOnly<Blog>) {
    this.name = dto.name;
    this.description = dto.description;
    this.websiteUrl = dto.websiteUrl;
    this.isMembership = dto.isMembership ?? false;
    this.createdAt = dto.createdAt;
    this.updatedAt = dto.updatedAt;

    if (dto._id) {
      this._id = dto._id;
    }
  }

  static create(dto: BlogDomainDto) {
    return new Blog({
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      isMembership: dto.isMembership ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  update(dto: BlogDomainDto) {
    this.name = dto.name;
    this.description = dto.description;
    this.websiteUrl = dto.websiteUrl;
    this.isMembership = dto.isMembership ?? this.isMembership;
    this.updatedAt = new Date();
  }

  static reconstitute(dto: ClassFieldsOnly<Blog>): WithId<Blog> {
    const instance = new Blog(dto);

    return instance as WithId<Blog>;
  }
}
