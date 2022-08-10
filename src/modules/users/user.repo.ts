import { Injectable } from '@nestjs/common';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { UserInterface } from './interfaces/user.interface';
import { expireTime, formatDatetime, generateRecordId } from '../../utils';

@Injectable()
export class UserRepo {
  private table = 'users';

  constructor(@InjectConnection() private readonly knex: Knex) {}

  create(data: UserInterface, knex = this.knex) {
    return knex
      .insert(
        {
          id: generateRecordId(),
          created_at: formatDatetime(),
          ...data,
        },
        ['id', 'phone', 'is_verified', 'verification_attempt'],
      )
      .into(this.table);
  }

  findOne(phone: string, knex = this.knex) {
    return knex
      .select('*')
      .from(this.table)
      .whereRaw(`phone = '${phone}'`)
      .first();
  }

  findById(id: string, knex = this.knex) {
    return knex.select('*').from(this.table).whereRaw(`id = '${id}'`).first();
  }

  verifyUser(id: string, knex = this.knex) {
    return knex
      .update({ is_verified: true }, '*')
      .from(this.table)
      .whereRaw(`id = '${id}'`);
  }

  setAttempt(id: string, attempt: number, knex = this.knex) {
    const data = { verification_attempt: attempt, blocked_at: null };
    if (attempt > 3) {
      data.blocked_at = expireTime(10);
    } else if (attempt === 1) {
      data.blocked_at = null;
    }
    return knex.update(data, '*').from(this.table).whereRaw(`id = '${id}'`);
  }
}
