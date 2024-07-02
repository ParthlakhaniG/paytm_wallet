import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;
@Injectable()
export class Hashing {
  async passwordHashing(password: string): Promise<any> {
    return await bcrypt.hash(password, saltOrRounds);
  }
  async passwordDecrypt(password: string, hash: string): Promise<any> {
    return await bcrypt.compare(password, hash);
  }
}
