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
        console.log('Error in account controller wrapper:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

async function getAccounts(req, res, user) {
  const response = { success: true, data: [] };
  const accounts = await Accounts.getByUserId(user.id);
  response.data = accounts;
  return res.status(200).json(response);
}

async function createAccount(req, res, user) {
  const userId = user.id;
  const accounts = await Accounts.getByUserId(userId);
  if (accounts.length === 10) return res.status(400).json({ error: 'Maximum account creation limit reached' });

  const { accountNo, bankName, balance } = req.body;

  try {
    const account = await Accounts.create({ account_no: accountNo, bank_name: bankName, user_id: userId, balance });
    if (account) return res.status(201).json(account);

  } catch (err) {
    if (err.message.includes('duplicate key value violates unique constraint')) {
      return res.status(400).json({ error: 'Account already exists' });
    } else {
      console.log('Error in account creation:', err);
    }
  }

  return res.status(500).json({ error: 'Account creation failed' });
}

async function updateBalance(req, res, user) {
  const { accountId, balance, password } = req.body;

  if (!await Users.verifyUserCredentials(user, password)) {
    return res.status(400).json({ error: 'Invalid user credentials' });
  }

  const account = await Accounts.getByAccountId(accountId);
  if (!account || account.user_id !== user.id) return res.status(404).json({ error: 'No such account found' });

  const updatedAccount = await Accounts.updateBalance(accountId, balance);
  if (!updatedAccount) return res.status(500).json({ error: 'Internal server error' });

  return res.status(200).json(updatedAccount);
}

async function deleteAccount(req, res, user) {
  const { accountId, password } = req.body;

  if (!await Users.verifyUserCredentials(user, password)) {
    return res.status(400).json({ error: 'Invalid user credentials' });
  }

  const account = await Accounts.getByAccountId(accountId);
  if (!account || account.user_id !== user.id) return res.status(404).json({ error: 'No such account found' });

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