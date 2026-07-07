import express from 'express';
import {
    getLugaresByCiudadId,
    getLugarById,
    createLugar,
    updateLugar,
    deleteLugar
} from '../controllers/lugarTuristicoCiudadController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import { uploadLugarTuristicoCiudadImage } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/ciudad/:ciudadId', verifyToken, getLugaresByCiudadId);
router.get('/:id', verifyToken, getLugarById);

router.post(
    '/',
    verifyToken,
    isAdmin,
    uploadLugarTuristicoCiudadImage.single('imagen'),
    createLugar
);

router.put(
    '/:id',
    verifyToken,
    isAdmin,
    uploadLugarTuristicoCiudadImage.single('imagen'),
    updateLugar
);

router.delete('/:id', verifyToken, isAdmin, deleteLugar);

export default router;