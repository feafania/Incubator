import nodemailer from "nodemailer";
import { SETTINGS } from "../../settings/settings";

export const nodemailerService = {
  async sendEmail({
    email,
    code,
    template,
    subject,
  }: {
    email: string;
    code: string;
    template: (code: string) => string;
    subject: string;
  }): Promise<boolean> {
    let transporter = nodemailer.createTransport({
      // service: "gmail",
      host: SETTINGS.SMTP_HOST, // напрыклад: "smtp.yourdomain.com"
      port: SETTINGS.SMTP_PORT, // звычайна 465 (SSL) або 587 (TLS)
      secure: SETTINGS.SMTP_SECURE, // true — калі порт 465, false — калі 587
      auth: {
        user: SETTINGS.EMAIL,
        pass: SETTINGS.EMAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: `"No Reply" <${SETTINGS.EMAIL}>`,
      to: email,
      subject,
      html: template(code), // html body
    });

    console.log("Message sent: %s", info.messageId);
    return !!info;
  },
};
