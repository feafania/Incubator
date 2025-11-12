import { v4 as uuidv4 } from "uuid";
import { CreateUserDomainDto } from "../../../src/features/users/domain/create-user-domain.dto";

export function createUserDto(): CreateUserDomainDto {
  const unique = uuidv4().slice(0, 8); // кароткі UUID
  return {
    login: `${unique}`,
    email: `${unique}@example.com`,
    password: "12345678",
  };
}
