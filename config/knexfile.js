import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env')});

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

const commonConfig = {
  client: 'pg',
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: '../migrations',
    tableName: 'knex_migrations',
    schemaName: process.env.SCHEMA,
  },
  searchPath: process.env.SCHEMA, // set search_path to schema
};

const config = {
  development: {
    connection: {
      host: process.env.DEV_DB_HOST,
      user: process.env.DEV_DB_USER,
      password: process.env.DEV_DB_PASSWORD,
      database: process.env.DEV_DB_NAME,
      port: process.env.DEV_DB_PORT,
      schema: process.env.SCHEMA,
    },
    ...commonConfig
  },
  staging: {
    connection: {
      host: process.env.STAGE_DB_HOST,
      user: process.env.STAGE_DB_USER,
      password: process.env.STAGE_DB_PASSWORD,
      database: process.env.STAGE_DB_NAME,
      port: process.env.STAGE_DB_PORT,
      schema: process.env.SCHEMA,
    },
    ...commonConfig
  },
  production: {
    connection: {
      host: process.env.PROD_DB_HOST,
      user: process.env.PROD_DB_USER,
      password: process.env.PROD_DB_PASSWORD,
      database: process.env.PROD_DB_NAME,
      port: process.env.PROD_DB_PORT,
      schema: process.env.SCHEMA,
    },
    ...commonConfig
  }
};

const environment = process.env.NODE_ENV || 'development';
export default config[environment];
