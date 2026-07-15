import express from 'express';
import { uploadProvinciaImage } from '../middlewares/uploadMiddleware.js';
import {
  getProvincias,
  getProvinciaById,
  createProvincia,
  updateProvincia,
  deleteProvincia
} from '../controllers/provinciaController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getProvincias);
router.get('/:id', verifyToken, getProvinciaById);

router.post(
  '/',
  verifyToken,
  isAdmin,
  uploadProvinciaImage.single('imagen_fondo'),
  createProvincia
);
router.put(
  '/:id',
  verifyToken,
  isAdmin,
  uploadProvinciaImage.single('imagen_fondo'),
  updateProvincia
);
router.delete('/:id', verifyToken, isAdmin, deleteProvincia);

export default router;
