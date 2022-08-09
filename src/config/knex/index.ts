import { Injectable } from '@nestjs/common';
import { KnexModuleOptions } from 'nest-knexjs/dist/interfaces/knex-options.interface';
import { KnexOptionsFactory } from 'nest-knexjs/dist/interfaces/knex-options-factory.interface';
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASS,
  DB_PORT,
  DB_USER,
  MAX_POOL,
} from '@env';
import { Knex } from 'knex';

@Injectable()
export class KnexConfigService implements KnexOptionsFactory {
  createKnexOptions(): Promise<KnexModuleOptions> | KnexModuleOptions {
    return {
      config: {
        client: 'postgresql',
        connection: {
          host: DB_HOST,
          user: DB_USER,
          port: DB_PORT,
          password: DB_PASS,
          database: DB_DATABASE,
        },
        pool: {
          min: 1,
          max: MAX_POOL,
        },
      } as Knex.Config,
      retryAttempts: 10,
      retryDelay: 10,
    };
  }
}
