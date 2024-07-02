import { IsDefined, IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  @IsDefined()
  @IsNotEmpty()
  email: string;
}
