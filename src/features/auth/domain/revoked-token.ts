import { ClassFieldsOnly } from "../../../core/types/fields-only";
import { RevokedTokenDomainDto } from "./revoked-token-domain.dto";
import { ClassMethodsOnly } from "../../../core/types/methods-only";
import mongoose, { HydratedDocument, model, Model } from "mongoose";
import { SETTINGS } from "../../../core/settings/settings";

type RevokedTokenType = ClassFieldsOnly<RevokedToken>;

type RevokedTokenMethods = ClassMethodsOnly<RevokedToken>;

type RevokedTokenStatics = typeof RevokedToken;

type RevokedTokenModelType = Model<RevokedTokenType, {}, RevokedTokenMethods> &
  RevokedTokenStatics;

export type RevokedTokenDocument = HydratedDocument<
  RevokedTokenType,
  RevokedTokenMethods
>;

const revokedTokenSchema = new mongoose.Schema<
  RevokedTokenType,
  RevokedTokenModelType,
  RevokedTokenMethods
>(
  {
    tokenHash: { type: String, required: true },
    userId: { type: String, required: true },
    deviceId: { type: String, default: null },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    expiresAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: SETTINGS.COLLECTIONS.REVOKED_TOKENS,
  },
);

export class RevokedToken {
  declare tokenHash: string;
  declare userId: string;
  declare deviceId: string | null;
  declare createdAt: Date;
  declare expiresAt: Date;

  static create(dto: RevokedTokenDomainDto) {
    return new RevokedTokenModel({
      tokenHash: dto.tokenHash,
      userId: dto.userId,
      deviceId: dto.deviceId,
      expiresAt: dto.expiresAt,
    });
  }
}

revokedTokenSchema.loadClass(RevokedToken);

export const RevokedTokenModel = model<RevokedTokenType, RevokedTokenModelType>(
  SETTINGS.COLLECTIONS.REVOKED_TOKENS,
  revokedTokenSchema,
);
