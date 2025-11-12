import { WithId } from "mongodb";
import { LoginOutput } from "../output/login.output";
import { User } from "../../../users/domain/user";

export function mapToLoginOutput(user: WithId<User>): LoginOutput {
  return {
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    passwordHash: user.passwordHash,
    emailConfirmation: {
      confirmationCode: user.emailConfirmation?.confirmationCode ?? "",
      expiresAt: user.emailConfirmation?.expiresAt ?? Date.now(),
      isConfirmed: !!user.emailConfirmation?.isConfirmed,
    },
  };
}
