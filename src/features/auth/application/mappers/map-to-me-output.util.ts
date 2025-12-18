import { MeOutput } from "../output/me.output";
import { UserDocument } from "../../../users/domain/user";

export function mapToMeOutput(user: UserDocument): MeOutput {
  return {
    email: user.email,
    login: user.login,
    userId: user._id.toString(),
  };
}
