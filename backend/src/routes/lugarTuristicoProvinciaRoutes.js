import express from 'express';
import {
    getLugaresByProvinciaId,
    getLugarById,
    createLugar,
    updateLugar,
    deleteLugar
} from '../controllers/lugarTuristicoProvinciaController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import { uploadLugarTuristicoProvinciaImage } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/provincia/:provinciaId', verifyToken, getLugaresByProvinciaId);
router.get('/:id', verifyToken, getLugarById);

router.post(
    '/',
    verifyToken,
    isAdmin,
    uploadLugarTuristicoProvinciaImage.single('imagen'),
    createLugar
);

router.put(
    '/:id',
    verifyToken,
    isAdmin,
    uploadLugarTuristicoProvinciaImage.single('imagen'),
    updateLugar
);

router.delete('/:id', verifyToken, isAdmin, deleteLugar);

export default router;