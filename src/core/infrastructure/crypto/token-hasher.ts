import crypto from "crypto";

export const tokenHasher = {
  generateHash(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  },
};
