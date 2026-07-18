import express from 'express';
import {
  getUsers,
  searchUsersController,
  getUserById,
  updateUserAdmin,
  deleteUserAdmin,
} from '../controllers/userController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import {
  validateAdminUserBody,
  validateIdParam,
  validateSearchQuery
} from '../validators/validationMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, isAdmin, getUsers);
router.get('/search', verifyToken, isAdmin, validateSearchQuery, searchUsersController);
router.get('/:id', verifyToken, isAdmin, validateIdParam, getUserById);
router.put('/:id', verifyToken, isAdmin, validateIdParam, validateAdminUserBody, updateUserAdmin);
router.delete('/:id', verifyToken, isAdmin, validateIdParam, deleteUserAdmin);

export default router;
