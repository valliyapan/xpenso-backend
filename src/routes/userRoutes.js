import { Router } from 'express';
import { registrationHandler, getUserHandler, updateUserHandler, deleteUserHandler } from '../controllers/userController.js';

const router = Router();

router.get('/verify-registration', registrationHandler);
router.get('/me', getUserHandler);
router.put('/update/me', updateUserHandler);
router.delete('/delete/me', deleteUserHandler);

export default router;