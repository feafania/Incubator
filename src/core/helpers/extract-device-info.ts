import { randomUUID } from "node:crypto";
import { RequestWithBody } from "../types/request";

export default function extractDeviceInfo(req: RequestWithBody<any>): {
  deviceId: string;
  deviceName: string;
  ip: string;
} {
  return {
    deviceId: randomUUID(),
    deviceName: req.headers["user-agent"] ?? "Unknown device",
    ip: req.ip || req.socket.remoteAddress || "unknown",
  };
}
