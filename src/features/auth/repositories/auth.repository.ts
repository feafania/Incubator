import { RevokedToken, RevokedTokenModel } from "../domain/revoked-token";
import { RevokedTokenDomainDto } from "../domain/revoked-token-domain.dto";
import { tokenHasher } from "../../../core/infrastructure/crypto/token-hasher";
import { injectable } from "inversify";

@injectable()
export class AuthRepository {
  async addRevokedToken(revokedToken: RevokedTokenDomainDto) {
    const entity = RevokedToken.create({
      ...revokedToken,
    });

    await RevokedTokenModel.insertOne(entity);
  }

  async isTokenRevoked(token: string): Promise<boolean> {
    const hash = tokenHasher.generateHash(token);

    const found = await RevokedTokenModel.findOne({
      tokenHash: hash,
    });

    return !!found;
  }

  async deleteMany(): Promise<void> {
    await RevokedTokenModel.deleteMany({});
  }
}
