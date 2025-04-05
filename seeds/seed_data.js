import db from '../config/db.js';
import fs from 'fs';

let seedData;

console.log('** Starting seed **');

try {
    seedData = JSON.parse(fs.readFileSync('data.json'));
} catch (err) {
    console.log(err.message);
    process.exit(1);
}

let users = seedData.users;
let accounts = seedData.accounts;
let categories = seedData.categories;
let expenses = seedData.expenses;
let credits = seedData.credits;
let alarms = seedData.alarms;

async function seed () {
    try {
        /* let resp = await db.raw(`
            SELECT current_database();
        `);
        console.log('see_data.js:', resp.rows[0]);
        resp = await db.raw(`
            SELECT current_schema();
        `);
        console.log('see_data.js:', resp.rows[0]); */
        await db('users').insert(users);
        await db('accounts').insert(accounts);
        await db('categories').insert(categories);
        await db('expenses').insert(expenses);
        await db('credits').insert(credits);
        await db('alarms').insert(alarms);
        console.log('** Seed complete **');
        process.exit(0);
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
}

seed();