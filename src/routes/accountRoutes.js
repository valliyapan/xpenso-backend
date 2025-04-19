import { Router } from 'express';
import { getAccountsHandler, createAccountHandler } from '../controllers/accountController.js';

const router = Router();

router.get('/me', getAccountsHandler);
router.post('/new', createAccountHandler);

export default router;