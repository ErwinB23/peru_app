import express from 'express';
import { uploadDepartamentoImage } from '../middlewares/uploadMiddleware.js';
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

router.get('/', verifyToken, getDepartamentos);
router.get('/:id', verifyToken, getDepartamentoById);

router.post(
  '/',
  verifyToken,
  isAdmin,
  uploadDepartamentoImage.single('imagen_fondo'),
  createDepartamento
);
router.put(
  '/:id',
  verifyToken,
  isAdmin,
  uploadDepartamentoImage.single('imagen_fondo'),
  updateDepartamento
);
router.delete('/:id', verifyToken, isAdmin, deleteDepartamento);

export default router;
