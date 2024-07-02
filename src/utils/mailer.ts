import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import 'dotenv/config';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        secure: true, // true for 465, false for other ports
        service: 'gmail',
        auth: {
          user: process.env.SMTP_EMAIL, // generated ethereal user
          pass: process.env.SMTP_PASSWORD, // generated ethereal password
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
    }),
  ],
})
export class MailerrModule {}
