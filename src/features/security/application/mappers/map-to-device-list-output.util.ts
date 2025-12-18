import { DeviceListOutput } from "../output/device-list.output";
import { SessionDocument } from "../../../auth/domain/session";

export function mapToDeviceOutput(session: SessionDocument): DeviceListOutput {
  return {
    ip: session.ip ?? "",
    title: session.deviceName ?? "",
    lastActiveDate: session.issuedAt.toISOString(),
    deviceId: session.deviceId,
  };
}
