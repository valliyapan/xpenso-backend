/**
 * This file is used to connect to the database
 * This db connection will be used by all of the model files
 */

import knex from 'knex';
import knexFileConfig from './knexfile.js';

const dbConfig = knexFileConfig;
const db = knex(dbConfig);

(async () => {
  try {
    const resp = await db.raw(`SELECT current_schema();`);
    console.log('Current Schema:', resp.rows[0]);
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1); // Exit if DB connection fails
  }
})();

export default db;