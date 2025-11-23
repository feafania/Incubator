import { SessionRepository } from "../repositories/session.repository";
import {
  CreateSessionCommand,
  UpdateSessionCommand,
} from "./command-handlers/session-commands";
import { SessionEntity } from "../domain/session";

export class SessionService {
  private sessionRepository: SessionRepository;
  constructor(sessionRepository?: SessionRepository) {
    this.sessionRepository = sessionRepository ?? new SessionRepository();
  }

  async create(command: CreateSessionCommand): Promise<string> {
    const newSession = SessionEntity.create(command);

    const createdUser = await this.sessionRepository.save(newSession);
    return createdUser._id!.toString();
  }

  async update(command: UpdateSessionCommand): Promise<void> {
    const { deviceId, issuedAt, ip, deviceName, expiresAt } = command;
    const newCommand = { issuedAt, ip, expiresAt };

    const session = await this.sessionRepository.findByDeviceId(deviceId);

    session.update(newCommand);
    session.updateDeviceInfo({ deviceName });

    await this.sessionRepository.save(session);

    return;
  }

  async delete(id: string): Promise<void> {
    await this.sessionRepository.delete(id);
    return;
  }

  async deleteMany(): Promise<void> {
    await this.sessionRepository.deleteMany();
  }

  async isSessionValid(deviceId: string, issuedAt: Date): Promise<boolean> {
    try {
      await this.sessionRepository.findByDeviceIdAndIssuedAtOrFail(
        deviceId,
        issuedAt,
      );
      return true;
    } catch {
      return false;
    }
  }

  async findExistingSession(
    userId: string,
    deviceId: string,
  ): Promise<SessionEntity | null> {
    const session = await this.sessionRepository.findExistingSession(
      userId,
      deviceId,
    );
    return session;
  }
}

const sessionService = new SessionService();

export default sessionService;
