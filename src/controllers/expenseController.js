import Expenses from '../models/expenseModel.js';
import Users from '../models/userModel.js';
import Accounts from '../models/accountModel.js';
import { verifyAccessToken } from '../utils/token.js';
import { convertToExpenseDate } from '../utils/date.js';

async function expenseControllerWrapper(req, res, cb) {
  const { accessToken } = req.cookies;
  if (!accessToken) {
    return res.status(400).json({ error: 'Access token is invalid' });
  }

  try {
    const decoded = verifyAccessToken(accessToken);
    if (decoded && decoded.user) {
      const user = await Users.getUserByEmail(decoded.user);
      if (!user) {
        res.status(404).json({ error: 'User does not exist' });
      }
      return await cb(req, res, user);
    }
  } catch (err) {
    switch (err.name) {
      case 'TokenExpiredError':
        return res.status(400).clearCookie('accessToken').json({ error: 'Session timed out' });
      case 'JsonWebTokenError':
      case 'NotBeforeError':
        return res.status(400).clearCookie('accessToken').json({ error: 'Invalid access token' });
      default:
        console.log('Error in expense controller wrapper:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

async function getExpenses(req, res, user) {
  const userId = user.id;
  const expenses = await Expenses.getAllExpenses(userId);
  expenses.forEach(expense => {
    // console.log('Expense date:', expense.expense_date, typeof expense.expense_date);
    expense.expense_date = convertToExpenseDate(expense.expense_date);
  });
  return res.status(200).json(expenses);
}

async function createExpense(req, res, user) {
  const userId = user.id;
  let { accountId, expenseDate, amount, categoryId, name, comment, debitTo } = req.body;
  if (!expenseDate) expenseDate = new Date();
  const account = await Accounts.getByAccountId(accountId);
  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }
  if (account.user_id !== userId) {
    return res.status(403).json({ error: 'Unauthorized access to other account' });
  }

  const expenseData = {
    user_id: userId,
    account_id: accountId,
    expense_date: expenseDate,
    amount,
    category_id: categoryId,
    name,
    comment,
    debit_to: debitTo
  };

  if (!expenseData.comment) delete expenseData.comment;
  if (!expenseData.debit_to) delete expenseData.debit_to;

  const expense = await Expenses.createExpense(expenseData);
  if (!expense) {
    return res.status(500).json({ error: 'Failed to create expense' });
  }

  return res.status(201).json(expense);
}

async function updateExpense(req, res, user) {
  const userId = user.id;
  let { expenseId, expenseDate, amount, name, comment, debitTo } = req.body;
  const expense = await Expenses.getExpenseById(expenseId);
  if (!expense) {
    return res.status(404).json({ error: 'Expense not found' });
  }
  if (expense.user_id !== userId) {
    return res.status(403).json({ error: 'Unauthorized access to other expense' });
  }

  if (typeof expense.amount === 'string' && !Number(expense.amount[0])) {
    expense.amount = Number(expense.amount.slice(1));
  }
  amount = Number(amount);

  const updatedData = {};

  // console.log('Expense date:', expense.expense_date, typeof expense.expense_date);

  expense.expense_date = convertToExpenseDate(expense.expense_date);

  // console.log('Expense date:', expense.expense_date, typeof expense.expense_date);

  if (expenseDate && expenseDate !== expense.expense_date) updatedData.expense_date = expenseDate;
  if ((amount || amount === 0) && amount !== expense.amount) updatedData.amount = amount;
  if (name && name !== expense.name) updatedData.name = name;
  if (comment && comment !== expense.comment) updatedData.comment = comment;
  if (debitTo && debitTo !== expense.debit_to) updatedData.debit_to = debitTo;

  if (Object.keys(updatedData).length === 0) {
    return res.status(200).json({ message: 'No changes made to expense', expenseId });
  }

  console.log('Updated data:', updatedData);
  updatedData.updated_at = new Date();

  const updatedExpense = await Expenses.updateExpense(expenseId, updatedData);
  if (!updatedExpense) {
    return res.status(500).json({ error: 'Failed to update expense' });
  }

  updatedExpense.expense_date = convertToExpenseDate(updatedExpense.expense_date);

  return res.status(200).json(updatedExpense);
}

async function deleteExpense(req, res, user) {
  const userId = user.id;
  const { expenseId } = req.body;
  const expense = await Expenses.getExpenseById(expenseId);
  if (!expense) {
    return res.status(404).json({ error: 'Expense not found' });
  }
  if (expense.user_id !== userId) {
    return res.status(403).json({ error: 'Unauthorized access to other expense' });
  }

  const isDeleted = await Expenses.deleteExpense(expenseId);
  if (!isDeleted) return res.status(500).json({ error: 'Internal server error' });

  return res.status(200).json({ message: 'Expense deleted successfully', expenseId });
}

export async function getExpenseHandler(req, res) {
  return await expenseControllerWrapper(req, res, getExpenses);
}

export async function createExpenseHandler(req, res) {
  return await expenseControllerWrapper(req, res, createExpense);
}

export async function updateExpenseHandler(req, res) {
  return await expenseControllerWrapper(req, res, updateExpense);
}

export async function deleteExpenseHandler(req, res) {
  return await expenseControllerWrapper(req, res, deleteExpense);
}