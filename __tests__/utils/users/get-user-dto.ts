import { UserDomainDto } from "../../../src/features/users/domain/user-domain.dto";
import { passwordHasher } from "../../../src/core/infrastructure/crypto/password-hasher";
import { createUserDto } from "./create-user-dto";

export async function getUserDto(): Promise<UserDomainDto> {
  const createUser = createUserDto();
  const passwordHash = await passwordHasher.generateHash(createUser.password);
  return {
    login: createUser.login,
    email: createUser.email,
    passwordHash,
  };
}
