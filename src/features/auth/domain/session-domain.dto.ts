export type SessionDomainDto = {
  userId: string;
  deviceId: string;
  issuedAt: Date;
  deviceName: string | undefined;
  ip: string;
  expiresAt: Date;
};
