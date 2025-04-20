
export async function validateRegister(req, res, next) {
  const { name, password, email } = req.body;

  if (typeof name !== 'string' || name.length < 3 || name.length > 50) {
    return res.status(400).json({ error: 'Name must be between 3 and 50 characters long' });
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: 'Email is not valid' });
  }

  if (typeof password !== 'string' || password.length < 6 || password.length > 25) {
    return res.status(400).json({ error: 'Password must be between 6 and 25 characters long' });
  }

  next();
}

export async function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (typeof password !== 'string' || password.length < 6 || password.length > 25) {
    return res.status(400).json({ error: 'Invalid user credentials' });
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: 'Email is not valid' });
  }

  next();
}

export async function validateUserUpdate(req, res, next) {
  const { name, oldPassword, newPassword } = req.body;

  if (name && typeof name !== 'string' && (name.length < 3 || name.length > 50)) {
    return res.status(400).json({ error: 'Name must be between 3 and 50 characters long' });
  }

  if (newPassword || oldPassword) {
    if (typeof newPassword !== 'string' || newPassword.length < 6 || newPassword.length > 25) {
      return res.status(400).json({ error: 'New password is invalid' });
    }

    if (typeof oldPassword !== 'string' || oldPassword.length < 6 || oldPassword.length > 25) {
      return res.status(400).json({ error: 'Invalid user credentials' });
    }
  }

  next();
}

export async function validateBankAccountCreation(req, res, next) {
  const { accountNo, bankName, balance } = req.body;

  if (typeof accountNo !== 'string' || accountNo.length === 0 || typeof bankName !== 'string' || bankName.length === 0) {
    return res.status(400).json({ error: 'Account number or bank name is invalid' });
  }

  if (typeof balance !== 'number' || balance < 0) {
    return res.status(400).json({ error: 'Invalid account balance' });
  }

  next();
}

export async function validateAccountUpdate(req, res, next) {
  const { accountId, balance, password } = req.body;

  if (typeof accountId !== 'number' || accountId <= 0) {
    return res.status(400).json({ error: 'Invalid bank account ID' });
  }

  if (typeof balance !== 'number' || balance < 0) {
    return res.status(400).json({ error: 'Invalid account balance' });
  }

  if (typeof password !== 'string' || password.length < 6 || password.length > 25) {
    return res.status(400).json({ error: 'Invalid user credentials' });
  }

  next();
}

export async function validateAccountDelete(req, res, next) {
  const { accountId, password } = req.body;

  if (typeof accountId !== 'number' || accountId <= 0) {
    return res.status(400).json({ error: 'Invalid bank account ID' });
  }

  if (typeof password !== 'string' || password.length < 6 || password.length > 25) {
    return res.status(400).json({ error: 'Invalid user credentials' });
  }

  next();
}