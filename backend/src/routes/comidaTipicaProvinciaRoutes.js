import express from 'express';
import {
  getComidasByProvinciaId,
  getComidaById,
  createComida,
  updateComida,
  deleteComida
} from '../controllers/comidaTipicaProvinciaController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import { uploadComidaTipicaProvinciaImage } from '../middlewares/uploadMiddleware.js';
import {
  ensureRelationExists,
  ensureResourceExists,
  ensureUniqueName
} from '../middlewares/dataIntegrityMiddleware.js';
import {
  validateComidaProvinciaBody,
  validateIdParam,
  validateProvinciaIdParam
} from '../validators/validationMiddleware.js';

const router = express.Router();
const comidaExists = ensureResourceExists('ComidasTipicasProvincias');
const provinciaExists = ensureRelationExists('provincias', 'provincia_id');
const uniqueComida = ensureUniqueName('ComidasTipicasProvincias');

router.get('/provincia/:provinciaId', verifyToken, validateProvinciaIdParam, getComidasByProvinciaId);
router.get('/:id', verifyToken, validateIdParam, getComidaById);
router.post(
  '/', verifyToken, isAdmin,
  uploadComidaTipicaProvinciaImage.single('imagen'),
  validateComidaProvinciaBody, provinciaExists, uniqueComida, createComida
);
router.put(
  '/:id', verifyToken, isAdmin, validateIdParam,
  comidaExists,
  uploadComidaTipicaProvinciaImage.single('imagen'),
  validateComidaProvinciaBody, provinciaExists, uniqueComida, updateComida
);
router.delete('/:id', verifyToken, isAdmin, validateIdParam, comidaExists, deleteComida);

export default router;
