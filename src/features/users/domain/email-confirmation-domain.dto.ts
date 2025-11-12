export type EmailConfirmationDomainDto = {
  confirmationCode: string;
  expiresAt: Date;
  isConfirmed: boolean;
};
