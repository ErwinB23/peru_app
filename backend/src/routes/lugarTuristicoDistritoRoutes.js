import express from 'express';
import {
  getLugaresByDistritoId,
  getLugarById,
  createLugar,
  updateLugar,
  deleteLugar
} from '../controllers/lugarTuristicoDistritoController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import { uploadLugarTuristicoDistritoImage } from '../middlewares/uploadMiddleware.js';
import {
  ensureRelationExists,
  ensureResourceExists,
  ensureUniqueName
} from '../middlewares/dataIntegrityMiddleware.js';
import {
  validateDistritoIdParam,
  validateIdParam,
  validateLugarDistritoBody
} from '../validators/validationMiddleware.js';

const router = express.Router();
const lugarExists = ensureResourceExists('LugaresTuristicosDistritos');
const distritoExists = ensureRelationExists('distritos', 'distrito_id');
const uniqueLugar = ensureUniqueName('LugaresTuristicosDistritos');

router.get('/distrito/:distritoId', verifyToken, validateDistritoIdParam, getLugaresByDistritoId);
router.get('/:id', verifyToken, validateIdParam, getLugarById);
router.post(
  '/', verifyToken, isAdmin,
  uploadLugarTuristicoDistritoImage.single('imagen'),
  validateLugarDistritoBody, distritoExists, uniqueLugar, createLugar
);
router.put(
  '/:id', verifyToken, isAdmin, validateIdParam,
  lugarExists,
  uploadLugarTuristicoDistritoImage.single('imagen'),
  validateLugarDistritoBody, distritoExists, uniqueLugar, updateLugar
);
router.delete('/:id', verifyToken, isAdmin, validateIdParam, lugarExists, deleteLugar);

export default router;
