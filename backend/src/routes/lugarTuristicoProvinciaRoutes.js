import express from 'express';
import {
  getLugaresByProvinciaId,
  getLugarById,
  createLugar,
  updateLugar,
  deleteLugar
} from '../controllers/lugarTuristicoProvinciaController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import { uploadLugarTuristicoProvinciaImage } from '../middlewares/uploadMiddleware.js';
import {
  ensureRelationExists,
  ensureResourceExists,
  ensureUniqueName
} from '../middlewares/dataIntegrityMiddleware.js';
import {
  validateIdParam,
  validateLugarProvinciaBody,
  validateProvinciaIdParam
} from '../validators/validationMiddleware.js';

const router = express.Router();
const lugarExists = ensureResourceExists('LugaresTuristicosProvincias');
const provinciaExists = ensureRelationExists('provincias', 'provincia_id');
const uniqueLugar = ensureUniqueName('LugaresTuristicosProvincias');

router.get('/provincia/:provinciaId', verifyToken, validateProvinciaIdParam, getLugaresByProvinciaId);
router.get('/:id', verifyToken, validateIdParam, getLugarById);

router.post(
  '/', verifyToken, isAdmin,
  uploadLugarTuristicoProvinciaImage.single('imagen'),
  validateLugarProvinciaBody, provinciaExists, uniqueLugar, createLugar
);
router.put(
  '/:id', verifyToken, isAdmin, validateIdParam,
  lugarExists,
  uploadLugarTuristicoProvinciaImage.single('imagen'),
  validateLugarProvinciaBody, provinciaExists, uniqueLugar, updateLugar
);
router.delete('/:id', verifyToken, isAdmin, validateIdParam, lugarExists, deleteLugar);

export default router;
