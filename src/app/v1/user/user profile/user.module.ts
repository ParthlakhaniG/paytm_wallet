import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { AuthConfig } from 'src/config/config.config';
import { ResponseMessage } from 'src/common/response';
import { StatusCode } from 'src/common/statusCode';
import { HeaderValidator } from 'src/guard/headersValidation.guard';
import { Common } from 'src/common/common';
import { DataCodes } from 'src/common/dataCodes';
import { AuthTokenSchema } from 'src/schema/authToken.entity';
import { DeviceRelationSchema } from 'src/schema/deviceRelation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuthTokenSchema, DeviceRelationSchema])],
  controllers: [UserController],
  providers: [
    UserService,
    AuthConfig,
    ResponseMessage,
    StatusCode,
    HeaderValidator,
    Common,
    DataCodes,
  ],
})
export class UserModule {}
