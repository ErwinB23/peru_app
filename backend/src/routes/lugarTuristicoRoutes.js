import express from 'express';
import {
  getLugaresByDepartamentoId,
  getLugarById,
  createLugarTuristico,
  updateLugarTuristico,
  deleteLugarTuristico,
} from '../controllers/lugarTuristicoController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import {
  uploadLugarTuristicoImage,
  verifyUploadedImageSignatures,
  persistUploadedImages
} from '../middlewares/uploadMiddleware.js';
import {
  ensureRelationExists,
  ensureResourceExists,
  ensureUniqueName
} from '../middlewares/dataIntegrityMiddleware.js';
import {
  validateDepartamentoIdParam,
  validateIdParam,
  validateLugarDepartamentoBody
} from '../validators/validationMiddleware.js';

const router = express.Router();
const lugarExists = ensureResourceExists('LugaresTuristicos');
const departamentoExists = ensureRelationExists('departamentos', 'departamento_id');
const uniqueLugar = ensureUniqueName('LugaresTuristicos');
const uploadImages = uploadLugarTuristicoImage.fields([
  { name: 'imagen', maxCount: 1 },
  { name: 'imagen_2', maxCount: 1 },
  { name: 'imagen_3', maxCount: 1 },
  { name: 'imagen_4', maxCount: 1 },
]);

router.get(
  '/departamento/:departamentoId',
  verifyToken,
  validateDepartamentoIdParam,
  getLugaresByDepartamentoId,
);
router.get('/:id', verifyToken, validateIdParam, getLugarById);

router.post(
  '/',
  verifyToken,
  isAdmin,
  uploadImages,
  verifyUploadedImageSignatures,
  persistUploadedImages,
  validateLugarDepartamentoBody,
  departamentoExists,
  uniqueLugar,
  createLugarTuristico,
);

router.put(
  '/:id',
  verifyToken,
  isAdmin,
  validateIdParam,
  lugarExists,
  uploadImages,
  verifyUploadedImageSignatures,
  persistUploadedImages,
  validateLugarDepartamentoBody,
  departamentoExists,
  uniqueLugar,
  updateLugarTuristico,
);

router.delete('/:id', verifyToken, isAdmin, validateIdParam, lugarExists, deleteLugarTuristico);

export default router;
