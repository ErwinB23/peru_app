import express from 'express';
import {
  getLugaresByCiudadId,
  getLugarById,
  createLugar,
  updateLugar,
  deleteLugar
} from '../controllers/lugarTuristicoCiudadController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import { uploadLugarTuristicoCiudadImage } from '../middlewares/uploadMiddleware.js';
import {
  ensureRelationExists,
  ensureResourceExists,
  ensureUniqueName
} from '../middlewares/dataIntegrityMiddleware.js';
import {
  validateCiudadIdParam,
  validateIdParam,
  validateLugarCiudadBody
} from '../validators/validationMiddleware.js';

const router = express.Router();
const lugarExists = ensureResourceExists('LugaresTuristicosCiudades');
const ciudadExists = ensureRelationExists('ciudades', 'ciudad_id');
const uniqueLugar = ensureUniqueName('LugaresTuristicosCiudades');

router.get('/ciudad/:ciudadId', verifyToken, validateCiudadIdParam, getLugaresByCiudadId);
router.get('/:id', verifyToken, validateIdParam, getLugarById);
router.post(
  '/', verifyToken, isAdmin,
  uploadLugarTuristicoCiudadImage.single('imagen'),
  validateLugarCiudadBody, ciudadExists, uniqueLugar, createLugar
);
router.put(
  '/:id', verifyToken, isAdmin, validateIdParam,
  lugarExists,
  uploadLugarTuristicoCiudadImage.single('imagen'),
  validateLugarCiudadBody, ciudadExists, uniqueLugar, updateLugar
);
router.delete('/:id', verifyToken, isAdmin, validateIdParam, lugarExists, deleteLugar);

export default router;
