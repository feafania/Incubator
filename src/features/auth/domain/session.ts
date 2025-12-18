import { ClassFieldsOnly } from "../../../core/types/fields-only";
import { SessionDomainDto } from "./session-domain.dto";
import { UpdateSessionDto } from "./update-session.dto";
import { truncateDateToSeconds } from "../../../core/helpers/truncate-date-to-seconds";
import { ClassMethodsOnly } from "../../../core/types/methods-only";
import mongoose, { HydratedDocument, model, Model } from "mongoose";
import { SETTINGS } from "../../../core/settings/settings";

type SessionType = ClassFieldsOnly<SessionEntity>;

type SessionMethods = ClassMethodsOnly<SessionEntity>;

type SessionStatics = typeof SessionEntity;

type SessionModelType = Model<SessionType, {}, SessionMethods> & SessionStatics;

export type SessionDocument = HydratedDocument<SessionType, SessionMethods>;

const sessionSchema = new mongoose.Schema<
  SessionType,
  SessionModelType,
  SessionMethods
>({
  userId: { type: String, required: true },
  deviceId: { type: String, required: true },
  issuedAt: {
    type: Date,
    default: () => truncateDateToSeconds(),
  },
  deviceName: { type: String },
  ip: { type: String, required: true },
  expiresAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export class SessionEntity {
  declare userId: string;
  declare deviceId: string;
  declare issuedAt: Date;
  declare deviceName: string | undefined;
  declare ip: string;
  declare expiresAt: Date;
  declare updatedAt: Date;

  static create(dto: SessionDomainDto) {
    return new SessionModel({
      userId: dto.userId,
      deviceId: dto.deviceId,
      issuedAt: dto.issuedAt,
      deviceName: dto.deviceName,
      ip: dto.ip,
      expiresAt: dto.expiresAt,
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
}

sessionSchema.loadClass(SessionEntity);

export const SessionModel = model<SessionType, SessionModelType>(
  SETTINGS.COLLECTIONS.SESSIONS,
  sessionSchema,
);
