import { Router } from 'express';
import { getExpenseHandler, createExpenseHandler, updateExpenseHandler, deleteExpenseHandler } from '../controllers/expenseController.js';
import { validateExpenseCreation, validateExpenseUpdate } from '../middlewares/validationMiddleware.js';

const router = Router();

router.get('/', getExpenseHandler);
router.post('/new', validateExpenseCreation, createExpenseHandler);
router.put('/update', validateExpenseUpdate, updateExpenseHandler);
router.delete('/delete', deleteExpenseHandler);

export default router;