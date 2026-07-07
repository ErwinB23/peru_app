import express from 'express';
import {
    getComidasByDistritoId,
    getComidaById,
    createComida,
    updateComida,
    deleteComida
} from '../controllers/comidaTipicaDistritoController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import { uploadComidaTipicaDistritoImage } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/distrito/:distritoId', verifyToken, getComidasByDistritoId);
router.get('/:id', verifyToken, getComidaById);

router.post(
    '/',
    verifyToken,
    isAdmin,
    uploadComidaTipicaDistritoImage.single('imagen'),
    createComida
);

router.put(
    '/:id',
    verifyToken,
    isAdmin,
    uploadComidaTipicaDistritoImage.single('imagen'),
    updateComida
);

router.delete('/:id', verifyToken, isAdmin, deleteComida);

export default router;