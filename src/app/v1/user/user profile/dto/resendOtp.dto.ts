import { IsString, Matches } from 'class-validator';

export class ResendOtpDto {
  @IsString()
  @Matches(/^[+]{1}(?:[0-9\-\\(\\)\\/.]\s?){6,15}[0-9]{1}$/, {
    message: 'must be a valid number',
  })
  mobileNumber: string;
}
