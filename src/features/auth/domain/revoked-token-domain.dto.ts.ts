export type RevokedTokenDomainDto = {
  tokenHash: string;
  userId: string;
  deviceId: string | null;
  expiresAt: Date;
};
