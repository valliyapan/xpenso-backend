import { Router } from 'express';
import { getAccountsHandler, createAccountHandler, updateBalanceHandler, deleteAccountHandler } from '../controllers/accountController.js';
import { validateBankAccountCreation, validateAccountUpdate } from '../middlewares/validationMiddleware.js';

const router = Router();

router.get('/', getAccountsHandler);
router.post('/new', validateBankAccountCreation, createAccountHandler);
router.put('/update', validateAccountUpdate, updateBalanceHandler);
router.delete('/delete', deleteAccountHandler);

export default router;