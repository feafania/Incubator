import jwt, { SignOptions } from "jsonwebtoken";
import { SETTINGS } from "../../settings/settings";

type StringValue = `${number}${"s" | "m" | "h" | "d" | "w" | "y"}`;

export const jwtService = {
  createToken(userId: string, login?: string): string {
    const payload: Record<string, unknown> = { userId };
    if (login) payload.login = login;

    const expiry = SETTINGS.JWT_EXPIRY_PERIOD;

    const expiresIn =
      typeof expiry === "string" && /^\d+$/.test(expiry)
        ? (`${expiry}d` as StringValue)
        : (expiry as StringValue | number);

    const options: SignOptions = { expiresIn };

    return jwt.sign(payload, SETTINGS.JWT_SECRET, options);
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

  verifyToken(token: string): { userId: string; login?: string } | null {
    try {
      return jwt.verify(token, SETTINGS.JWT_SECRET) as {
        userId: string;
        login?: string;
      };
    } catch (error) {
      console.error("Token verification error", error);
      return null;
    }
  },
};
