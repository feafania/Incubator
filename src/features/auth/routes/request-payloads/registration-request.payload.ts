export type RegistrationRequestPayload = {
  /**
   * login of the new user
   * maxLength: 10
   * minLength: 3
   * pattern: ^[a-zA-Z0-9_-]*$
   * must be unique
   */
  login: string;
  /**
   * password of the new user
   * maxLength: 20
   * minLength: 6
   */
  password: string;
  /**
   * email of the new user
   * pattern: ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
   * example: example@example.com
   *
   * must be unique
   */
  email: string;
};
