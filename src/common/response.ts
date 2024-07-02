import * as messages from '../common/message.json';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseMessage {
  async error(
    res: any,
    msg: string,
    language: any,
    statusCode = 400,
  ): Promise<any> {
    const response = {
      code: 0,
      status: 'FAIL',
      message: this.getMessage(msg, language)
        ? this.getMessage(msg, language)
        : msg,
    };

    if (msg == 'USER_BLOCKED') statusCode = 403;

    if (msg == 'TOKEN_EXPIRED') statusCode = 401;

    if (msg === 'UPGRADE_APP') statusCode = 403;

    if (parseInt(process.env.ENCRYPTION)) {
      // response = {encryptedData: await crypt.encryption(response)}
    }
    res.status(statusCode).json(response);
  }

  async success(
    res: any,
    msg: string,
    language: any,
    data: any,
    statusCode = 200,
  ): Promise<any> {
    const response = {
      code: 1,
      status: 'SUCCESS',
      message: this.getMessage(msg, language),
      data: data ? data : {},
    };

    if (parseInt(process.env.ENCRYPTION)) {
      // response = {encryptedData : await crypt.encryption(response)}
    }
    res.status(statusCode).json(response);
  }

  getMessage(msg: any, language: any): Promise<any> {
    const lang = language ? language : 'en';

    // console.log('lang -- ---------->',lang , typeof lang,msg ,typeof msg , messages);

    if (msg.param && msg.param.includes('email')) {
      msg.param = 'email';
    }

    if (msg.type && msg.type.includes('and')) {
      return msg.message;
    }

    if (msg.param && msg.type) {
      if (msg.type.includes('required')) {
        return messages[lang]['PARAMETERS_REQUIRED'].replace(
          '@Parameter@',
          msg.param,
        );
      } else if (msg.type.includes('min')) {
        return msg.message;
      } else {
        return messages[lang]['INVALID_REQUEST_DATA'].replace(
          '@Parameter@',
          msg.param,
        );
      }
    } else if (msg.toString().includes('ReferenceError:')) {
      return messages[lang]['INTERNAL_SERVER_ERROR'];
    } else {
      return messages[lang][msg] || messages[lang]['SOMETHING_WENT_WRONG'];
    }
  }
}
