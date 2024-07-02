import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ResponseMessage } from 'src/common/response';
import { StatusCode } from 'src/common/statusCode';
import { AuthConfig } from 'src/config/config.config';
import { HeaderValidator } from '../headersValidation.guard';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthUserGuard implements CanActivate {
  constructor(
    public config: AuthConfig,
    private readonly reponseMessage: ResponseMessage,
    public readonly statusCode: StatusCode,
    private readonly headerValidator: HeaderValidator,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const error = this.headerValidator.validateHeaders(req.headers);
    if (error) {
      this.reponseMessage.error(
        res,
        'INVALID_REQUEST_HEADERS',
        req.headers.language,
      );
    } else {
      jwt.verify(
        req.headers.auth_token,
        this.config.jwtSecretKey,
        (error: any, decoded: any) => {
          console.log(`\n AuthValidation error ->> ${error} decoded ->> 
            ${JSON.stringify(decoded)}`);
          if (error) {
            if (error.name === 'TokenExpiredError' && req.skip) {
              const decoded = jwt.decode(req.headers.auth_token) as {
                user_id: string;
              } | null; //as { user_id: string } | null;
              console.log(
                `\n AuthValidation decoded ->> ${decoded} token ->> ${req.headers.auth_token}`,
              );
              req.user_id = decoded.user_id; //req.body.user_id = decoded.user_id;
              return true;
            } else {
              if (req.route.path === '/refreshToken') {
                return true;
              } else {
                this.reponseMessage.error(
                  res,
                  'TOKEN_EXPIRED',
                  req.headers.language,
                );
                return false;
              }
            }
          } else if (decoded && decoded.user_id) {
            req.user_id = decoded.user_id;
            console.log(
              '\n in auth gaurd req.user_id---------->>>>>>>>',
              req.user_id,
            );
            return true;
          } else {
            this.reponseMessage.error(
              res,
              'TOKEN_MALFORMED',
              req.headers.language,
            );
            return false;
          }
        },
      );
      return true;
    }
  }
}
