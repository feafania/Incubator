import { SecurityQueryRepository } from "../repositories/security.query.repository";
import { DeviceListOutput } from "./output/device-list.output";
import { inject, injectable } from "inversify";

@injectable()
export class SecurityQueryService {
  constructor(
    @inject(SecurityQueryRepository)
    private securityQueryRepository: SecurityQueryRepository,
  ) {}
  async findManyByUserId(userId: string): Promise<DeviceListOutput[]> {
    return this.securityQueryRepository.findManyByUserId(userId);
  }

  async findByIdOrFail(id: string): Promise<DeviceListOutput> {
    return this.securityQueryRepository.findByIdOrFail(id);
  }

  async findByDeviceIdOrFail(deviceId: string): Promise<DeviceListOutput> {
    return this.securityQueryRepository.findByIdOrFail(deviceId);
  }
}
