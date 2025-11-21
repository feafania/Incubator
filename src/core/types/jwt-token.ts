export interface JwtPayload {
  userId: string;
  deviceId?: string;
  login?: string;
  expiresAt?: Date;
  issuedAt?: Date;
}
export interface JwtConfig {
  expiresIn?: string | number;
  secret?: string | undefined;
}
