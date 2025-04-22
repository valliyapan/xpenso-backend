import { Router } from 'express';
import { registrationHandler, getUserHandler, updateUserHandler, deleteUserHandler } from '../controllers/userController.js';
import { validateUserUpdate, validateUserDelete } from '../middlewares/validationMiddleware.js';

const router = Router();

router.get('/verify-registration', registrationHandler);
router.get('/me', getUserHandler);
router.put('/update/me', validateUserUpdate, updateUserHandler);
router.delete('/delete/me', validateUserDelete, deleteUserHandler);

export default router;