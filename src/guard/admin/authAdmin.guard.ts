import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ResponseMessage } from 'src/common/response';
import { StatusCode } from 'src/common/statusCode';
import { AuthConfig } from 'src/config/config.config';
import { HeaderValidator } from '../headersValidation.guard';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthAdminGuard implements CanActivate {
  constructor(
    public config: AuthConfig,
    private readonly reponseMessage: ResponseMessage,
    public readonly statusCode: StatusCode,
    private readonly headerValidator: HeaderValidator,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const error = this.headerValidator.validateAdminHeaders(req.headers);
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
          console.log(
            `\n AuthValidation error ->> ${error} decoded ->> ${JSON.stringify(
              decoded,
            )}`,
          );

          if (error) {
            if (error.name === 'TokenExpiredError' && req.skip) {
              const decoded = jwt.decode(req.headers.auth_token);
              console.log(
                `\n AuthValidation decoded ->> ${decoded} token ->> ${req.headers.auth_token}`,
              );
              req.body.user_id = decoded; //req.body.user_id = decoded.user_id;
            } else {
              if (req.route.path === '/refreshToken') {
              } else {
                this.reponseMessage.error(
                  res,
                  'TOKEN_EXPIRED',
                  req.headers.language,
                );
              }
            }
          } else if (decoded && decoded.user_id) {
            req.body.user_id = decoded.user_id;
            console.log('\n in auth gaurd req.body.user_id', req.body.user_id);
          } else {
            this.reponseMessage.error(
              res,
              'TOKEN_MALFORMED',
              req.headers.language,
            );
          }
        },
      );
    }
    return true;
  }
}
