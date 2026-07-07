import express from 'express';
import {
    getCiudades,
    getCiudadById,
    createCiudad,
    updateCiudad,
    deleteCiudad
} from '../controllers/ciudadController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import { uploadCiudadImage } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/', getCiudades);
router.get('/:id', getCiudadById);



router.post(
    '/',
    verifyToken,
    isAdmin,
    uploadCiudadImage.single('imagen_fondo'),
    createCiudad
);

router.put(
    '/:id',
    verifyToken,
    isAdmin,
    uploadCiudadImage.single('imagen_fondo'),
    updateCiudad
);

router.delete('/:id', verifyToken, isAdmin, deleteCiudad);

export default router;