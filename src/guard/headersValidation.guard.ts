import { AuthConfig } from 'src/config/config.config';
import * as semver from 'semver';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HeaderValidator {
  constructor(private config: AuthConfig) {}

  validateHeaders(headers: any) {
    let error: any;

    if (!headers.language) {
      error = {
        param: 'language',
        type: 'required',
      };
    } else if (!headers.auth_token) {
      error = {
        param: 'auth_token',
        type: 'required',
      };
    } else if (!headers.device_id) {
      /* else if (!headers.web_app_version) {
       } */
      error = {
        param: 'device_id',
        type: 'required',
      };
    } else if (!headers.device_type) {
      error = {
        param: 'device_type',
        type: 'required',
      }; //'0' for IOS ,'1' for android
    } else if (!headers.app_version) {
      error = {
        param: 'app_version_missing',
        type: 'required',
      };
    } else if (!headers.os) {
      error = {
        param: 'os',
        type: 'required',
      };
    } else if (!headers.device_token) {
      error = {
        param: 'device_token',
        type: 'required',
      };
    } else {
      let version = headers.app_version;
      const currentAppVersion = this.config.appVersion;
      let tmp_version = version.split('.');
      tmp_version =
        tmp_version.length < 3
          ? tmp_version.concat(['0', '0', '0'])
          : tmp_version;
      tmp_version.splice(3);
      version = tmp_version.join('.');

      if (semver.valid(version) === null) {
        error = 'INVALID_APP_VERSION';
      } else {
        if (semver.satisfies(version, `>= ${currentAppVersion}`)) {
        } else {
          error = 'UPGRADE_APP';
        }
      }
    }
    return error;
  }

  validateAdminHeaders(headers: any) {
    let error: any;
    if (!headers.auth_token) {
      error = {
        param: 'auth_token',
        type: 'required',
      };
    }
    return error;
  }
}
