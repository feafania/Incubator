import { ObjectId, WithId } from "mongodb";
import { ClassFieldsOnly } from "../../../core/types/fields-only";
import { SessionDomainDto } from "./session-domain.dto";
import { UpdateSessionDto } from "./update-session.dto";
import { truncateDateToSeconds } from "../../../core/helpers/truncate-date-to-seconds";

export class SessionEntity {
  _id?: ObjectId;
  userId: string;
  deviceId: string;
  issuedAt: Date;
  deviceName: string | undefined;
  ip: string;
  expiresAt: Date;
  updatedAt: Date;

  private constructor(dto: ClassFieldsOnly<SessionEntity>) {
    this.userId = dto.userId;
    this.deviceId = dto.deviceId;

    this.issuedAt = dto.issuedAt;
    this.deviceName = dto.deviceName;
    this.ip = dto.ip;
    this.expiresAt = dto.expiresAt;
    this.updatedAt = dto.updatedAt;

    if (dto._id) {
      this._id = dto._id;
    }
  }

  static create(dto: SessionDomainDto) {
    return new SessionEntity({
      userId: dto.userId,
      deviceId: dto.deviceId,
      issuedAt: truncateDateToSeconds(),
      deviceName: dto.deviceName,
      ip: dto.ip,
      expiresAt: dto.expiresAt,
      updatedAt: new Date(),
    });
  }

  update(dto: UpdateSessionDto) {
    this.ip = dto.ip;
    this.issuedAt = dto.issuedAt;
    this.expiresAt = dto.expiresAt;

    this.updatedAt = new Date();
  }

  updateDeviceInfo(dto: { deviceName?: string }) {
    if (dto.deviceName) this.deviceName = dto.deviceName;
  }

  static reconstitute(
    dto: ClassFieldsOnly<SessionEntity>,
  ): WithId<SessionEntity> {
    const instance = new SessionEntity(dto);

    return instance as WithId<SessionEntity>;
  }
}
