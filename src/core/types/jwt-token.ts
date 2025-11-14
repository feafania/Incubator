export interface JwtPayload {
  userId: string;
  login?: string;
  expiresAt?: Date;
}
export interface JwtConfig {
  expiresIn?: string | number;
  secret?: string | undefined;
}
