import knexfile from '../config/knexfile.js';
const dbConfig = knexfile.connection;

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up (knex) {

  console.log('** Starting migration **');

  let resp = await knex.raw(`
    SELECT current_database();
  `);

  console.log(resp.rows[0]);

  await knex.raw(`
    SET search_path TO ${dbConfig.schema};
  `);

  resp = await knex.raw(`
    SELECT current_schema();
  `);

  console.log(resp.rows[0]);

  await knex.schema
  .createTable('users', (table) => {
    table.specificType('id', 'INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1)');
    table.string('name').notNullable();
    table.string('password').notNullable();
    table.string('email').notNullable().unique();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
  .createTable('accounts', (table) => {
    table.string('account_no').notNullable();
    table.string('bank_name').notNullable();
    table.integer('user_id').notNullable();
    table.specificType('balance', 'MONEY').notNullable().defaultTo(0);
    table.date('last_sync');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('update_at').defaultTo(knex.fn.now());
    table.foreign('user_id', 'fk_accounts_user').references('id').inTable('users').onDelete('CASCADE');
    table.primary(['bank_name', 'account_no']);
  })
  .createTable('categories', (table) => {
    table.specificType('id', 'INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1)');
    table.string('name').notNullable();
  })
  .createTable('expenses', (table) => {
    table.specificType('id', 'BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1)');
    table.integer('user_id').notNullable();
    table.text('bank_name').notNullable();
    table.string('account_no').notNullable();
    table.date('expense_date').notNullable().defaultTo(knex.raw('CURRENT_DATE'));
    table.integer('category_id').notNullable();
    table.specificType('amount', 'MONEY').notNullable();
    table.string('name').notNullable();
    table.string('comment').notNullable();
    table.string('debit_to');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.foreign('user_id', 'fk_expenses_user').references('id').inTable('users').onDelete('CASCADE');
    table.foreign(['bank_name', 'account_no'], 'fk_expenses_account').references(['bank_name', 'account_no']).inTable('accounts').onDelete('CASCADE').onUpdate('CASCADE');
    table.foreign('category_id', 'fk_expenses_category').references('id').inTable('categories').onDelete('CASCADE');
  })
  .createTable('credits', (table) => {
    table.specificType('id', 'BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1)');
    table.integer('user_id').notNullable();
    table.text('bank_name').notNullable();
    table.string('account_no').notNullable();
    table.date('credit_date').notNullable().defaultTo(knex.raw('CURRENT_DATE'));
    table.specificType('amount', 'MONEY').notNullable();
    table.string('credit_from');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.foreign('user_id', 'fk_credits_user').references('id').inTable('users').onDelete('CASCADE');
    table.foreign(['bank_name', 'account_no'], 'fk_credits_account').references(['bank_name', 'account_no']).inTable('accounts').onDelete('CASCADE').onUpdate('CASCADE');
  })
  .createTable('alarms', (table) => {
    table.integer('user_id').notNullable();
    table.string('name').notNullable();
    table.integer('category_id').notNullable();
    table.specificType('expense_limit', 'MONEY').notNullable();
    table.integer('limit_duration').notNullable();
    table.string('description');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.foreign('user_id', 'fk_alarms_user').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('category_id', 'fk_alarms_category').references('id').inTable('categories').onDelete('CASCADE');
    table.primary(['user_id', 'category_id']);
  });

  await knex.raw(`
    CREATE INDEX IF NOT EXISTS accounts_idx
    ON accounts (user_id);
  `);

  await knex.raw(`
    CREATE INDEX IF NOT EXISTS expenses_idx 
    ON expenses (user_id, expense_date);
  `);

  await knex.raw(`
    CREATE INDEX IF NOT EXISTS credits_idx 
    ON credits (user_id, credit_date);
  `);

  console.log('** Migration complete **');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down (knex) {

  await knex.raw(`
    SET search_path TO ${dbConfig.schema};
  `);

  let resp = await knex.raw(`
    SELECT current_schema();
  `);

  console.log('Current schema:', resp.rows);

  await knex.schema.dropTableIfExists('alarms')
  .dropTableIfExists('credits')
  .dropTableIfExists('expenses')
  .dropTableIfExists('categories')
  .dropTableIfExists('accounts')
  .dropTableIfExists('users');

  await knex.raw('DROP INDEX IF EXISTS accounts_idx');
  await knex.raw('DROP INDEX IF EXISTS expenses_idx');
  await knex.raw('DROP INDEX IF EXISTS credits_idx');

  console.log('Rollback complete');
};
