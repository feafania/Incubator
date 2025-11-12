import { UsersRepository } from "../repositories/users.repository";
import { User } from "../domain/user";
import {
  CreateUserCommand,
  UpdateUserCommand,
} from "./command-handlers/user-commands";
import { UserDomainDto } from "../domain/user-domain.dto";
import { passwordHasher } from "../../../core/infrastructure/crypto/password-hasher";
import { BadRequestError } from "../../../core/errors/bad-request.error";

export class UsersService {
  private usersRepository: UsersRepository;
  constructor() {
    this.usersRepository = new UsersRepository();
  }

  async create(command: CreateUserCommand): Promise<string> {
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

    const newUserCommand: UserDomainDto = {
      login,
      email,
      passwordHash,
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
}

const usersService = new UsersService();

export default usersService;
