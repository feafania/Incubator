import { SessionDomainDto } from "../../domain/session-domain.dto";

export type CreateSessionCommand = SessionDomainDto;
export type UpdateSessionCommand = Omit<SessionDomainDto, "userId">;
