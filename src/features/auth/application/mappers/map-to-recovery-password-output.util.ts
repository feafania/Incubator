import { WithId } from "mongodb";
import { User } from "../../../users/domain/user";
import { RecoveryPasswordOutput } from "../output/recovery-password.output";

export function mapToRecoveryPasswordOutput(
  user: WithId<User>,
): RecoveryPasswordOutput {
  return {
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    passwordHash: user.passwordHash,
    passwordRecovery: {
      recoveryCode: user.passwordRecovery?.recoveryCode ?? "",
      expiresAt: user.passwordRecovery?.expiresAt ?? Date.now(),
    },
  };
}
