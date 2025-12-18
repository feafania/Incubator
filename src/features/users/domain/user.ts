import { UserDomainDto } from "./user-domain.dto";
import { ClassFieldsOnly } from "../../../core/types/fields-only";
import { EmailConfirmationDomainDto } from "./email-confirmation-domain.dto";
import { PasswordRecoveryDomainDto } from "./password-recovery-domain.dto";
import { ClassMethodsOnly } from "../../../core/types/methods-only";
import mongoose, { HydratedDocument, model, Model } from "mongoose";
import { SETTINGS } from "../../../core/settings/settings";

type UserType = ClassFieldsOnly<User>;

type UserMethods = ClassMethodsOnly<User>;

type UserStatics = typeof User;

type UserModelType = Model<UserType, {}, UserMethods> & UserStatics;

export type UserDocument = HydratedDocument<UserType, UserMethods>;

const EmailConfirmationSchema = new mongoose.Schema(
  {
    confirmationCode: { type: String },
    expiresAt: {
      type: Date,
      default: Date.now,
    },
    isConfirmed: { type: Boolean },
  },
  { _id: false, timestamps: false },
);

const PasswordRecoverySchema = new mongoose.Schema(
  {
    recoveryCode: { type: String },
    expiresAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false, timestamps: false },
);

const userSchema = new mongoose.Schema<UserType, UserModelType, UserMethods>({
  login: { type: String, required: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  emailConfirmation: { type: EmailConfirmationSchema },
  passwordRecovery: { type: PasswordRecoverySchema },
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

export class User {
  declare login: string;
  declare email: string;
  declare passwordHash: string;
  declare emailConfirmation: EmailConfirmationDomainDto;
  declare passwordRecovery: PasswordRecoveryDomainDto;
  declare createdAt: Date;
  declare updatedAt: Date;

  static create(dto: UserDomainDto) {
    return new UserModel({
      login: dto.login,
      email: dto.email,
      passwordHash: dto.passwordHash,
      emailConfirmation: dto.emailConfirmation ?? {
        confirmationCode: "",
        expiresAt: new Date(),
        isConfirmed: true,
      },
      passwordRecovery: dto.passwordRecovery ?? {
        recoveryCode: "",
        expiresAt: new Date(),
      },
    });
  }

  update(dto: UserDomainDto) {
    this.login = dto.login;
    this.email = dto.email;
    this.passwordHash = dto.passwordHash;
    if (dto.emailConfirmation) this.emailConfirmation = dto.emailConfirmation;

    this.updatedAt = new Date();
  }
}

userSchema.loadClass(User);

export const UserModel = model<UserType, UserModelType>(
  SETTINGS.COLLECTIONS.USERS,
  userSchema,
);
