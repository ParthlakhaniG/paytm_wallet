import { AuthConfig } from 'src/config/config.config';
import { ResponseMessage } from 'src/common/response';
import { StatusCode } from 'src/common/statusCode';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { HeaderValidator } from '../headersValidation.guard';

@Injectable()
export class NonAuthUserGuard implements CanActivate {
  constructor(
    public config: AuthConfig,
    private readonly reponseMessage: ResponseMessage,
    public readonly statusCode: StatusCode,
    private readonly headerValidator: HeaderValidator,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const default_token = this.config.defaultAuthToken;
    const error = this.headerValidator.validateHeaders(req.headers);

    if (error) {
      this.reponseMessage.error(res, error, req.headers.language);
    } else if (req.headers.auth_token !== this.config.defaultAuthToken) {
      if (default_token != req.headers.auth_token) {
        console.log(
          'req.headers.auth_token----------->',
          req.headers.auth_token,
        );
        this.reponseMessage.error(res, 'INVALID_TOKEN', req.headers.language);
      } else {
        console.log(`\n Non Auth user Validation next ->>`, req.body);
        return true;
      }
    }
    return true;
  }
}
