import { Router } from 'express';
import { verifyRegistration } from '../controllers/userController.js';

const router = Router();

router.get('/verify-registration', verifyRegistration);

export default router;