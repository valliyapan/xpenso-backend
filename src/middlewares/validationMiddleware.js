
export async function validateRegister(req, res, next) {
  const { name, password, email } = req.body;
  if (!name || !password || !email) {
    return res.status(400).json({ error: 'Name, password, and email are required' });
  }
  if (password.length <= 6 || password.length >= 25) {
    return res.status(400).json({ error: 'Password must be between 6 and 25 characters long' });
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: 'Email is not valid' });
  }
  if (name.length <= 3 || name.length >= 50) {
    return res.status(400).json({ error: 'Name must be between 3 and 50 characters long' });
  }
  next();
}

export async function validateLogin(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  if (password.length <= 6 || password.length >= 25) {
    return res.status(400).json({ error: 'Password must be between 6 and 25 characters long' });
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: 'Email is not valid' });
  }
  next();
}