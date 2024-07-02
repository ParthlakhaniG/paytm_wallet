import { Module } from '@nestjs/common';
import { UserModule } from './app/v1/user/user profile/user.module';
import { AuthConfig } from './config/config.config';
import { DataCodes } from './common/dataCodes';
import { UtilService } from './utils/utils.service';
import { MailerrModule } from './utils/mailer';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoConfig } from './config/mongodb.config';

@Module({
  imports: [
    MongooseModule.forRootAsync({ useClass: MongoConfig }),
    UserModule,
    MailerrModule,
  ],
  controllers: [],
  providers: [AuthConfig, DataCodes, UtilService],
})
export class AppModule {}
