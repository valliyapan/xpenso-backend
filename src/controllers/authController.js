import User from '../models/userModel.js';
import { getAccessToken, verifyAccessToken } from '../utils/token.js';

export async function register(req, res) {
  const { name, password, email } = req.body;

  try {
    const existingUser = await User.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const newUser = await User.createUser(name, email, password);
    if (!newUser) {
      return res.status(500).json({ error: 'Failed to create user' });
    }

    // Logic to send mail

    return res.status(200).json({ message: 'Verification email sent' });

  } catch (err) {
    console.error('Error in user registration:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'User does not exist' });
    }

    const isVerifiedUser = await User.verifyUser(user, password);
    if (!isVerifiedUser) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log(`User ${user.name} is verified`);

    const accessToken = getAccessToken({ email: user.email });
    res.cookie('token', accessToken, {
      maxAge: 30 * 60 * 1000,
      httpOnly: true,
      sameSite: 'strict'
    });

    return res.status(200).json({ message: 'Login successful'});

  } catch (err) {
    console.error('Error in user login:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export async function logout(req, res) {
  const { accessToken } = req.cookie;

  if (!accessToken) {
    return res.status(401).json({ error: 'User is unauthorized' });
  }

  try {
    const decoded = verifyAccessToken(accessToken);
    if (decoded && decoded.user) {
      return res.status(200).clearCookie('accessToken').json({ message: 'Logged out successfully' });
    }
  } catch (err) {
    // TODO: Render login page once views section is completed
    console.log('Access token verification error:', err);

    if (err.name === 'TokenExpiredError') {
      return res.status(400).clearCookie('accessToken').json({ error: 'Session timed out'});
    }
  }
  return res.status(400).clearCookie('accessToken').json({ error: 'Access token is invalid' });
};