import { IsString } from 'class-validator';

export class HeaderValidatorDto {
  @IsString()
  language: string;

  @IsString()
  auth_token: string;

  @IsString()
  device_id: string;

  @IsString()
  device_type: string;

  @IsString()
  app_version: string;

  @IsString()
  os: string;

  @IsString()
  device_token: string;
}
