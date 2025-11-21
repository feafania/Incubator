import { SecurityQueryRepository } from "../repositories/security.query.repository";
import { DeviceListOutput } from "./output/device-list.output";

class SecurityQueryService {
  private securityQueryRepository: SecurityQueryRepository;
  constructor(securityQueryRepository?: SecurityQueryRepository) {
    this.securityQueryRepository =
      securityQueryRepository ?? new SecurityQueryRepository();
  }
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

export const securityQueryService = new SecurityQueryService();
