import express from 'express';
import {
  uploadDepartamentoImage,
  verifyUploadedImageSignatures,
  persistUploadedImages
} from '../middlewares/uploadMiddleware.js';
import {
  getDepartamentos,
  getDepartamentoById,
  createDepartamento,
  updateDepartamento,
  updateDepartamentoIntroduccion,
  deleteDepartamento
} from '../controllers/departamentoController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import { ensureResourceExists, ensureUniqueName } from '../middlewares/dataIntegrityMiddleware.js';
import {
  validateDepartamentoBody,
  validateDepartamentoIntroduccionBody,
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
  verifyUploadedImageSignatures,
  persistUploadedImages,
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
  verifyUploadedImageSignatures,
  persistUploadedImages,
  validateDepartamentoBody,
  uniqueDepartamento,
  updateDepartamento
);
router.patch(
  '/:id/introduccion',
  verifyToken,
  isAdmin,
  validateIdParam,
  departamentoExists,
  validateDepartamentoIntroduccionBody,
  updateDepartamentoIntroduccion
);
router.delete('/:id', verifyToken, isAdmin, validateIdParam, departamentoExists, deleteDepartamento);

export default router;
