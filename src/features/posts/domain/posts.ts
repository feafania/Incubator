import { ObjectId, WithId } from "mongodb";
import { ClassFieldsOnly } from "../../../core/types/fields-only";
import { PostDomainDto } from "./post-domain.dto";

export class Post {
  _id?: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  createdAt: Date;
  updatedAt: Date;

  private constructor(dto: ClassFieldsOnly<Post>) {
    this.title = dto.title;
    this.shortDescription = dto.shortDescription;
    this.content = dto.content;
    this.blogId = dto.blogId;
    this.createdAt = dto.createdAt;
    this.updatedAt = dto.updatedAt;

    if (dto._id) {
      this._id = dto._id;
    }
  }

  static create(dto: PostDomainDto) {
    return new Post({
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  update(dto: PostDomainDto) {
    this.title = dto.title;
    this.shortDescription = dto.shortDescription;
    this.content = dto.content;
    this.blogId = dto.blogId;
    this.updatedAt = new Date();
  }

  static reconstitute(dto: ClassFieldsOnly<Post>): WithId<Post> {
    const instance = new Post(dto);

    return instance as WithId<Post>;
  }
}
