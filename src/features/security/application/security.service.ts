import { ForbiddenError } from "../../../core/errors/forbidden.error";
import { SessionRepository } from "../../auth/repositories/session.repository";

export class SecurityService {
  private sessionRepository: SessionRepository;
  constructor(sessionRepository?: SessionRepository) {
    this.sessionRepository = sessionRepository ?? new SessionRepository();
  }

  async delete(deviceId: string, userId: string): Promise<void> {
    const session = await this.sessionRepository.findByDeviceId(deviceId);
    if (session.userId !== userId) {
      throw new ForbiddenError("You cannot delete someone else's device");
    }

    await this.sessionRepository.delete(session._id.toString());
  }

  async deleteManyExcept(deviceId: string, userId: string): Promise<void> {
    await this.sessionRepository.deleteAllByUserId(userId, [deviceId]);
  }
}

const securityService = new SecurityService();

export default securityService;
