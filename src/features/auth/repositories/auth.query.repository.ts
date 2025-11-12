import { LoginOutput } from "../application/output/login.output";
import { userCollection } from "../../../db/mongo.db";
import { mapToLoginOutput } from "../application/mappers/map-to-login-output.util";

export class AuthQueryRepository {
  async getUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<LoginOutput | null> {
    const user = await userCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });

    if (!user) {
      return null;
    }

    return mapToLoginOutput(user);
  }
}
