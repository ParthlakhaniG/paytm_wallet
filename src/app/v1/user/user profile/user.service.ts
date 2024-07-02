import {
  ConflictException,
  GoneException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as moment from 'moment';
import { SignUpUserDto } from './dto/userProfile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EditProfielUserDto } from './dto/editProfile.dto';
import { Common } from 'src/common/common';
import { LoginUserDto } from './dto/loginUser.dto';
import { OtpVerifyDto } from './dto/otpVerify.dto';
import { ResendOtpDto } from './dto/resendOtp.dto';
import { DeleteUserDto } from './dto/deleteUser.dto';

@Injectable()
export class UserService {
  utilService: any;
  constructor(
    @InjectRepository()
    private userRepository: Repository<>,
    @InjectRepository()
    private authTokenRepository: Repository<>,
    @InjectRepository()
    private deviceRelationRepository: Repository<>,
    private common: Common,
  ) {}

  date = moment().format('YYYY-MM-DD hh:mm:ss.SSS');

  getHello(): string {
    return 'Hello from paytm wallet (Nest Grocery)!';
  }

  async signUp(file: any, body: SignUpUserDto, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let { firstName, lastName, email } = body,
          image;
        const { mobileNumber } = body;

        firstName = firstName.trim();
        lastName = lastName.trim();
        email = email.toLowerCase();
        if (file) {
          image = file.originalname;
        } else {
          image = null;
        }

        let userDetail: any = await this.checkExistingEmail(email);
        if (userDetail && userDetail.isArchived == 1) {
          throw new ConflictException('EMAIL_ALREADY_EXISTS');
        }

        userDetail = await this.checkExistingMobile(mobileNumber);
        if (userDetail && userDetail.isArchived == 1) {
          throw new ConflictException('MOBILE_ALREADY_EXISTS');
        }
        if (!userDetail) {
          userDetail = await this.userRepository.save({
            firstName: firstName,
            lastName: lastName,
            email: email,
            mobileNumber: mobileNumber,
            image: image,
          });
        } else {
          throw new ConflictException('ALREADY_EXISTS');
        }

        /**---------------------accessToken-------------------------**/
        const token: any = await this.common.getJwtToken(userDetail.userId);
        if (!token) {
          throw new UnauthorizedException('TOKEN_NOT_FOUND');
        }

        const userAuth = await this.authTokenRepository.findOne({
          where: { fk_user_id: userDetail.userId },
        });
        console.log('\n user auth --->', userAuth);

        if (!userAuth) {
          await this.authTokenRepository.save({
            fk_user_id: userDetail.userId,
            accessToken: token,
          });
        } else {
          await this.authTokenRepository.update(
            { fk_user_id: userDetail.userId },
            { accessToken: token, updatedAt: this.date },
          );
        }

        /*****------------------device Relation-------------------------------------*****/
        const {
          language,
          device_id,
          device_type,
          app_version,
          os,
          device_token,
        } = headers;

        const userDevice = await this.deviceRelationRepository.findOne({
          where: {
            fk_user_id: userDetail.userId,
            deviceType: device_type,
            deviceId: device_id,
          },
        });
        if (!userDevice) {
          await this.deviceRelationRepository.save({
            fk_user_id: userDetail.userId,
            deviceType: device_type,
            deviceId: device_id,
            deviceToken: device_token,
            appVersion: app_version,
            os: os,
            language: language,
          });
        }

        return resolve({ accessToken: token });
      } catch (error) {
        console.log(`\n user signup service catch error ->> ${error}`);
        return reject(error);
      }
    });
  }

  async editProfile(file: any, body: EditProfielUserDto): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let { firstName, lastName, email } = body,
          image;
        const { user_id } = body; //const { user_id, mobileNumber } = body;

        firstName = firstName.trim();
        lastName = lastName.trim();
        email = email.toLowerCase();
        if (file) {
          image = file.originalname;
        } else {
          image = null;
        }

        const userDetail = await this.userRepository.findOne({
          where: { userId: user_id },
        });

        if (!userDetail) {
          throw new GoneException('DELETED_USER');
        } else if (
          userDetail.firstName == firstName &&
          userDetail.lastName == lastName &&
          userDetail.email == email &&
          userDetail.image == image
        ) {
          throw new ConflictException('ALREADY_EXISTS');
        } else {
          await this.userRepository.update(
            { userId: user_id },
            {
              firstName: firstName,
              lastName: lastName,
              email: email,
              image: image,
              updatedAt: this.date,
            },
          );
        }

        return resolve({});
      } catch (error) {
        console.log(`\n user edit profile service catch error ->> ${error}`);
        return reject(error);
      }
    });
  }

  async login(body: LoginUserDto): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const { mobileNumber } = body;

        let userDetail = await this.checkExistingMobile(mobileNumber);
        if (!userDetail) {
          throw new UnauthorizedException("MOBILE_DOSN'T_EXISTS");
        }

        const otp = await this.common.generateOTP(4);

        userDetail = await this.userRepository.update(
          { mobileNumber: mobileNumber },
          { otp: +otp },
        );

        return resolve({});
      } catch (error) {
        console.log(`\n user login service catch error ->> ${error}`);
        return reject(error);
      }
    });
  }

  async forgotPassword(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const { email } = body;
        const userDetails = await this.userRepository.findOne({
          where: { email: email.toLowerCase().trim(), isArchived: 1 },
        });
        if (!userDetails) {
          throw {
            message: 'USER_NOT_FOUND',
            statusCode: 403,
          };
        }

        const otp = parseInt(this.common.generateOTP(4));
        console.log('otp', otp, userDetails.userId);
        await this.utilService.sendOTPMail(email, otp);

        return resolve({});
      } catch (error) {
        console.log(`\n forgot password service catch error ->> ${error}`);
        return reject(error);
      }
    });
  }

  async otpVerify(body: OtpVerifyDto, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const { mobileNumber, otp } = body;

        const userDetail = await this.userRepository.findOne({
          where: { mobileNumber: mobileNumber, otp: otp, isArchived: 1 },
        });

        if (!userDetail) {
          throw new UnauthorizedException('USER_INVALID_OTP');
        }
        await this.userRepository.update(
          { mobileNumber: mobileNumber, otp: otp, isArchived: 1 },
          { otp: null },
        );

        /*------------------------deviceRelation-------------------------*/
        const {
          language,
          device_id,
          device_type,
          app_version,
          os,
          device_token,
        } = headers;

        const userDevice = await this.deviceRelationRepository.findOne({
          where: {
            fk_user_id: userDetail.userId,
            deviceType: device_type,
            deviceId: device_id,
          },
        });
        if (!userDevice) {
          await this.deviceRelationRepository.save({
            fk_user_id: userDetail.userId,
            deviceType: device_type,
            deviceId: device_id,
            deviceToken: device_token,
            appVersion: app_version,
            os: os,
            language: language,
          });
        } else if (
          userDevice.deviceType == device_type &&
          userDevice.deviceId == device_id
        ) {
          await this.deviceRelationRepository.update(
            { deviceType: device_type, deviceId: device_id },
            {
              fk_user_id: userDetail.userId,
              deviceType: device_type,
              deviceId: device_id,
              deviceToken: device_token,
              appVersion: app_version,
              os: os,
              language: language,
            },
          );
        } else {
          await this.deviceRelationRepository.save({
            fk_user_id: userDetail.userId,
            deviceType: device_type,
            deviceId: device_id,
            deviceToken: device_token,
            appVersion: app_version,
            os: os,
            language: language,
          });
        }

        /*------------------------access Token-------------------------*/
        const token: any = await this.common.getJwtToken(userDetail.userId);
        if (!token) {
          throw new UnauthorizedException('TOKEN_NOT_FOUND');
        }

        const userAuth = await this.authTokenRepository.findOne({
          where: { fk_user_id: userDetail.userId },
        });
        console.log('\n user auth --->', userAuth);

        if (!userAuth) {
          await this.authTokenRepository.save({
            fk_user_id: userDetail.userId,
            accessToken: token,
          });
        } else {
          await this.authTokenRepository.update(
            { fk_user_id: userDetail.userId },
            { accessToken: token, updatedAt: this.date },
          );
        }

        return resolve({
          accessToken: token,
        });
      } catch (error) {
        console.log(`\n user otp verify service catch error ->> ${error}`);
        return reject(error);
      }
    });
  }

  async resendOtp(body: ResendOtpDto): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const { mobileNumber } = body;

        let userDetail = await this.checkExistingMobile(mobileNumber);
        if (!userDetail) {
          throw new UnauthorizedException("MOBILE_DOSN'T_EXISTS");
        }

        const otp = await this.common.generateOTP(4);

        userDetail = await this.userRepository.update(
          { mobileNumber: mobileNumber },
          { otp: +otp },
        );

        return resolve({});
      } catch (error) {
        console.log(`\n user resend otp service catch error ->> ${error}`);
        return reject(error);
      }
    });
  }

  async deleteUser(body: DeleteUserDto): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const { user_id } = body;

        const userDetail = await this.userRepository.findOne({
          where: { userId: user_id, isArchived: 1 },
        });

        if (!userDetail) {
          throw new ConflictException('USER_NOT_FOUNDED');
        } else {
          await this.userRepository.update(
            { userId: user_id },
            { isArchived: 0 },
          );
        }

        return resolve({});
      } catch (error) {
        console.log(`\n delete user service catch error ->> ${error}`);
        return reject(error);
      }
    });
  }

  async checkExistingEmail(email: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.userRepository.findOne({
          where: { email: email },
          select: ['userId', 'isArchived'],
        });
        return resolve(user);
      } catch (error) {
        return reject(error);
      }
    });
  }

  async checkExistingMobile(mobile: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.userRepository.findOne({
          where: { mobileNumber: mobile, isArchived: 1 },
          select: ['userId', 'isArchived'],
        });
        return resolve(user);
      } catch (error) {
        return reject(error);
      }
    });
  }
}
