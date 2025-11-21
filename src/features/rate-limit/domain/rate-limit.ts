import { ObjectId, WithId } from "mongodb";
import { ClassFieldsOnly } from "../../../core/types/fields-only";
import { RateLimitDomainDto } from "./rate-limit-domain.dto.ts";

export class RateLimit {
  _id?: ObjectId;
  ip: string;
  url: string;
  createdAt: Date;

  private constructor(dto: ClassFieldsOnly<RateLimit>) {
    this.ip = dto.ip;
    this.url = dto.url;

    this.createdAt = dto.createdAt;

    if (dto._id) {
      this._id = dto._id;
    }
  }

  static create(dto: RateLimitDomainDto) {
    return new RateLimit({
      ip: dto.ip,
      url: dto.url,
      createdAt: new Date(),
    });
  }

  static reconstitute(dto: ClassFieldsOnly<RateLimit>): WithId<RateLimit> {
    const instance = new RateLimit(dto);

    return instance as WithId<RateLimit>;
  }
}
