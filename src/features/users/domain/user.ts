import { ObjectId, WithId } from "mongodb";
import { UserDomainDto } from "./user-domain.dto";
import { ClassFieldsOnly } from "../../../core/types/fields-only";

export class User {
  _id?: ObjectId;
  login: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;

  private constructor(dto: ClassFieldsOnly<User>) {
    this.login = dto.login;
    this.email = dto.email;
    this.passwordHash = dto.passwordHash;
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
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  update(dto: UserDomainDto) {
    this.login = dto.login;
    this.email = dto.email;
    this.passwordHash = dto.passwordHash;
    this.updatedAt = new Date();
  }

  static reconstitute(dto: ClassFieldsOnly<User>): WithId<User> {
    const instance = new User(dto);

    return instance as WithId<User>;
  }
}
