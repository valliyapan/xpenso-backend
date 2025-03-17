import knex from 'knex';
import knexFileConfig from './knexfile.js';


const dbConfig = knexFileConfig;
const db = knex(dbConfig);

// check the database connection

db.raw('SELECT 1')
.then((resp) => {
  // console.log(resp.rows[0]);
  console.log('Database connection established');
})
.catch((err) => {
  console.error(err);
  process.exit(1);
});

export default db;