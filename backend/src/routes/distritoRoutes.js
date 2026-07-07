import express from 'express';
import {
    getDistritos,
    getDistritoById,
    createDistrito,
    updateDistrito,
    deleteDistrito
} from '../controllers/distritoController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import { uploadDistritoImage } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', getDistritos);           // GET /api/distritos?provincia_id=1
router.get('/:id', getDistritoById);     // GET /api/distritos/:id

// Rutas protegidas (solo admin)
router.post('/',verifyToken,isAdmin,uploadDistritoImage.single('imagen_fondo'),createDistrito);  // POST /api/distritos
router.put('/:id',verifyToken,isAdmin,uploadDistritoImage.single('imagen_fondo'),updateDistrito);   // PUT /api/distritos/:id
router.delete('/:id', verifyToken, isAdmin, deleteDistrito);  // DELETE /api/distritos/:id

export default router;