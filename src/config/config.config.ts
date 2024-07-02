import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthConfig {
  appVersion = '1.0.0';
  web_app_version = '1.0.0';

  awsSecretKey = 'secretCode';

  jwtSecretKey = 'secretCode';
  jwtExpiryUserTime = 36000;
  jwtExpiryAdminTime = 10000; //ml //1 second = 1000 milisecond

  s3Url = 'https://transferior-bucket.s3.amazonaws.com/';

  defaultAuthToken =
    '@#Slsjpoq$S1o08#MnbAiB%UVUV&Y*5EU@exS1o!08L9TSlsjpo#FKDFJSDLFJSDLFJSDLFJSDQY';
  defaultRefreshToken =
    'FKDFJSDLFJSDLFJSDLFJSDjmLVF6G9Aarypa9y5AhG3JpwQXanNRWBgaaTfU3dQY';
}
