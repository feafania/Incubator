import { WithId } from "mongodb";
import { User } from "../../domain/user";
import { LoginOutput } from "../output/login.output";

export function mapToLoginOutput(user: WithId<User>): LoginOutput {
  return {
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    passwordHash: user.passwordHash,
  };
}
