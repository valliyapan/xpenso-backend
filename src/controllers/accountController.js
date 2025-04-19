import Accounts from '../models/accountModel.js';
import Users from '../models/userModel.js';
import { verifyAccessToken } from '../utils/token.js';

async function accountControllerWrapper(req, res, cb) {
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
      return await cb(req, res, user.id);
    }
  } catch (err) {
    switch (err.name) {
      case 'TokenExpiredError':
        return res.status(400).clearCookie('accessToken').json({ error: 'Session timed out' });
      case 'JsonWebTokenError':
      case 'NotBeforeError':
        return res.status(400).clearCookie('accessToken').json({ error: 'Invalid access token' });
      default:
        console.log('Error in account controller wrapper:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

async function getAccounts(req, res, userId) {
  const response = { success: true, data: [] };
  const accounts = await Accounts.getByUserId(userId);
  response.data = accounts;
  return res.status(200).json(response);
}

async function createAccount(req, res, userId) {
  const accounts = await Accounts.getByUserId(userId);
  if (accounts.length === 10) return res.status(400).json({ error: 'Maximum account creation limit reached' });

  const { accountNo, bankName, balance } = req.body;
  if (!balance) balance = 0;

  const account = await Accounts.create({ account_no: accountNo, bank_name: bankName, user_id: userId, balance });
  if (!account) return res.status(500).json({ error: 'Account creation failed' });

  return res.status(201).json(account);
}

export async function getAccountsHandler(req, res) {
  return await accountControllerWrapper(req, res, getAccounts);
}

export async function createAccountHandler(req, res) {
  return await accountControllerWrapper(req, res, createAccount);
}