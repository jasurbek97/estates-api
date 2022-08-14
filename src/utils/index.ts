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

export const expireTime = (minutes = 5) => {
  const date = new Date();
  const m = date.getMinutes() + minutes;
  date.setMinutes(m);
  return date;
};
export const expireDate = (day = 10) => {
  const date = new Date();
  const m = date.getDate() + day;
  date.setDate(m);
  return date;
};

export const isMatch = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export function randomNumber(min = 100000, max = 999999) {
  return ~~(Math.random() * (max - min) + min);
}

export const randomString = (() => {
  const gen = (min, max) =>
    max++ && [...Array(max - min)].map((s, i) => String.fromCharCode(min + i));
  const sets = {
    num: gen(48, 57),
    alphaLower: gen(97, 122),
    alphaUpper: gen(65, 90),
    special: [...`~!@#$%^&*()_+-=`],
  };

  function* iter(len, set) {
    if (set.length < 1) set = Object.values(sets).flat();
    for (let i = 0; i < len; i++) yield set[(Math.random() * set.length) | 0];
  }

  return Object.assign(
    (len, ...set) => [...iter(len, set.flat())].join(''),
    sets,
  );
})();

export const encodePhone = (phone: string) => {
  return phone.slice(0, 3) + '******' + phone.slice(-3);
};

export const compareTwoDate = (date: string): boolean => {
  return new Date(date) > new Date();
};

export const dateDiff = (date: string, date2 = new Date()): number => {
  const now = moment(date2);
  const end = moment(date);
  const duration = moment.duration(end.diff(now));
  return ~~duration.asMinutes();
};
