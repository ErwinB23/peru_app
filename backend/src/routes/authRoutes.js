import express from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { loginLimiter, registerLimiter } from '../middlewares/authRateLimiter.js';

const router = express.Router();

// Únicas funciones públicas de negocio.
router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);

router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);

export default router;
