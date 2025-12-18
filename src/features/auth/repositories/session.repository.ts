import { RepositoryNotFoundError } from "../../../core/errors/repository-not-found.error";
import { SessionDocument, SessionModel } from "../domain/session";
import { injectable } from "inversify";
import mongoose from "mongoose";

@injectable()
export class SessionRepository {
  async findByIdOrFail(id: string): Promise<SessionDocument> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new RepositoryNotFoundError("Session not exist");
    }
    const res = await SessionModel.findById(id);

    if (!res) {
      throw new RepositoryNotFoundError("Session not exist");
    }

    return res;
  }

  async findByDeviceId(deviceId: string): Promise<SessionDocument> {
    const res = await SessionModel.findOne({ deviceId });
    if (!res) {
      throw new RepositoryNotFoundError("Session not exist");
    }

    return res;
  }

  async findByUserId(userId: string): Promise<SessionDocument[]> {
    return SessionModel.find({ userId }).exec();
  }

  async findByDeviceIdAndIssuedAtOrFail(deviceId: string, issuedAt: Date) {
    const session = await SessionModel.findOne({ deviceId, issuedAt });
    if (!session) throw new RepositoryNotFoundError("Session not exist");
    return session;
  }

  async findExistingSession(
    userId: string,
    deviceId: string,
  ): Promise<SessionDocument | null> {
    const session = await SessionModel.findOne({ deviceId, userId });
    if (!session) return null;
    return session;
  }

  async save(session: SessionDocument): Promise<SessionDocument> {
    return session.save();
  }

  async delete(id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new RepositoryNotFoundError("Session not exist");
    }

    const deleteResult = await SessionModel.deleteOne({
      _id: new mongoose.Types.ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      console.log("No session for delete");
      throw new RepositoryNotFoundError("Session not exist");
    }

    return;
  }

  async deleteMany(): Promise<void> {
    await SessionModel.deleteMany({});
  }

  async deleteByUserIdAndDeviceId(userId: string, deviceId: string) {
    return SessionModel.deleteMany({ userId, deviceId });
  }

  async deleteAllByUserId(userId: string, excludeDevices: string[]) {
    return SessionModel.deleteMany({
      userId,
      deviceId: { $nin: excludeDevices },
    });
  }
}
