import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilService {
  constructor(private readonly mailerService: MailerService) {}

  sendOTPMail(toMail: any, otp: number): void {
    this.mailerService.sendMail({
      from: process.env.EMAIL,
      to: toMail,
      subject: `Transferior account verification`,
      html: `Your Transferior account verification OTP is ${otp}.`,
    });
  }
}
