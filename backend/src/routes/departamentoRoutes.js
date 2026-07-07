import express from 'express';
import { uploadDepartamentoImage } from "../middlewares/uploadMiddleware.js";

import {
    getDepartamentos,
    getDepartamentoById,
    createDepartamento,
    updateDepartamento,
    deleteDepartamento
} from '../controllers/departamentoController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Rutas públicas (pueden verlas usuarios y visitantes)
router.get('/', getDepartamentos);           // GET /api/departamentos
router.get('/:id', getDepartamentoById);     // GET /api/departamentos/:id

// Rutas protegidas (solo admin)
router.post("/", verifyToken, isAdmin, uploadDepartamentoImage.single("imagen_fondo"),createDepartamento,); 
router.put("/:id", verifyToken, isAdmin, uploadDepartamentoImage.single("imagen_fondo"), updateDepartamento,);
router.delete('/:id', verifyToken, isAdmin, deleteDepartamento);  // DELETE /api/departamentos/:id


export default router;