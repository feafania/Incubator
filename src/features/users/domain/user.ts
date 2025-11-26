import { ObjectId, WithId } from "mongodb";
import { UserDomainDto } from "./user-domain.dto";
import { ClassFieldsOnly } from "../../../core/types/fields-only";
import { EmailConfirmationDomainDto } from "./email-confirmation-domain.dto";
import { PasswordRecoveryDomainDto } from "./password-recovery-domain.dto";

export class User {
  _id?: ObjectId;
  login: string;
  email: string;
  passwordHash: string;
  emailConfirmation: EmailConfirmationDomainDto;
  passwordRecovery: PasswordRecoveryDomainDto;
  createdAt: Date;
  updatedAt: Date;

  private constructor(dto: ClassFieldsOnly<User>) {
    this.login = dto.login;
    this.email = dto.email;
    this.passwordHash = dto.passwordHash;
    this.emailConfirmation = dto.emailConfirmation;
    this.passwordRecovery = dto.passwordRecovery;

    this.createdAt = dto.createdAt;
    this.updatedAt = dto.updatedAt;

    if (dto._id) {
      this._id = dto._id;
    }
  }

  static create(dto: UserDomainDto) {
    return new User({
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

      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  update(dto: UserDomainDto) {
    this.login = dto.login;
    this.email = dto.email;
    this.passwordHash = dto.passwordHash;
    if (dto.emailConfirmation) this.emailConfirmation = dto.emailConfirmation;

    this.updatedAt = new Date();
  }

  static reconstitute(dto: ClassFieldsOnly<User>): WithId<User> {
    const instance = new User(dto);

    return instance as WithId<User>;
  }
}
