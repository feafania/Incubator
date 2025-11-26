import { EmailConfirmationDomainDto } from "./email-confirmation-domain.dto";
import { PasswordRecoveryDomainDto } from "./password-recovery-domain.dto";

export type UserDomainDto = {
  login: string;
  email: string;
  passwordHash: string;
  emailConfirmation?: EmailConfirmationDomainDto;
  passwordRecovery?: PasswordRecoveryDomainDto;
};
