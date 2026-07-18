import express from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { loginLimiter, registerLimiter } from '../middlewares/authRateLimiter.js';
import {
  validateLoginBody,
  validateProfileBody,
  validateRegisterBody
} from '../validators/validationMiddleware.js';

const router = express.Router();

// Únicas funciones públicas de negocio.
router.post('/register', registerLimiter, validateRegisterBody, register);
router.post('/login', loginLimiter, validateLoginBody, login);

router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, validateProfileBody, updateProfile);

export default router;
