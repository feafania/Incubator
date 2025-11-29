import { AuthQueryRepository } from "../repositories/auth.query.repository";
import { LoginOutput } from "./output/login.output";
import { MeOutput } from "./output/me.output";
import { RecoveryPasswordOutput } from "./output/recovery-password.output";

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

  async getUserByEmail(email: string): Promise<LoginOutput | null> {
    return this.authQueryRepository.getUserByEmail(email);
  }

  async getUserByRegistrationCode(code: string): Promise<LoginOutput | null> {
    return this.authQueryRepository.getUserByRegistrationCode(code);
  }

  async getUserByPasswordRecoveryCode(
    recoveryCode: string,
  ): Promise<RecoveryPasswordOutput | null> {
    return this.authQueryRepository.getUserByPasswordRecoveryCode(recoveryCode);
  }

  async findByIdOrFail(id: string): Promise<MeOutput> {
    return this.authQueryRepository.findByIdOrFail(id);
  }
}

export const authQueryService = new AuthQueryService();
