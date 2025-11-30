import { UsersRepository } from "../repositories/users.repository";
import {
  CreateUserCommand,
  UpdateUserCommand,
} from "./command-handlers/user-commands";
import { EmailConfirmationDomainDto } from "../domain/email-confirmation-domain.dto";
import { addHours } from "date-fns";
import { BadRequestError } from "../../../core/errors/bad-request.error";
import { passwordHasher } from "../../../core/infrastructure/crypto/password-hasher";
import { UserDomainDto } from "../domain/user-domain.dto";
import { User } from "../domain/user";
import { randomUUID } from "node:crypto";
import { SETTINGS } from "../../../core/settings/settings";
import { WithId } from "mongodb";
import { inject, injectable } from "inversify";

@injectable()
export class UsersService {
  constructor(
    @inject(UsersRepository) private usersRepository: UsersRepository,
  ) {}

  async create(
    command: CreateUserCommand,
    isAdmin: boolean = false,
  ): Promise<string> {
    const { login, password, email } = command;

    const existingByLogin = await this.usersRepository.findByLogin(login);
    if (existingByLogin) {
      throw new BadRequestError("login should be unique", "login");
    }

    const existingByEmail = await this.usersRepository.findByEmail(email);
    if (existingByEmail) {
      throw new BadRequestError("email should be unique", "email");
    }
    const passwordHash = await passwordHasher.generateHash(password);

    const emailConfirmation: EmailConfirmationDomainDto = isAdmin
      ? {
          confirmationCode: "",
          expiresAt: new Date(),
          isConfirmed: true,
        } // адміністратар
      : {
          confirmationCode: randomUUID(),
          expiresAt: addHours(new Date(), SETTINGS.REGISTRATION_CODE_LIFE), // У гадзінах
          isConfirmed: false,
        };

    const newUserCommand: UserDomainDto = {
      login,
      email,
      passwordHash,
      emailConfirmation,
    };

    const newUser = User.create(newUserCommand);

    const createdUser = await this.usersRepository.save(newUser);
    return createdUser._id!.toString();
  }

  async update(command: UpdateUserCommand): Promise<void> {
    const { id, ...userDomainDto } = command;

    const user = await this.usersRepository.findByIdOrFail(id);

    user.update(userDomainDto);

    await this.usersRepository.save(user);

    return;
  }

  async delete(id: string): Promise<void> {
    await this.usersRepository.delete(id);
    return;
  }

  async deleteMany(): Promise<void> {
    await this.usersRepository.deleteMany();
  }

  async findByLogin(login: string): Promise<WithId<User> | null> {
    return this.usersRepository.findByLogin(login);
  }

  async findByEmail(email: string): Promise<WithId<User> | null> {
    return this.usersRepository.findByLogin(email);
  }
}
