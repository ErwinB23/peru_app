import express from 'express';
import {
    getLugaresByDistritoId,
    getLugarById,
    createLugar,
    updateLugar,
    deleteLugar
} from '../controllers/lugarTuristicoDistritoController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import { uploadLugarTuristicoDistritoImage } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/distrito/:distritoId', verifyToken, getLugaresByDistritoId);
router.get('/:id', verifyToken, getLugarById);

router.post(
    '/',
    verifyToken,
    isAdmin,
    uploadLugarTuristicoDistritoImage.single('imagen'),
    createLugar
);

router.put(
    '/:id',
    verifyToken,
    isAdmin,
    uploadLugarTuristicoDistritoImage.single('imagen'),
    updateLugar
);

router.delete('/:id', verifyToken, isAdmin, deleteLugar);

export default router;