import { UserDomainDto } from "../../domain/user-domain.dto";
import { CreateUserDomainDto } from "../../domain/create-user-domain.dto";

export type CreateUserCommand = CreateUserDomainDto;
export type UpdateUserCommand = UserDomainDto & { id: string };
