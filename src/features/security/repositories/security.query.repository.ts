import { ObjectId } from "mongodb";
import { DeviceListOutput } from "../application/output/device-list.output";
import { sessionCollection } from "../../../db/mongo.db";
import { RepositoryNotFoundError } from "../../../core/errors/repository-not-found.error";
import { mapToDeviceOutput } from "../application/mappers/map-to-device-list-output.util";
import { injectable } from "inversify";

@injectable()
export class SecurityQueryRepository {
  async findManyByUserId(userId: string): Promise<DeviceListOutput[]> {
    const items = await sessionCollection.find({ userId }).toArray();

    return items.map(mapToDeviceOutput);
  }

  async findByIdOrFail(id: string): Promise<DeviceListOutput> {
    let objectId: ObjectId;

    try {
      objectId = new ObjectId(id);
    } catch {
      throw new RepositoryNotFoundError("Session not exist");
    }
    const session = await sessionCollection.findOne({ _id: objectId });

    if (!session) {
      throw new RepositoryNotFoundError("Session not exist");
    }
    return mapToDeviceOutput(session);
  }

  async findByDeviceIdOrFail(deviceId: string): Promise<DeviceListOutput> {
    const session = await sessionCollection.findOne({ deviceId });

    if (!session) {
      throw new RepositoryNotFoundError("Session not exist");
    }

    return mapToDeviceOutput(session);
  }
}
