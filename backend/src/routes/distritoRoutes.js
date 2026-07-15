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

const router = express.Router();

router.get('/', verifyToken, getDistritos);
router.get('/:id', verifyToken, getDistritoById);

router.post(
  '/',
  verifyToken,
  isAdmin,
  uploadDistritoImage.single('imagen_fondo'),
  createDistrito
);
router.put(
  '/:id',
  verifyToken,
  isAdmin,
  uploadDistritoImage.single('imagen_fondo'),
  updateDistrito
);
router.delete('/:id', verifyToken, isAdmin, deleteDistrito);

export default router;
