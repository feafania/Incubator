import { RegisterUserCommand } from "./command-handlers/registration-commands";
import { UsersRepository } from "../../users/repositories/users.repository";
import { nodemailerService } from "../../../core/infrastructure/mailer/nodemailer.service";
import { emailTemplates } from "../../../core/infrastructure/mailer/email-templates";
import { emailSubjects } from "../../../core/infrastructure/mailer/email-subjects";
import { UsersService } from "../../users/application/users.service";
import { ResendEmailCommand } from "./command-handlers/resend-email-commands";
import { ConfirmRegistrationCommand } from "./command-handlers/registration-confirmation-commands";
import { BadRequestError } from "../../../core/errors/bad-request.error";
import { randomUUID } from "node:crypto";

export class AuthService {
  private usersService: UsersService;
  private usersRepository: UsersRepository;
  constructor(usersService?: UsersService, usersRepository?: UsersRepository) {
    this.usersService = usersService ?? new UsersService();
    this.usersRepository = usersRepository ?? new UsersRepository();
  }

  async registerUser(command: RegisterUserCommand): Promise<void> {
    const { login, password, email } = command;

    const userId = await this.usersService.create({ login, password, email });
    if (!userId) throw new Error("Error creating user");
    const newUser = await this.usersRepository.findByIdOrFail(userId);

    const registrationEmail = {
      email: newUser.email,
      template: emailTemplates.registrationEmail,
      code: newUser.emailConfirmation.confirmationCode,
      subject: emailSubjects.registration,
    };
    // setImmediate(async () => {
    try {
      await nodemailerService.sendEmail(registrationEmail);
    } catch (error) {
      console.error("Error sending email:", error);
      await this.usersRepository.delete(userId);
    }
    // });
  }

  async resendEmail(command: ResendEmailCommand): Promise<void> {
    const { id: userId } = command;

    const user = await this.usersRepository.findByIdOrFail(userId);
    if (!user) throw new BadRequestError("User not found", "email");
    user.emailConfirmation.confirmationCode = randomUUID();
    await this.usersRepository.save(user);

    const resendingEmailConfirmation = {
      email: user.email,
      template: emailTemplates.registrationEmail,
      code: user.emailConfirmation.confirmationCode,
      subject: emailSubjects.registration,
    };
    // setImmediate(async () => {
    try {
      await nodemailerService.sendEmail(resendingEmailConfirmation);
    } catch (error) {
      console.error("Error resending email:", error);
    }
    // });
  }

  async confirmRegistrationCode(
    command: ConfirmRegistrationCommand,
  ): Promise<void> {
    const { id: userId } = command;

    const user = await this.usersRepository.findByIdOrFail(userId);
    if (!user) throw new BadRequestError("User not found", "code");
    user.emailConfirmation = {
      ...user.emailConfirmation,
      isConfirmed: true,
    };

    await this.usersRepository.save(user);
  }
}

const authService = new AuthService();

export default authService;
