import { Injectable } from '@nestjs/common';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { expireDate, generateRecordId, randomString } from '@utils';

@Injectable()
export class RefreshTokenRepo {
  private table = 'refresh_tokens';

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async generate(user_id: string, knex = this.knex) {
    return await knex.transaction(async (trx) => {
      const [refresh] = await trx
        .insert(
          {
            id: generateRecordId(),
            user_id: user_id,
            token: randomString(64),
            expired_at: expireDate(),
          },
          ['id', 'token', 'expired_at'],
        )
        .into(this.table);

      return refresh;
    });
  }

  delete(id: string, knex = this.knex) {
    return knex
      .update(
        {
          is_deleted: true,
        },
        ['id'],
      )
      .from(this.table)
      .whereRaw(`id = '${id}'`);
  }

  findOne(token: string, user_id: string, knex = this.knex) {
    return knex
      .select('*')
      .from(this.table)
      .whereRaw(`token = '${token}'`)
      .whereRaw(`user_id = '${user_id}'`)
      .whereRaw(`is_deleted is false`)
      .first();
  }
}
