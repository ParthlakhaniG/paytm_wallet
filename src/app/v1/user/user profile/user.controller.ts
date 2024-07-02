import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseMessage } from 'src/common/response';
import { StatusCode } from 'src/common/statusCode';
import { SignUpUserDto } from './dto/userProfile.dto';
import { NonAuthUserGuard } from 'src/guard/user/nonAuthUser.guard';
import { EditProfielUserDto } from './dto/editProfile.dto';
import { AuthUserGuard } from 'src/guard/user/authUser.guard';
import { LoginUserDto } from './dto/loginUser.dto';
import { OtpVerifyDto } from './dto/otpVerify.dto';
import { ResendOtpDto } from './dto/resendOtp.dto';
import { DeleteUserDto } from './dto/deleteUser.dto';
import { ForgotPasswordDto } from './dto/forgetPassword.dto';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/multer';

@Controller({ path: '/user', version: '1' })
@UsePipes(ValidationPipe)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly reponseMessage: ResponseMessage,
    private readonly statusCode: StatusCode,
  ) {}

  @Get('/')
  async getHello(): Promise<any> {
    return this.userService.getHello();
  }

  @Post('/signUp')
  @UseGuards(NonAuthUserGuard)
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async signUp(
    @Req() req: any,
    @Res() res: Response,
    @UploadedFile() image: Express.Multer.File,
    @Body() body: SignUpUserDto,
  ): Promise<any> {
    try {
      const data = await this.userService.signUp(req.file, body, req.headers);
      this.reponseMessage.success(
        res,
        'USER_REGISTRATION_SUCCESS',
        req.headers.language,
        data,
        this.statusCode.created,
      );
    } catch (error) {
      console.log(`\n user sign up controller signup error ${error}`, error);

      if (error.message) {
        this.reponseMessage.error(
          res,
          error.message,
          req.headers.language,
          error.statusCode ? error.statusCode : 403,
        );
      } else {
        this.reponseMessage.error(
          res,
          error,
          req.headers.language,
          this.statusCode.error,
        );
      }
    }
  }

  @Put('/editProfile')
  @UseGuards(AuthUserGuard)
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async editProfile(
    @Req() req: any,
    @Res() res: Response,
    @UploadedFile() image: Express.Multer.File,
    @Body() body: EditProfielUserDto,
  ): Promise<any> {
    try {
      if (req.user_id) {
        body.user_id = req.user_id;
      }
      const data = await this.userService.editProfile(req.file, body);
      this.reponseMessage.success(
        res,
        'EDIT_PROFILE_SUCCESS',
        req.headers.language,
        data,
        this.statusCode.success,
      );
    } catch (error) {
      console.log(`\n user edit profile controller error ${error}`, error);

      if (error.message) {
        this.reponseMessage.error(
          res,
          error.message,
          req.headers.language,
          error.statusCode ? error.statusCode : 403,
        );
      } else {
        this.reponseMessage.error(
          res,
          error,
          req.headers.language,
          this.statusCode.error,
        );
      }
    }
  }

  @Post('/login')
  @UseGuards(NonAuthUserGuard)
  async login(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: LoginUserDto,
  ): Promise<any> {
    try {
      const data = await this.userService.login(body);
      this.reponseMessage.success(
        res,
        'LOGIN_SUCCESS',
        req.headers.language,
        data,
        this.statusCode.success,
      );
    } catch (error) {
      console.log(`\n user login controller error ${error}`, error);

      if (error.message) {
        this.reponseMessage.error(
          res,
          error.message,
          req.headers.language,
          error.statusCode ? error.statusCode : 403,
        );
      } else {
        this.reponseMessage.error(
          res,
          error,
          req.headers.language,
          this.statusCode.error,
        );
      }
    }
  }

  @Post('/forgotPassword')
  @UseGuards(NonAuthUserGuard)
  @UsePipes(ValidationPipe)
  async forgotPassword(
    @Body() body: ForgotPasswordDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<any> {
    try {
      const data = await this.userService.forgotPassword(req.body);
      this.reponseMessage.success(
        res,
        'OTP_SENT_EMAIL',
        req.headers.language,
        data,
        this.statusCode.success,
      );
    } catch (error) {
      console.log(`\n forgot password controller login error ${error}`, error);

      if (error.message) {
        this.reponseMessage.error(
          res,
          error.message,
          req.headers.language,
          error.statusCode ? error.statusCode : 403,
        );
      } else {
        this.reponseMessage.error(
          res,
          error,
          req.headers.language,
          this.statusCode.error,
        );
      }
    }
  }

  @Post('/otpVerify')
  @UseGuards(NonAuthUserGuard)
  async otpVerify(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: OtpVerifyDto,
  ): Promise<any> {
    try {
      const data = await this.userService.otpVerify(body, req.headers);
      this.reponseMessage.success(
        res,
        'OTP_VERIFIED',
        req.headers.language,
        data,
        this.statusCode.success,
      );
    } catch (error) {
      console.log(`\n user otp verify controller error ${error}`, error);

      if (error.message) {
        this.reponseMessage.error(
          res,
          error.message,
          req.headers.language,
          error.statusCode ? error.statusCode : 403,
        );
      } else {
        this.reponseMessage.error(
          res,
          error,
          req.headers.language,
          this.statusCode.error,
        );
      }
    }
  }

  @Post('/resendOtp')
  @UseGuards(NonAuthUserGuard)
  async resendOtp(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: ResendOtpDto,
  ): Promise<any> {
    try {
      const data = await this.userService.resendOtp(body);
      this.reponseMessage.success(
        res,
        'RESEND_OTP',
        req.headers.language,
        data,
        this.statusCode.success,
      );
    } catch (error) {
      console.log(`\n user resend otp controller error ${error}`, error);

      if (error.message) {
        this.reponseMessage.error(
          res,
          error.message,
          req.headers.language,
          error.statusCode ? error.statusCode : 403,
        );
      } else {
        this.reponseMessage.error(
          res,
          error,
          req.headers.language,
          this.statusCode.error,
        );
      }
    }
  }

  @Delete('/deleteUser')
  @UseGuards(AuthUserGuard)
  async deleteUser(
    @Req() req: any,
    @Res() res: Response,
    @Body() body: DeleteUserDto,
  ): Promise<any> {
    try {
      if (req.user_id) {
        body.user_id = req.user_id;
      }
      const data = await this.userService.deleteUser(body);
      this.reponseMessage.success(
        res,
        'DELETE_USER',
        req.headers.language,
        data,
        this.statusCode.success,
      );
    } catch (error) {
      console.log(`\n delete user controller error ${error}`, error);

      if (error.message) {
        this.reponseMessage.error(
          res,
          error.message,
          req.headers.language,
          error.statusCode ? error.statusCode : 403,
        );
      } else {
        this.reponseMessage.error(
          res,
          error,
          req.headers.language,
          this.statusCode.error,
        );
      }
    }
  }
}
