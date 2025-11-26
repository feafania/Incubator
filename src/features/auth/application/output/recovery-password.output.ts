import { PasswordRecoveryDomainDto } from "../../../users/domain/password-recovery-domain.dto";

export type RecoveryPasswordOutput = {
  id: string;
  login: string;
  email: string;
  passwordHash: string;
  passwordRecovery: PasswordRecoveryDomainDto;
};
