import { Router } from 'express';
import { getAccountsHandler, createAccountHandler, updateBalanceHandler, deleteAccountHandler } from '../controllers/accountController.js';

const router = Router();

router.get('/', getAccountsHandler);
router.post('/new', createAccountHandler);
router.put('/update', updateBalanceHandler);
router.delete('/delete', deleteAccountHandler);

export default router;