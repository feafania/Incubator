import { ObjectId, WithId } from "mongodb";
import { sessionCollection } from "../../../db/mongo.db";
import { RepositoryNotFoundError } from "../../../core/errors/repository-not-found.error";
import { SessionEntity } from "../domain/session";

export class SessionRepository {
  async findByIdOrFail(id: string): Promise<WithId<SessionEntity>> {
    let objectId: ObjectId;

    try {
      objectId = new ObjectId(id);
    } catch {
      throw new RepositoryNotFoundError("Session not exist");
    }
    const res = await sessionCollection.findOne({ _id: objectId });

    if (!res) {
      throw new RepositoryNotFoundError("Session not exist");
    }

    return SessionEntity.reconstitute(res);
  }

  async findByDeviceId(deviceId: string): Promise<WithId<SessionEntity>> {
    const res = await sessionCollection.findOne({ deviceId });
    if (!res) {
      throw new RepositoryNotFoundError("Session not exist");
    }

    return SessionEntity.reconstitute(res);
  }

  async findByUserId(userId: string): Promise<WithId<SessionEntity>[]> {
    const items = await sessionCollection.find({ userId }).toArray();

    return items.map((el) => SessionEntity.reconstitute(el));
  }

  async findByDeviceIdAndIssuedAtOrFail(deviceId: string, issuedAt: Date) {
    const session = await sessionCollection.findOne({ deviceId, issuedAt });
    if (!session) throw new RepositoryNotFoundError("Session not exist");
    return SessionEntity.reconstitute(session);
  }

  async findExistingSession(
    userId: string,
    deviceId: string,
  ): Promise<WithId<SessionEntity> | null> {
    const session = await sessionCollection.findOne({ deviceId, userId });
    if (!session) return null;
    return SessionEntity.reconstitute(session);
  }

  async save(session: SessionEntity): Promise<SessionEntity> {
    if (!session._id) {
      const insertResult = await sessionCollection.insertOne(session);

      session._id = insertResult.insertedId;

      return session;
    } else {
      const { _id, ...dtoToUpdate } = session;

      const updateResult = await sessionCollection.updateOne(
        {
          _id,
        },
        {
          $set: {
            ...dtoToUpdate,
          },
        },
      );

      if (updateResult.matchedCount < 1) {
        throw new RepositoryNotFoundError("Session not exist");
      }

      return session;
    }
  }

  async delete(id: string): Promise<void> {
    let objectId: ObjectId;

    try {
      objectId = new ObjectId(id);
    } catch {
      throw new RepositoryNotFoundError("Session not exist");
    }

    const deleteResult = await sessionCollection.deleteOne({
      _id: objectId,
    });

    if (deleteResult.deletedCount < 1) {
      console.log("No session for delete");
      throw new RepositoryNotFoundError("Session not exist");
    }

    return;
  }

  async deleteMany(): Promise<void> {
    await sessionCollection.deleteMany({});
  }

  async deleteByUserIdAndDeviceId(userId: string, deviceId: string) {
    return sessionCollection.deleteMany({ userId, deviceId });
  }

  async deleteAllByUserId(userId: string, excludeDevices: string[]) {
    return sessionCollection.deleteMany({
      userId,
      deviceId: { $nin: excludeDevices },
    });
  }
}
