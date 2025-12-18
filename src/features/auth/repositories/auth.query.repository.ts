import { LoginOutput } from "../application/output/login.output";
import { mapToLoginOutput } from "../application/mappers/map-to-login-output.util";
import { RepositoryNotFoundError } from "../../../core/errors/repository-not-found.error";
import { MeOutput } from "../application/output/me.output";
import { mapToMeOutput } from "../application/mappers/map-to-me-output.util";
import { RecoveryPasswordOutput } from "../application/output/recovery-password.output";
import { mapToRecoveryPasswordOutput } from "../application/mappers/map-to-recovery-password-output.util";
import { UserModel } from "../../users/domain/user";
import mongoose from "mongoose";

export class AuthQueryRepository {
  async getUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<LoginOutput | null> {
    const user = await UserModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });

    if (!user) {
      return null;
    }

    return mapToLoginOutput(user);
  }

  async getUserByEmail(email: string): Promise<LoginOutput | null> {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return null;
    }

    return mapToLoginOutput(user);
  }

  async getUserByRegistrationCode(code: string): Promise<LoginOutput | null> {
    const user = await UserModel.findOne({
      "emailConfirmation.confirmationCode": code,
      emailConfirmation: { $exists: true },
    });

    if (!user) {
      return null;
    }

    return mapToLoginOutput(user);
  }

  async getUserByPasswordRecoveryCode(
    recoveryCode: string,
  ): Promise<RecoveryPasswordOutput | null> {
    const user = await UserModel.findOne({
      "passwordRecovery.recoveryCode": recoveryCode,
      passwordRecovery: { $exists: true },
    });

    if (!user) {
      return null;
    }

    return mapToRecoveryPasswordOutput(user);
  }

  async findByIdOrFail(id: string): Promise<MeOutput> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new RepositoryNotFoundError("User not exist");
    }

    const user = await UserModel.findById(id);

    if (!user) {
      throw new RepositoryNotFoundError("User not exist");
    }
    return mapToMeOutput(user);
  }
}
