import multer from 'multer';
import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';
import crypto from 'crypto';
import { AppError } from '../utils/httpErrors.js';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = Object.freeze({
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp']
});

const createUploadPath = (folderName) => {
  const uploadPath = path.join(process.cwd(), 'uploads', folderName);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  return uploadPath;
};

const createStorage = (folderName) => {
  const uploadPath = createUploadPath(folderName);

  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename: (req, file, cb) => {
      const extension = path.extname(file.originalname).toLowerCase();
      const cleanName = path
        .basename(file.originalname, extension)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase()
        .slice(0, 60) || 'imagen';

      cb(null, `${Date.now()}-${crypto.randomUUID()}-${cleanName}${extension}`);
    },
  });
};

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ALLOWED_IMAGE_TYPES[file.mimetype];

  if (!allowedExtensions || !allowedExtensions.includes(extension)) {
    const error = new Error('Solo se permiten imágenes JPG, JPEG, PNG o WEBP');
    error.code = 'UNSUPPORTED_MEDIA_TYPE';
    error.status = 415;
    return cb(error, false);
  }

  return cb(null, true);
};


const getRequestFiles = (req) => {
  const files = [];

  if (req.file) {
    files.push(req.file);
  }

  if (Array.isArray(req.files)) {
    files.push(...req.files);
  } else if (req.files && typeof req.files === 'object') {
    for (const fieldFiles of Object.values(req.files)) {
      if (Array.isArray(fieldFiles)) {
        files.push(...fieldFiles);
      }
    }
  }

  return files;
};

const detectImageType = (buffer) => {
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return 'image/jpeg';
  }

  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return 'image/png';
  }

  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return 'image/webp';
  }

  return null;
};

export const verifyUploadedImageSignatures = async (req, res, next) => {
  try {
    const files = getRequestFiles(req);

    for (const file of files) {
      const handle = await fsPromises.open(file.path, 'r');
      const buffer = Buffer.alloc(16);

      try {
        await handle.read(buffer, 0, buffer.length, 0);
      } finally {
        await handle.close();
      }

      const detectedType = detectImageType(buffer);

      if (!detectedType || detectedType !== file.mimetype) {
        return next(new AppError(
          'El contenido del archivo no corresponde a una imagen JPG, PNG o WEBP válida',
          415,
          'INVALID_IMAGE_SIGNATURE'
        ));
      }
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

const createImageUpload = (folderName) => multer({
  storage: createStorage(folderName),
  fileFilter,
  limits: {
    fileSize: MAX_IMAGE_SIZE,
    files: 4
  },
});

export const uploadDepartamentoImage = createImageUpload('departamentos');
export const uploadLugarTuristicoImage = createImageUpload('lugares-turisticos');
export const uploadComidaTipicaImage = createImageUpload('comidas-tipicas');
export const uploadProvinciaImage = createImageUpload('provincias');
export const uploadLugarTuristicoProvinciaImage = createImageUpload('lugares-turisticos-provincias');
export const uploadComidaTipicaProvinciaImage = createImageUpload('comidas-tipicas-provincias');
export const uploadDistritoImage = createImageUpload('distritos');
export const uploadLugarTuristicoDistritoImage = createImageUpload('lugares-turisticos-distritos');
export const uploadComidaTipicaDistritoImage = createImageUpload('comidas-tipicas-distritos');
export const uploadCiudadImage = createImageUpload('ciudades');
export const uploadLugarTuristicoCiudadImage = createImageUpload('lugares-turisticos-ciudades');
export const uploadComidaTipicaCiudadImage = createImageUpload('comidas-tipicas-ciudades');
