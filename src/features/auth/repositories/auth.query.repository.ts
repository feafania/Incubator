import { LoginOutput } from "../application/output/login.output";
import { userCollection } from "../../../db/mongo.db";
import { mapToLoginOutput } from "../application/mappers/map-to-login-output.util";
import { ObjectId } from "mongodb";
import { RepositoryNotFoundError } from "../../../core/errors/repository-not-found.error";
import { MeOutput } from "../application/output/me.output";
import { mapToMeOutput } from "../application/mappers/map-to-me-output.util";

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

  async getUserByEmail(email: string): Promise<LoginOutput | null> {
    const user = await userCollection.findOne({ email });

    if (!user) {
      return null;
    }

    return mapToLoginOutput(user);
  }

  async getUserByRegistrationCode(code: string): Promise<LoginOutput | null> {
    const user = await userCollection.findOne({
      "emailConfirmation.confirmationCode": code,
      emailConfirmation: { $exists: true },
    });

    if (!user) {
      return null;
    }

    return mapToLoginOutput(user);
  }

  async findByIdOrFail(id: string): Promise<MeOutput> {
    let objectId: ObjectId;

    try {
      objectId = new ObjectId(id);
    } catch {
      throw new RepositoryNotFoundError("User not exist");
    }
    const user = await userCollection.findOne({ _id: objectId });

    if (!user) {
      throw new RepositoryNotFoundError("User not exist");
    }
    return mapToMeOutput(user);
  }
}
