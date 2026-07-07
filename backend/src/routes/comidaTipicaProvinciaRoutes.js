import express from 'express';
import {
    getComidasByProvinciaId,
    getComidaById,
    createComida,
    updateComida,
    deleteComida
} from '../controllers/comidaTipicaProvinciaController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import { uploadComidaTipicaProvinciaImage } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/provincia/:provinciaId', verifyToken, getComidasByProvinciaId);
router.get('/:id', verifyToken, getComidaById);

router.post(
    '/',
    verifyToken,
    isAdmin,
    uploadComidaTipicaProvinciaImage.single('imagen'),
    createComida
);

router.put(
    '/:id',
    verifyToken,
    isAdmin,
    uploadComidaTipicaProvinciaImage.single('imagen'),
    updateComida
);

router.delete('/:id', verifyToken, isAdmin, deleteComida);

export default router;