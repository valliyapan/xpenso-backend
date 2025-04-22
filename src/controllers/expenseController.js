import Expenses from '../models/expenseModel.js';
import Users from '../models/userModel.js';
import { verifyAccessToken } from '../utils/token.js';

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
  
}

async function createExpense(req, res, user) {
  
}

async function updateExpense(req, res, user) {
  
}

async function deleteExpense(req, res, user) {
  
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