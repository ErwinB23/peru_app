import express from 'express';
import {
  getComidasByDistritoId,
  getComidaById,
  createComida,
  updateComida,
  deleteComida
} from '../controllers/comidaTipicaDistritoController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import {
  uploadComidaTipicaDistritoImage,
  verifyUploadedImageSignatures,
  persistUploadedImages
} from '../middlewares/uploadMiddleware.js';
import {
  ensureRelationExists,
  ensureResourceExists,
  ensureUniqueName
} from '../middlewares/dataIntegrityMiddleware.js';
import {
  validateComidaDistritoBody,
  validateDistritoIdParam,
  validateIdParam
} from '../validators/validationMiddleware.js';

const router = express.Router();
const comidaExists = ensureResourceExists('ComidasTipicasDistritos');
const distritoExists = ensureRelationExists('distritos', 'distrito_id');
const uniqueComida = ensureUniqueName('ComidasTipicasDistritos');

router.get('/distrito/:distritoId', verifyToken, validateDistritoIdParam, getComidasByDistritoId);
router.get('/:id', verifyToken, validateIdParam, getComidaById);
router.post(
  '/', verifyToken, isAdmin,
  uploadComidaTipicaDistritoImage.single('imagen'),
  verifyUploadedImageSignatures,
  persistUploadedImages,
  validateComidaDistritoBody, distritoExists, uniqueComida, createComida
);
router.put(
  '/:id', verifyToken, isAdmin, validateIdParam,
  comidaExists,
  uploadComidaTipicaDistritoImage.single('imagen'),
  verifyUploadedImageSignatures,
  persistUploadedImages,
  validateComidaDistritoBody, distritoExists, uniqueComida, updateComida
);
router.delete('/:id', verifyToken, isAdmin, validateIdParam, comidaExists, deleteComida);

export default router;
