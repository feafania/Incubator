import request from "supertest";
import { Application } from "express";
import { UserOutput } from "../../../src/features/users/application/output/user.output";
import { CreateUserDomainDto } from "../../../src/features/users/domain/create-user-domain.dto";
import { createUserDto } from "./create-user-dto";
import { createUser } from "./create-user";
import { HTTP_STATUSES } from "../../../src/core/types/http-statuses";
import { AUTH_PATH, LOGIN_PATH } from "../../../src/core/paths/paths";

type UserWithToken = {
  user: UserOutput;
  accessToken: string;
};

export async function createUserAndLogin(
  app: Application,
  userDto?: CreateUserDomainDto,
): Promise<UserWithToken> {
  // 1️⃣ Захоўваем поўны dto з паролем
  const dto = { ...createUserDto(), ...userDto };

  // 2️⃣ Ствараем карыстальніка
  const user = await createUser(app, dto);

  // 3️⃣ Аўтарызуемся з тым жа логінам і паролем
  const loginResponse = await request(app)
    .post(`${AUTH_PATH}${LOGIN_PATH}`)
    .send({
      loginOrEmail: dto.login,
      password: dto.password,
    })
    .expect(HTTP_STATUSES.OK_200);

  const { accessToken } = loginResponse.body;

  if (!accessToken) {
    throw new Error(
      `❌ Login failed — accessToken not returned. Response: ${JSON.stringify(loginResponse.body)}`,
    );
  }

  // 4️⃣ Вяртаем карыстальніка і токен
  return { user, accessToken };
}
