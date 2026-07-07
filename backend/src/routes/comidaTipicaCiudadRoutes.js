import express from 'express';
import {
    getComidasByCiudadId,
    getComidaById,
    createComida,
    updateComida,
    deleteComida
} from '../controllers/comidaTipicaCiudadController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import { uploadComidaTipicaCiudadImage } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/ciudad/:ciudadId', verifyToken, getComidasByCiudadId);
router.get('/:id', verifyToken, getComidaById);

router.post(
    '/',
    verifyToken,
    isAdmin,
    uploadComidaTipicaCiudadImage.single('imagen'),
    createComida
);

router.put(
    '/:id',
    verifyToken,
    isAdmin,
    uploadComidaTipicaCiudadImage.single('imagen'),
    updateComida
);

router.delete('/:id', verifyToken, isAdmin, deleteComida);

export default router;