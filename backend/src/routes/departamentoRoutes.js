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
import { ensureResourceExists, ensureUniqueName } from '../middlewares/dataIntegrityMiddleware.js';
import {
  validateDepartamentoBody,
  validateIdParam
} from '../validators/validationMiddleware.js';

const router = express.Router();
const departamentoExists = ensureResourceExists('Departamentos');
const uniqueDepartamento = ensureUniqueName('Departamentos');

router.get('/', verifyToken, getDepartamentos);
router.get('/:id', verifyToken, validateIdParam, getDepartamentoById);

router.post(
  '/',
  verifyToken,
  isAdmin,
  uploadDepartamentoImage.single('imagen_fondo'),
  validateDepartamentoBody,
  uniqueDepartamento,
  createDepartamento
);
router.put(
  '/:id',
  verifyToken,
  isAdmin,
  validateIdParam,
  departamentoExists,
  uploadDepartamentoImage.single('imagen_fondo'),
  validateDepartamentoBody,
  uniqueDepartamento,
  updateDepartamento
);
router.delete('/:id', verifyToken, isAdmin, validateIdParam, departamentoExists, deleteDepartamento);

export default router;
