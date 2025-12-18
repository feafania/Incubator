import { ClassFieldsOnly } from "../../../core/types/fields-only";
import { RateLimitDomainDto } from "./rate-limit-domain.dto.ts";
import { ClassMethodsOnly } from "../../../core/types/methods-only";
import mongoose, { HydratedDocument, model, Model } from "mongoose";
import { SETTINGS } from "../../../core/settings/settings";

type RateLimitType = ClassFieldsOnly<RateLimit>;

type RateLimitMethods = ClassMethodsOnly<RateLimit>;

type RateLimitStatics = typeof RateLimit;

type RateLimitModelType = Model<RateLimitType, {}, RateLimitMethods> &
  RateLimitStatics;

export type RateLimitDocument = HydratedDocument<
  RateLimitType,
  RateLimitMethods
>;

const rateLimitSchema = new mongoose.Schema<
  RateLimitType,
  RateLimitModelType,
  RateLimitMethods
>(
  {
    ip: { type: String, required: true },
    url: { type: String },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    collection: SETTINGS.COLLECTIONS.RATE_LIMIT, // дзеля захаваньня імя базы
  },
);

export class RateLimit {
  declare ip: string;
  declare url: string;
  declare createdAt: Date;

  static create(dto: RateLimitDomainDto) {
    return new RateLimitModel({
      ip: dto.ip,
      url: dto.url,
    });
  }
}

rateLimitSchema.loadClass(RateLimit);

export const RateLimitModel = model<RateLimitType, RateLimitModelType>(
  SETTINGS.COLLECTIONS.RATE_LIMIT,
  rateLimitSchema,
);
