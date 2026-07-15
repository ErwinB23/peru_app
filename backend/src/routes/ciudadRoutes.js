import express from 'express';
import {
  getCiudades,
  getCiudadById,
  createCiudad,
  updateCiudad,
  deleteCiudad
} from '../controllers/ciudadController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import { uploadCiudadImage } from '../middlewares/uploadMiddleware.js';
import {
  ensureRelationExists,
  ensureResourceExists,
  ensureUniqueName
} from '../middlewares/dataIntegrityMiddleware.js';
import {
  validateCiudadBody,
  validateCiudadQuery,
  validateIdParam
} from '../validators/validationMiddleware.js';

const router = express.Router();
const ciudadResourceExists = ensureResourceExists('Ciudades');
const distritoExists = ensureRelationExists('distritos', 'distrito_id');
const uniqueCiudad = ensureUniqueName('Ciudades');

router.get('/', verifyToken, validateCiudadQuery, getCiudades);
router.get('/:id', verifyToken, validateIdParam, getCiudadById);

router.post(
  '/',
  verifyToken,
  isAdmin,
  uploadCiudadImage.single('imagen_fondo'),
  validateCiudadBody,
  distritoExists,
  uniqueCiudad,
  createCiudad
);
router.put(
  '/:id',
  verifyToken,
  isAdmin,
  validateIdParam,
  ciudadResourceExists,
  uploadCiudadImage.single('imagen_fondo'),
  validateCiudadBody,
  distritoExists,
  uniqueCiudad,
  updateCiudad
);
router.delete('/:id', verifyToken, isAdmin, validateIdParam, ciudadResourceExists, deleteCiudad);

export default router;
