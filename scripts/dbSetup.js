import '../config/env.js';
import pkg from 'pg';
import knexFileConfig from '../config/knexfile.js';

const { Client, Pool } = pkg;
const knexDbConfig = knexFileConfig.connection;

/**
 * Initialize the database
 */

const createDB = async () => {
    const dbConfig = JSON.parse(JSON.stringify(knexDbConfig));

    // To create a database, we need to connect to the default postgres database
    dbConfig.database = 'postgres';
    const client = new Client(dbConfig);

    dbConfig.database = knexDbConfig.database; // Reset the database name
    const query = `CREATE DATABASE ${dbConfig.database} WITH OWNER ${dbConfig.user}`;
    // console.log('Creating database:', query);

    let dbCreated = false;

    try {
        await client.connect();
        await client.query(query);
        console.log(`Database ${dbConfig.database} created successfully`);
        dbCreated = true;
    } catch (err) {
        console.log(err.message);
        if (err.message.includes('already exists')) dbCreated = true;
    }

    await client.end();
    return dbCreated;
};

/**
 * Initialize the schema
 */

const createSchema = async (pool) => {
    const query = `CREATE SCHEMA IF NOT EXISTS ${knexDbConfig.schema} AUTHORIZATION ${knexDbConfig.user}`;
    // console.log('Creating schema:', query);
    let schemaCreated = false;

    try {
        await pool.query(query);
        console.log(`Schema ${knexDbConfig.schema} created successfully`);
        schemaCreated = true;
    } catch (err) {
        console.log(err.message);
    }

    return schemaCreated;
};

const init = async () => {
    const dbCreated = await createDB();
    if (!dbCreated) return;

    const pool = new Pool(knexDbConfig);

    const schemaCreated = await createSchema(pool);
    if (!schemaCreated) return;

    await pool.end();
    console.log('Database setup completed');
};

init();