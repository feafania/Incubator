import { WithId } from "mongodb";
import { DeviceListOutput } from "../output/device-list.output";
import { SessionEntity } from "../../../auth/domain/session";

export function mapToDeviceOutput(
  session: WithId<SessionEntity>,
): DeviceListOutput {
  return {
    ip: session.ip ?? "",
    title: session.deviceName ?? "",
    lastActiveDate: session.issuedAt.toISOString(),
    deviceId: session.deviceId,
  };
}
