export type UpdateUserRequestPayload = {
  id: string;
  /**
   * login of the user
   * maxLength: 10
   * minLength: 3
   * pattern: ^[a-zA-Z0-9_-]*$
   * must be unique
   */
  login: string;
  /**
   * password of the user
   * maxLength: 20
   * minLength: 6
   */
  password: string;
  /**
   * email of the user
   * pattern: ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
   * example: example@example.com
   * must be unique
   */
  email: string;
};
