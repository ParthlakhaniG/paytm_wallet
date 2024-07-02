import { Injectable } from '@nestjs/common';

@Injectable()
export class StatusCode {
  'success' = 200;
  'error' = 400;
  'created' = 201;
}
