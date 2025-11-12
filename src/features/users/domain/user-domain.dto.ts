import { EmailConfirmationDomainDto } from "./email-confirmation-domain.dto";

export type UserDomainDto = {
  login: string;
  email: string;
  passwordHash: string;
  emailConfirmation?: EmailConfirmationDomainDto;
};
