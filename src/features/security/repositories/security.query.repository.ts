import { DeviceListOutput } from "../application/output/device-list.output";
import { RepositoryNotFoundError } from "../../../core/errors/repository-not-found.error";
import { mapToDeviceOutput } from "../application/mappers/map-to-device-list-output.util";
import { injectable } from "inversify";
import { SessionModel } from "../../auth/domain/session";
import mongoose from "mongoose";

@injectable()
export class SecurityQueryRepository {
  async findManyByUserId(userId: string): Promise<DeviceListOutput[]> {
    const items = await SessionModel.find({ userId }).exec();

    return items.map(mapToDeviceOutput);
  }

  async findByIdOrFail(id: string): Promise<DeviceListOutput> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new RepositoryNotFoundError("Session not exist");
    }

    const session = await SessionModel.findOne(new mongoose.Types.ObjectId(id));

    if (!session) {
      throw new RepositoryNotFoundError("Session not exist");
    }
    return mapToDeviceOutput(session);
  }

  async findByDeviceIdOrFail(deviceId: string): Promise<DeviceListOutput> {
    const session = await SessionModel.findOne({ deviceId });

    if (!session) {
      throw new RepositoryNotFoundError("Session not exist");
    }

    return mapToDeviceOutput(session);
  }
}
