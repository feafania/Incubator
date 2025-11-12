import { SETTINGS } from "../../src/core/settings/settings";

export function generateBasicAuthToken() {
  const credentials = `${SETTINGS.ADMIN_AUTH}`;
  const token = Buffer.from(credentials).toString("base64");
  return `Basic ${token}`;
}
