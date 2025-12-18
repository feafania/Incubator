import { UserDocument } from "../../domain/user";
import { UserOutput } from "../output/user.output";

export function mapToUserOutput(user: UserDocument): UserOutput {
  return {
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  };
}
