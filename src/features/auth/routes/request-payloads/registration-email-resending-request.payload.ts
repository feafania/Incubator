export type RegistrationEmailResendingRequestPayload = {
  /**
   * email of the new user
   * pattern: ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
   * example: example@example.com
   *
   * must be unique
   */
  email: string;
};
