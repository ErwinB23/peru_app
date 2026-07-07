import express from 'express';
import { uploadProvinciaImage } from '../middlewares/uploadMiddleware.js';
import {
    getProvincias,
    getProvinciaById,
    createProvincia,
    updateProvincia,
    deleteProvincia
} from '../controllers/provinciaController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', getProvincias);           // GET /api/provincias?departamento_id=1
router.get('/:id', getProvinciaById);     // GET /api/provincias/:id

// Rutas protegidas (solo admin)
router.post('/',verifyToken,isAdmin,uploadProvinciaImage.single('imagen_fondo'),createProvincia);
router.put('/:id',verifyToken,isAdmin,uploadProvinciaImage.single('imagen_fondo'),updateProvincia);// PUT /api/provincias/:id
router.delete('/:id', verifyToken, isAdmin, deleteProvincia);  // DELETE /api/provincias/:id

export default router;