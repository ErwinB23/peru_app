import express from 'express';
import {
  uploadProvinciaImage,
  verifyUploadedImageSignatures
} from '../middlewares/uploadMiddleware.js';
import {
  getProvincias,
  getProvinciaById,
  createProvincia,
  updateProvincia,
  deleteProvincia
} from '../controllers/provinciaController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import {
  ensureRelationExists,
  ensureResourceExists,
  ensureUniqueName
} from '../middlewares/dataIntegrityMiddleware.js';
import {
  validateIdParam,
  validateProvinciaBody,
  validateProvinciaQuery
} from '../validators/validationMiddleware.js';

const router = express.Router();
const provinciaResourceExists = ensureResourceExists('Provincias');
const departamentoExists = ensureRelationExists('departamentos', 'departamento_id');
const uniqueProvincia = ensureUniqueName('Provincias');

router.get('/', verifyToken, validateProvinciaQuery, getProvincias);
router.get('/:id', verifyToken, validateIdParam, getProvinciaById);

router.post(
  '/',
  verifyToken,
  isAdmin,
  uploadProvinciaImage.single('imagen_fondo'),
  verifyUploadedImageSignatures,
  validateProvinciaBody,
  departamentoExists,
  uniqueProvincia,
  createProvincia
);
router.put(
  '/:id',
  verifyToken,
  isAdmin,
  validateIdParam,
  provinciaResourceExists,
  uploadProvinciaImage.single('imagen_fondo'),
  verifyUploadedImageSignatures,
  validateProvinciaBody,
  departamentoExists,
  uniqueProvincia,
  updateProvincia
);
router.delete('/:id', verifyToken, isAdmin, validateIdParam, provinciaResourceExists, deleteProvincia);

export default router;
