import { SessionDomainDto } from "../../domain/session-domain.dto";
import { UpdateSessionDto } from "../../domain/update-session.dto";

export type CreateSessionCommand = SessionDomainDto;
export type UpdateSessionCommand = UpdateSessionDto & { deviceId: string };
