import express from 'express';
import {
  getDistritos,
  getDistritoById,
  createDistrito,
  updateDistrito,
  deleteDistrito
} from '../controllers/distritoController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import { uploadDistritoImage } from '../middlewares/uploadMiddleware.js';
import {
  ensureRelationExists,
  ensureResourceExists,
  ensureUniqueName
} from '../middlewares/dataIntegrityMiddleware.js';
import {
  validateDistritoBody,
  validateDistritoQuery,
  validateIdParam
} from '../validators/validationMiddleware.js';

const router = express.Router();
const distritoResourceExists = ensureResourceExists('Distritos');
const provinciaExists = ensureRelationExists('provincias', 'provincia_id');
const uniqueDistrito = ensureUniqueName('Distritos');

router.get('/', verifyToken, validateDistritoQuery, getDistritos);
router.get('/:id', verifyToken, validateIdParam, getDistritoById);

router.post(
  '/',
  verifyToken,
  isAdmin,
  uploadDistritoImage.single('imagen_fondo'),
  validateDistritoBody,
  provinciaExists,
  uniqueDistrito,
  createDistrito
);
router.put(
  '/:id',
  verifyToken,
  isAdmin,
  validateIdParam,
  distritoResourceExists,
  uploadDistritoImage.single('imagen_fondo'),
  validateDistritoBody,
  provinciaExists,
  uniqueDistrito,
  updateDistrito
);
router.delete('/:id', verifyToken, isAdmin, validateIdParam, distritoResourceExists, deleteDistrito);

export default router;
