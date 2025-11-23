import { revokedTokenCollection } from "../../../db/mongo.db";
import { RevokedToken } from "../domain/revoked-token";
import { RevokedTokenDomainDto } from "../domain/revoked-token-domain.dto.ts";
import { tokenHasher } from "../../../core/infrastructure/crypto/token-hasher";

export class AuthRepository {
  async addRevokedToken(revokedToken: RevokedTokenDomainDto) {
    const entity = RevokedToken.create({
      ...revokedToken,
    });

    await revokedTokenCollection.insertOne(entity);
  }

  async isTokenRevoked(token: string): Promise<boolean> {
    const hash = tokenHasher.generateHash(token);

    const found = await revokedTokenCollection.findOne({
      tokenHash: hash,
    });

    return !!found;
  }

  async deleteMany(): Promise<void> {
    await revokedTokenCollection.deleteMany({});
  }
}
