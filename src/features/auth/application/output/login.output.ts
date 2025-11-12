import { EmailConfirmationDomainDto } from "../../../users/domain/email-confirmation-domain.dto";

export type LoginOutput = {
  id: string;
  login: string;
  email: string;
  passwordHash: string;
  emailConfirmation: EmailConfirmationDomainDto;
};
