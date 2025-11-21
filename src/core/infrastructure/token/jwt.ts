import jwt, { SignOptions } from "jsonwebtoken";
import { SETTINGS } from "../../settings/settings";
import { JwtPayload, JwtConfig } from "../../types/jwt-token";

type StringValue = `${number}${"s" | "m" | "h" | "d" | "w" | "y"}`;

export const jwtService = {
  createToken(claims: JwtPayload, jwtOptions?: JwtConfig): string {
    const payload: Record<string, unknown> = { userId: claims.userId };
    if (claims.deviceId) payload.deviceId = claims.deviceId;
    if (claims.login) payload.login = claims.login;

    const expiry = jwtOptions?.expiresIn ?? SETTINGS.JWT_ACCESS_EXPIRY_PERIOD;
    const secret = jwtOptions?.secret ?? SETTINGS.JWT_ACCESS_SECRET;

    const expiresIn =
      typeof expiry === "string" && /^\d+$/.test(expiry)
        ? (`${expiry}s` as StringValue)
        : (expiry as StringValue | number);

    const options: SignOptions = { expiresIn };

    return jwt.sign(payload, secret, options);
  },

  decodeToken(token: string): any | null {
    /** Returns the decoded payload without verifying
     * if the signature is valid. token - JWT string to decode
     * [options] - Options for decoding returns - The decoded Token
     */
    try {
      return jwt.decode(token);
    } catch (e: unknown) {
      console.error("Can't decode token", e);
      return null;
    }
  },

  verifyToken(token: string, jwtOptions?: JwtConfig): JwtPayload | null {
    try {
      const secret = jwtOptions?.secret ?? SETTINGS.JWT_ACCESS_SECRET;
      const verifiedPayload = jwt.verify(token, secret);
      if (typeof verifiedPayload !== "object" || verifiedPayload === null) {
        return null;
      }
      const payload: JwtPayload = { userId: verifiedPayload.userId };
      if (verifiedPayload.deviceId) payload.deviceId = verifiedPayload.deviceId;
      if (verifiedPayload.login) payload.login = verifiedPayload.login;

      if (verifiedPayload.exp) {
        payload.expiresAt = new Date(verifiedPayload.exp * 1000);
      }
      if (verifiedPayload.iat) {
        payload.issuedAt = new Date(verifiedPayload.iat * 1000);
      }
      return payload;
    } catch (error) {
      console.error("Token verification error", error);
      return null;
    }
  },
};
