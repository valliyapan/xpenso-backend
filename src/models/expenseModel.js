import db from '../../config/db.js';
class Expenses {
  static tableName = 'expenses';

  static async getAllExpenses(userId) {
    const expenses = await db(this.tableName).where({ user_id: userId }).orderBy('created_at', 'desc').limit(10).select('*');
    return expenses;
  }

  static async getExpenseById(expenseId) {
    const [expense] = await db(this.tableName).where({ id: expenseId }).select('*');
    return expense;
  }

  static async createExpense(expenseData) {
    const [expense] = await db(this.tableName).insert(expenseData).returning('*');
    return expense;
  }

  static async updateExpense(expenseId, updatedData) {
    const [expense] = await db(this.tableName).where({ id: expenseId }).update(updatedData).returning('*');
    return expense;
  }

  static async deleteExpense(expenseId) {
    const resp = await db(this.tableName).where({ id: expenseId }).del();
    return resp;
  }
};

export default Expenses;