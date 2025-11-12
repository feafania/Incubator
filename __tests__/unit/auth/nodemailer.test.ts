import { nodemailerService } from "../../../src/core/infrastructure/mailer/nodemailer.service";

describe("nodemailerService", () => {
  test("should send an email via Yandex SMTP", async () => {
    const result = await nodemailerService.sendEmail({
      email: "zspk292@yandex.ru", // укажы рэальны email для тэсту
      code: "12345",
      template: (code) => `<b>Your code: ${code}</b>`,
      subject: "Test Email from my app",
    });

    console.log("📨 Email sending result:", result);
    expect(result).toBe(true);
  });
});
