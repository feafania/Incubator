import request from "supertest";
import express from "express";
import { MongoMemoryServer } from "mongodb-memory-server";

import { createTestApp, stopTestDb } from "../../create-test-app";
import { clearDb } from "../../utils/clear-db";
import { createUserDto } from "../../utils/users/create-user-dto";
import { HTTP_STATUSES } from "../../../src/core/types/http-statuses";

import { AUTH_PATH } from "../../../src/core/paths/paths";
import { SECURITY_PATH } from "../../../src/core/paths/paths";
import { loginWithUserAgent } from "../../utils/auth/login-with-user-agent";
import { findCookie } from "../../utils/auth/extract-cookie";
import { DeviceListOutput } from "../../../src/features/security/application/output/device-list.output";
import { sleep } from "../../sleep";
import { createUser } from "../../utils/users/create-user";

describe("Security Devices API", () => {
  let app: express.Express;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    const setup = await createTestApp();
    app = setup.app;
    mongoServer = setup.mongoServer;
  });

  beforeEach(async () => {
    await clearDb(app);
  });

  afterAll(async () => {
    await stopTestDb(mongoServer);
  });

  it("FULL DEVICES FLOW", async () => {
    // ----------------------------------------------------
    // 1. Create user
    // ----------------------------------------------------
    const userDTO = createUserDto();

    // ----------------------------------------------------
    // 2. Login user 4 times with different user-agent
    // ----------------------------------------------------
    const sessions: {
      refresh: string;
      access: string;
      userAgent: string;
    }[] = [];

    for (let i = 1; i <= 4; i++) {
      const loginRes = await loginWithUserAgent(app, userDTO);

      expect(loginRes.status).toBe(HTTP_STATUSES.OK_200);

      sessions.push({
        refresh: loginRes.refreshToken!,
        access: loginRes.accessToken!,
        userAgent: loginRes.userAgent!,
      });
    }

    // ----------------------------------------------------
    // 3. GET /security/devices — should return 4 devices
    // ----------------------------------------------------
    const listRes = await request(app)
      .get(`${SECURITY_PATH}/devices`)
      .set("Cookie", sessions[0].refresh);

    expect(listRes.status).toBe(HTTP_STATUSES.OK_200);
    expect(listRes.body.length).toBe(4);

    const before = listRes.body;

    const device1 = before[0];
    const device2 = before[1];
    const device3 = before[2];

    // ----------------------------------------------------
    // 4. Refresh token for device 1
    // ----------------------------------------------------
    await sleep(1000);
    const refreshRes = await request(app)
      .post(`${AUTH_PATH}/refresh-token`)
      .set("Cookie", sessions[0].refresh)
      .send();

    expect(refreshRes.status).toBe(HTTP_STATUSES.OK_200);

    const rawCookies = refreshRes.headers["set-cookie"];
    const newRefresh1 = findCookie(rawCookies, "refreshToken");
    if (!newRefresh1) throw new Error("Failed to refresh token");

    // ----------------------------------------------------
    // 5. List devices again → count must NOT change, deviceId must NOT change
    // lastActiveDate of device1 MUST change
    // ----------------------------------------------------
    const listRes2 = await request(app)
      .get(`${SECURITY_PATH}/devices`)
      .set("Cookie", newRefresh1!);

    expect(listRes2.status).toBe(HTTP_STATUSES.OK_200);
    expect(listRes2.body.length).toBe(4);

    const after: DeviceListOutput[] = listRes2.body;

    const updatedDevice1 = after.find((d) => d.deviceId === device1.deviceId);
    if (!updatedDevice1) throw new Error("Failed to get devices");
    expect(updatedDevice1).toBeDefined();
    // console.log("device1", device1);
    // console.log("updatedDevice1", updatedDevice1);
    expect(updatedDevice1.lastActiveDate).not.toBe(device1.lastActiveDate);

    // ----------------------------------------------------
    // 6. Delete device2 (using refresh of device1)
    // ----------------------------------------------------
    const del2 = await request(app)
      .delete(`${SECURITY_PATH}/devices/${device2.deviceId}`)
      .set("Cookie", newRefresh1);

    expect(del2.status).toBe(HTTP_STATUSES.NO_CONTENT_204);

    const res2 = await request(app)
      .get(`${SECURITY_PATH}/devices`)
      .set("Cookie", newRefresh1);

    const listAfterDel2: DeviceListOutput[] = res2.body;

    expect(listAfterDel2.length).toBe(3);
    expect(listAfterDel2.some((d) => d.deviceId === device2.deviceId)).toBe(
      false,
    );

    // ----------------------------------------------------
    // 7. Logout device 3 (send its own refresh token)
    // ----------------------------------------------------
    const logout3 = await request(app)
      .post(`${AUTH_PATH}/logout`)
      .set("Cookie", sessions[2].refresh);

    expect(logout3.status).toBe(HTTP_STATUSES.NO_CONTENT_204);

    const res3 = await request(app)
      .get(`${SECURITY_PATH}/devices`)
      .set("Cookie", newRefresh1);
    const listAfter3: DeviceListOutput[] = res3.body;

    expect(listAfter3.length).toBe(2);
    expect(listAfter3.some((d) => d.deviceId === device3.deviceId)).toBe(false);

    // ----------------------------------------------------
    // 8. Delete all other devices — using device1
    // ----------------------------------------------------
    const delOthers = await request(app)
      .delete(`${SECURITY_PATH}/devices`)
      .set("Cookie", newRefresh1);

    expect(delOthers.status).toBe(HTTP_STATUSES.NO_CONTENT_204);

    const listFinal = await request(app)
      .get(`${SECURITY_PATH}/devices`)
      .set("Cookie", newRefresh1);

    expect(listFinal.body.length).toBe(1);
    expect(listFinal.body[0].deviceId).toBe(updatedDevice1.deviceId);
  });

  // ----------------------------------------------------
  // NEGATIVE TESTS
  // ----------------------------------------------------

  it("❌ 401 when requesting devices without auth", async () => {
    const res = await request(app).get(`${SECURITY_PATH}/devices`);
    expect(res.status).toBe(HTTP_STATUSES.NOT_AUTHORIZED_401);
  });

  it("❌ 404 when deleting non-existing device", async () => {
    const loginRes = await loginWithUserAgent(app);
    const res = await request(app)
      .delete(`${SECURITY_PATH}/devices/nonexistent-id`)
      .set("Cookie", loginRes.refreshToken!);

    expect(res.status).toBe(HTTP_STATUSES.NOT_FOUND_404);
  });

  it("❌ 403 deleting device of another user", async () => {
    const u1 = createUserDto();
    const u2 = createUserDto();

    // login user1
    const s1 = await await loginWithUserAgent(app, u1);
    const list1 = await request(app)
      .get(`${SECURITY_PATH}/devices`)
      .set("Cookie", s1.refreshToken!);

    const device1 = list1.body[0];

    // login user2
    const s2 = await await loginWithUserAgent(app, u2);

    // user2 tries to delete user1 device
    const res = await request(app)
      .delete(`${SECURITY_PATH}/devices/${device1.deviceId}`)
      .set("Cookie", s2.refreshToken!);

    expect(res.status).toBe(HTTP_STATUSES.FORBIDDEN_403);
  });
});
