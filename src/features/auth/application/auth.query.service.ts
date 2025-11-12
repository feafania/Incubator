import { AuthQueryRepository } from "../repositories/auth.query.repository";
import { LoginOutput } from "./output/login.output";

class AuthQueryService {
  private authQueryRepository: AuthQueryRepository;
  constructor() {
    this.authQueryRepository = new AuthQueryRepository();
  }

  async getUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<LoginOutput | null> {
    return this.authQueryRepository.getUserByLoginOrEmail(loginOrEmail);
  }
}

export const authQueryService = new AuthQueryService();
