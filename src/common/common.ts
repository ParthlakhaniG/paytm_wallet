import * as jwt from 'jsonwebtoken';
import { AuthConfig } from 'src/config/config.config';
import { DataCodes } from './dataCodes';
import { Inject } from '@nestjs/common';

export class Common {
  constructor(
    @Inject(AuthConfig) private config: AuthConfig,
    private dataCodes: DataCodes,
  ) {}

  parseJSON(data: any) {
    if (typeof data == 'object') {
      return data;
    }

    try {
      return JSON.parse(data);
    } catch (err) {
      return {};
    }
  }

  getFinalData(event: any, data: any, statusCode: any) {
    if (!statusCode) statusCode = '200';

    statusCode = statusCode.toString();

    if (!data) data = {};

    const statusCodeDetails = this.dataCodes[statusCode]
      ? this.dataCodes[statusCode]
      : this.dataCodes['200'];

    const finalData = {
      code: statusCode,
      error: statusCodeDetails.IsError,
      message: statusCodeDetails.Message,
      event: event,
      data: data,
    };

    return finalData;
  }

  getJwtToken(user_id: any) {
    return new Promise((resolve, reject) => {
      try {
        const expirationTime = user_id
          ? this.config.jwtExpiryAdminTime
          : this.config.jwtExpiryUserTime;
        const sign = { user_id };

        const token = jwt.sign(sign, this.config.jwtSecretKey, {
          expiresIn: expirationTime,
        });
        return resolve(token);
      } catch (error) {
        return reject(error);
      }
    });
  }

  generateOTP(n: any) {
    const digits = '0123456789';
    let otp = '';

    for (let i = 0; i < n; i++) {
      const index = Math.floor(Math.random() * digits.length);

      if (i == 0 && !parseInt(digits[index])) i--;
      else otp += digits[index];
    }

    return otp;
  }

  couponAmount(min: any, max: any) {
    const discountAmount = Math.floor(Math.random() * (max - min + 1)) + min;
    return discountAmount;
  }
}
