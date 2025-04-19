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

async function updateBalance(req, res, userId) {
  const { accountId, balance } = req.body;

  const account = await Accounts.getByAccountId(accountId);
  if (!account || account.user_id !== userId) return res.status(404).json({ error: 'No such account found' });

  const updatedAccount = await Accounts.updateBalance(accountId, balance);
  if (!updatedAccount) return res.status(500).json({ error: 'Internal server error' });

  return res.status(200).json(updatedAccount);
}

async function deleteAccount(req, res, userId) {
  const { accountId } = req.body;

  const account = await Accounts.getByAccountId(accountId);
  if (!account || account.user_id !== userId) return res.status(404).json({ error: 'No such account found' });

  const isDeleted = await Accounts.deleteAccount(accountId);
  if (!isDeleted) return res.status(500).json({ error: 'Internal server error' });

  return res.status(200).json({ message: 'Account deleted successfully', accountId });
}

export async function getAccountsHandler(req, res) {
  return await accountControllerWrapper(req, res, getAccounts);
}

export async function createAccountHandler(req, res) {
  return await accountControllerWrapper(req, res, createAccount);
}

export async function updateBalanceHandler(req, res) {
  return await accountControllerWrapper(req, res, updateBalance);
}

export async function deleteAccountHandler(req, res) {
  return await accountControllerWrapper(req, res, deleteAccount);
}