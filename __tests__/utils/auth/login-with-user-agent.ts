import request from "supertest";
import { Express } from "express";
import { CreateUserDomainDto } from "../../../src/features/users/domain/create-user-domain.dto";
import { createUserDto } from "../users/create-user-dto";
import { randomUUID } from "node:crypto";
import { AUTH_PATH, LOGIN_PATH } from "../../../src/core/paths/paths";
import { createUser } from "../users/create-user";
import { findCookie } from "./extract-cookie";
import { container } from "../../../src/composition-root";
import { UsersService } from "../../../src/features/users/application/users.service";

/**
 * Helper: login with custom user-agent and return tokens + cookies
 */
export async function loginWithUserAgent(
  app: Express,
  userDto?: CreateUserDomainDto,
  userAgent?: string,
): Promise<{
  status: number;
  accessToken: string | undefined;
  refreshToken: string | undefined;
  userAgent: string;
}> {
  // 1️⃣ Захоўваем поўны dto з паролем
  const dto = { ...createUserDto(), ...userDto };

  // 2️⃣ Ствараем карыстальніка
  const usersService = container.get<UsersService>(UsersService);
  const user = await usersService.findByLogin(dto.login);
  if (!user) {
    await createUser(app, dto);
  }

  const testUserAgent: string =
    userAgent || randomUUID().toString().slice(0, 8);

  const res = await request(app)
    .post(`${AUTH_PATH}${LOGIN_PATH}`)
    .set("User-Agent", testUserAgent)
    .send({ loginOrEmail: dto.login, password: dto.password });

  const rawCookies = res.headers["set-cookie"];
  const refreshToken = findCookie(rawCookies, "refreshToken");

  return {
    status: res.status,
    accessToken: res.body?.accessToken,
    refreshToken,
    userAgent: testUserAgent,
  };
}
