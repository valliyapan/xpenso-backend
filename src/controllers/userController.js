import User from '../models/userModel.js';
import { getAccessToken, verifyAccessToken } from '../utils/token.js';

async function markUserEmailVerified(email) {
  try {
    await User.markUserEmailVerified(email);
    return true;
  } catch (err) {
    console.log('Error in marking user as verified:', err);
    return false;
  }
}

async function userControllerWrapper(req, res, cb) {
  const { accessToken } = req.cookies;
  if (!accessToken) {
    // TODO: Render login page
    return res.status(400).json({ error: 'Access token is invalid' });
  }

  try {
    const decoded = verifyAccessToken(accessToken);
    if (decoded && decoded.user) {
      return await cb(req, res, decoded.user);
    }
  } catch (err) {
    switch (err.name) {
      case 'TokenExpiredError':
        return res.status(400).clearCookie('accessToken').json({ error: 'Session timed out' });
      case 'JsonWebTokenError':
      case 'NotBeforeError':
        return res.status(400).clearCookie('accessToken').json({ error: 'Invalid access token' });
      default:
        console.log('Error in user controller wrapper:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

async function verifyRegistration(req, res, email) {
  console.log('User email', email, 'is verified');

  const isMarked = await markUserEmailVerified(email);
  if (isMarked) {
    // TODO: Render user home page

    const accessToken = getAccessToken({ user: email });
    res.cookie('accessToken', accessToken, {
      maxAge: 30 * 60 * 1000,
      httpOnly: true,
      sameSite: 'strict'
    });
    return res.status(200).json({ message: 'User email verified successfully' });

  } else {
    return res.status(500).json({ error: 'User email verification failed' });
  }
}

async function getUser(req, res, email) {
  const user = await User.getUserByEmail(email);
  if (!user) {
    return res.status(404).json({ error: 'User does not exist' });
  }
  delete user.password;
  return res.status(200).json(user);
}

async function updateUser(req, res, email) {
  const { name, oldPassword, newPassword } = req.body;
  const user = await User.getUserByEmail(email);
  if (!user) {
    return res.status(404).json({ error: 'User does not exist' });
  }

  const modifiedUser = {};
  if (name && name != user.name) {
    modifiedUser.name = name;
  }

  if (oldPassword && newPassword) {
    if (await User.verifyUserCredentials(user, oldPassword)) {
      if (oldPassword === newPassword) {
        return res.status(400).json({ error: 'New password cannot be same as old password' });
      }
      modifiedUser.password = newPassword;
    } else {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
  }

  if (Object.keys(modifiedUser).length > 0) {
    modifiedUser.updated_at = new Date();
    const updatedUser = await User.updateUser(email, modifiedUser);
    if (updatedUser) {
      delete updatedUser.password;
      return res.status(200).json(updatedUser);
    } else {
      console.log('No user updated');
    }
  }

  return res.status(200).json({ user });
}

async function deleteUser(req, res, email) {
  const { password } = req.body;
  const user = await User.getUserByEmail(email);
  if (!user) {
    return res.status(400).json({ error: 'User does not exist' });
  }

  const isValidCredentials = User.verifyUserCredentials(user, password);
  if (!isValidCredentials) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const isUserDeleted = User.deleteUser(email);
  if (isUserDeleted) {
    return res.status(200).json({ message: 'User deleted successfully' });
  }

  return res.status(400).json({ error: 'User is not deleted' });
}

export async function registrationHandler(req, res) {
  req.cookies = req.queries; // As token is fetched only from cookies in wrapper
  return await userControllerWrapper(req, res, verifyRegistration);
}

export async function getUserHandler(req, res) {
  return await userControllerWrapper(req, res, getUser);
}

export async function updateUserHandler(req, res) {
  return await userControllerWrapper(req, res, updateUser);
}

export async function deleteUserHandler(req, res) {
  return await userControllerWrapper(req, res, deleteUser);
}