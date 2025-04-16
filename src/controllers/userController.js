import User from '../models/userModel.js';
import { getAccessToken, verifyAccessToken } from '../utils/token.js';

async function markUserEmailVerified(email) {
    try {
        await User.markUserEmailVerified(email);
        return true;
    } catch(err) {
        console.log('Error in marking user as verified:', err);
        return false;
    }
}

export async function verifyRegistration(req, res) {
    const { accessToken } = req.query;
    if (!accessToken) {
        // TODO: Render login page
        return res.status(400).json({ error: 'Access token is invalid' });
    }

    try {
        const decoded = verifyAccessToken(accessToken);
        if (decoded && decoded.user) {
            const email = decoded.user;
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
    } catch(err) {
        console.log('Error in user registration verification:', err);
    }

    return res.status(400).json({ error: 'Access token is invalid and user verification failed' });
}