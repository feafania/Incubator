import { ObjectId, WithId } from "mongodb";
import { ClassFieldsOnly } from "../../../core/types/fields-only";
import { RevokedTokenDomainDto } from "./revoked-token-domain.dto.ts";

export class RevokedToken {
  _id?: ObjectId;
  tokenHash: string;
  userId: string;
  deviceId: string | null = null;
  createdAt: Date;
  expiresAt: Date;

  private constructor(dto: ClassFieldsOnly<RevokedToken>) {
    this.tokenHash = dto.tokenHash;
    this.userId = dto.userId;
    this.deviceId = dto.deviceId;

    this.createdAt = dto.createdAt;
    this.expiresAt = dto.expiresAt;

    if (dto._id) {
      this._id = dto._id;
    }
  }

  static create(dto: RevokedTokenDomainDto) {
    return new RevokedToken({
      tokenHash: dto.tokenHash,
      userId: dto.userId,
      deviceId: dto.deviceId,

      createdAt: new Date(),
      expiresAt: dto.expiresAt,
    });
  }

  static reconstitute(
    dto: ClassFieldsOnly<RevokedToken>,
  ): WithId<RevokedToken> {
    const instance = new RevokedToken(dto);

    return instance as WithId<RevokedToken>;
  }
}
