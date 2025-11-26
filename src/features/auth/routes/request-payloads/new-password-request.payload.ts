export type NewPasswordRequestPayload = {
  /**
   * new password
   * maxLength: 20
   * minLength: 6
   */
  newPassword: string;
  /**
   * recovery code sent to email
   */
  recoveryCode: string;
};
