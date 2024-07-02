import { Injectable } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import 'dotenv/config';

@Injectable()
export class MongoConfig implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: process.env.URI,
      dbName: process.env.DBNAME,
    };
  }
}

export class MongooModule {}
