import 'dotenv/config';

const APP_PORT = +process.env.APP_PORT || 4444;
const DB_HOST = process.env.DB_HOST || '';
const DB_USER = process.env.DB_USER || '';
const DB_PORT = +process.env.DB_PORT || 5432;
const DB_PASS = process.env.DB_PASS || '';
const DB_DATABASE = process.env.DB_DATABASE || '';
const MAX_POOL = +process.env.MAX_POOL || 75;

const JWT_SECRET = process.env.JWT_SECRET || '';
const EXPIRES_IN = process.env.EXPIRES_IN || '60s';

export {
  APP_PORT,
  DB_PORT,
  DB_USER,
  DB_HOST,
  MAX_POOL,
  DB_DATABASE,
  DB_PASS,
  JWT_SECRET,
  EXPIRES_IN,
};
