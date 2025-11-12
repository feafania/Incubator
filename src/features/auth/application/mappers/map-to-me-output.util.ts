import { WithId } from "mongodb";
import { MeOutput } from "../output/me.output";
import { User } from "../../../users/domain/user";

export function mapToMeOutput(user: WithId<User>): MeOutput {
  return {
    email: user.email,
    login: user.login,
    userId: user._id.toString(),
  };
}
