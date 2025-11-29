import { CreateUserDomainDto } from "../../../src/features/users/domain/create-user-domain.dto";
import { randomUUID } from "node:crypto";

export function createUserDto(): CreateUserDomainDto {
  const unique = randomUUID().slice(0, 8); // кароткі UUID
  return {
    login: `${unique}`,
    email: `${unique}@example.com`,
    password: "12345678",
  };
}
