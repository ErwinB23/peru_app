import express from 'express';
import {
  getComidasByDepartamentoId,
  getComidaById,
  createComidaTipica,
  updateComidaTipica,
  deleteComidaTipica,
} from '../controllers/comidaTipicaController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import { uploadComidaTipicaImage } from '../middlewares/uploadMiddleware.js';
import {
  ensureRelationExists,
  ensureResourceExists,
  ensureUniqueName
} from '../middlewares/dataIntegrityMiddleware.js';
import {
  validateComidaDepartamentoBody,
  validateDepartamentoIdParam,
  validateIdParam
} from '../validators/validationMiddleware.js';

const router = express.Router();
const comidaExists = ensureResourceExists('ComidasTipicas');
const departamentoExists = ensureRelationExists('departamentos', 'departamento_id');
const uniqueComida = ensureUniqueName('ComidasTipicas');

router.get(
  '/departamento/:departamentoId',
  verifyToken,
  validateDepartamentoIdParam,
  getComidasByDepartamentoId,
);
router.get('/:id', verifyToken, validateIdParam, getComidaById);

router.post(
  '/',
  verifyToken,
  isAdmin,
  uploadComidaTipicaImage.single('imagen'),
  validateComidaDepartamentoBody,
  departamentoExists,
  uniqueComida,
  createComidaTipica,
);

router.put(
  '/:id',
  verifyToken,
  isAdmin,
  validateIdParam,
  comidaExists,
  uploadComidaTipicaImage.single('imagen'),
  validateComidaDepartamentoBody,
  departamentoExists,
  uniqueComida,
  updateComidaTipica,
);

router.delete('/:id', verifyToken, isAdmin, validateIdParam, comidaExists, deleteComidaTipica);

export default router;
