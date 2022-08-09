import ObjectID from 'bson-objectid';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';

export const generateRecordId = () => new ObjectID().toString();

const saltOrRounds = 10;
export const encrypt = async (password: string) => {
  return await bcrypt.hash(password, saltOrRounds);
};

export const formatDatetime = (date = new Date()) => {
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
};

export const isMatch = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};
