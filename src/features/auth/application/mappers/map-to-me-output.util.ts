import { WithId } from "mongodb";
import { User } from "../../domain/user";
import { MeOutput } from "../output/me.output";

export function mapToMeOutput(user: WithId<User>): MeOutput {
  return {
    email: user.email,
    login: user.login,
    userId: user._id.toString(),
  };
}
