import { Injectable } from '@nestjs/common';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import {
  expireTime,
  generateRecordId,
  randomNumber,
  randomString,
} from '@utils';

@Injectable()
export class OneTimeCodesRepo {
  private table = 'one_time_codes';

  constructor(@InjectConnection() private readonly knex: Knex) {}

  generate(user_id: string, knex = this.knex) {
    return knex
      .insert(
        {
          id: generateRecordId(),
          user_id: user_id,
          otp: randomNumber(),
          code: randomString(64),
          expired_at: expireTime(),
        },
        ['id', 'otp', 'code'],
      )
      .into(this.table);
  }

  findOne(code: string, knex = this.knex) {
    return knex
      .select('*')
      .from(this.table)
      .whereRaw(`code = '${code}'`)
      .whereRaw(`is_deleted is false`)
      .first();
  }

  getOne(code: string, knex = this.knex) {
    return knex
      .select('*')
      .from(this.table)
      .whereRaw(`code = '${code}'`)
      .first();
  }

  delete(code: string, knex = this.knex) {
    return knex
      .update({ is_deleted: true })
      .from(this.table)
      .whereRaw(`code = '${code}'`)
      .whereRaw(`is_deleted is false`);
  }
}
