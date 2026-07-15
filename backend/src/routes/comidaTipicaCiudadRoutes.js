import express from 'express';
import {
  getComidasByCiudadId,
  getComidaById,
  createComida,
  updateComida,
  deleteComida
} from '../controllers/comidaTipicaCiudadController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import { uploadComidaTipicaCiudadImage } from '../middlewares/uploadMiddleware.js';
import {
  ensureRelationExists,
  ensureResourceExists,
  ensureUniqueName
} from '../middlewares/dataIntegrityMiddleware.js';
import {
  validateCiudadIdParam,
  validateComidaCiudadBody,
  validateIdParam
} from '../validators/validationMiddleware.js';

const router = express.Router();
const comidaExists = ensureResourceExists('ComidasTipicasCiudades');
const ciudadExists = ensureRelationExists('ciudades', 'ciudad_id');
const uniqueComida = ensureUniqueName('ComidasTipicasCiudades');

router.get('/ciudad/:ciudadId', verifyToken, validateCiudadIdParam, getComidasByCiudadId);
router.get('/:id', verifyToken, validateIdParam, getComidaById);
router.post(
  '/', verifyToken, isAdmin,
  uploadComidaTipicaCiudadImage.single('imagen'),
  validateComidaCiudadBody, ciudadExists, uniqueComida, createComida
);
router.put(
  '/:id', verifyToken, isAdmin, validateIdParam,
  comidaExists,
  uploadComidaTipicaCiudadImage.single('imagen'),
  validateComidaCiudadBody, ciudadExists, uniqueComida, updateComida
);
router.delete('/:id', verifyToken, isAdmin, validateIdParam, comidaExists, deleteComida);

export default router;
