import express from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas públicas (no requieren autenticación)
router.post('/register', register);  // POST /api/auth/register
router.post('/login', login);        // POST /api/auth/login

// Rutas protegidas (requieren token)
router.get('/profile', verifyToken, getProfile);      // GET /api/auth/profile
router.put('/profile', verifyToken, updateProfile);   // PUT /api/auth/profile

export default router;