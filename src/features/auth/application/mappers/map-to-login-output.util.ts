import { LoginOutput } from "../output/login.output";
import { UserDocument } from "../../../users/domain/user";

export function mapToLoginOutput(user: UserDocument): LoginOutput {
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
