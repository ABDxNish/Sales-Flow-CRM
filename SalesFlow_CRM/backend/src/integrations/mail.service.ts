import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer = require('nodemailer');

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  private transporter?: ReturnType<typeof nodemailer.createTransport>;

  constructor(private readonly config: ConfigService) {
    const user = this.config.get<string>('MAIL_USER');
    const pass = this.config.get<string>('MAIL_PASSWORD');

    if (!user || !pass) {
      this.logger.warn(
        'Mailer is disabled. MAIL_USER or MAIL_PASSWORD is missing.',
      );
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('MAIL_HOST') || 'smtp.gmail.com',
      port: Number(this.config.get<string>('MAIL_PORT') || 587),
      secure: false,
      auth: {
        user,
        pass,
      },
    });

    this.logger.log(`Mailer initialized for ${user}`);
  }

  async send(to: string, subject: string, text: string) {
    if (!this.transporter) {
      this.logger.warn(`Email skipped for ${to}: Mailer is not configured.`);
      return;
    }

    try {
      const info = await this.transporter.sendMail({
        from:
          this.config.get<string>('MAIL_FROM') ||
          this.config.get<string>('MAIL_USER'),
        to,
        subject,
        text,
      });

      this.logger.log(
        `Email sent successfully to ${to}. Message ID: ${info.messageId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${to}`,
        error instanceof Error ? error.stack : String(error),
      );

      throw error;
    }
  }
}