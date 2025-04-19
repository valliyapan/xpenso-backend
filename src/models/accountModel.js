import db from '../../config/db.js';

class Accounts {
    static tableName = 'accounts';

    static async create(accountData) {
        const [account] = await db(Accounts.tableName).insert(accountData).returning('*');
        return account || false;
    }

    static async getByUserId(userId) {
        const accounts = await db(Accounts.tableName).where({ user_id: userId }).select('*').orderBy('created_at');
        return accounts;
    }

    static async getByAccountId(accountId) {
        const [account] = await db(Accounts.tableName).where({ account_id: accountId }).select('*');
        return account || false;
    }

    static async updateBalance(accountId, balance) {
        const [account] = await db(Accounts.tableName).where({ account_id: accountId }).update({ balance }).returning('*');
        return account || false;
    }

    static async deleteAccount(accountId) {
        const resp = await db(Accounts.tableName).where({ account_id: accountId }).del();
        return resp;
    }
}

export default Accounts;