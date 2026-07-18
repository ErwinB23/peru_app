import multer from 'multer';
import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';
import crypto from 'crypto';
import { env } from '../config/env.js';
import { AppError } from '../utils/httpErrors.js';
import {
  deleteCloudinaryAsset,
  uploadBufferToCloudinary
} from '../services/cloudinaryService.js';

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

const createLocalStorage = (folderName) => {
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

const fileFilterForFolder = (folderName) => (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ALLOWED_IMAGE_TYPES[file.mimetype];

  file.storageFolder = folderName;

  if (!allowedExtensions || !allowedExtensions.includes(extension)) {
    const error = new Error('Solo se permiten imágenes JPG, JPEG, PNG o WEBP');
    error.code = 'UNSUPPORTED_MEDIA_TYPE';
    error.status = 415;
    return cb(error, false);
  }

  return cb(null, true);
};

export const getRequestFiles = (req) => {
  const files = [];

  if (req?.file) {
    files.push(req.file);
  }

  if (Array.isArray(req?.files)) {
    files.push(...req.files);
  } else if (req?.files && typeof req.files === 'object') {
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

const readSignature = async (file) => {
  if (Buffer.isBuffer(file.buffer)) {
    return file.buffer.subarray(0, 16);
  }

  const handle = await fsPromises.open(file.path, 'r');
  const buffer = Buffer.alloc(16);

  try {
    await handle.read(buffer, 0, buffer.length, 0);
  } finally {
    await handle.close();
  }

  return buffer;
};

export const verifyUploadedImageSignatures = async (req, res, next) => {
  try {
    const files = getRequestFiles(req);

    for (const file of files) {
      const buffer = await readSignature(file);
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

export const persistUploadedImages = async (req, res, next) => {
  const files = getRequestFiles(req);

  if (files.length === 0) {
    return next();
  }

  if (env.imageStorage === 'local') {
    for (const file of files) {
      file.storageUrl = `/uploads/${file.storageFolder}/${file.filename}`;
    }
    return next();
  }

  const uploadedPublicIds = [];

  try {
    for (const file of files) {
      const result = await uploadBufferToCloudinary(file.buffer, {
        folder: file.storageFolder,
        originalName: file.originalname
      });

      file.storageUrl = result.secure_url;
      file.cloudinaryPublicId = result.public_id;
      uploadedPublicIds.push(result.public_id);
    }

    return next();
  } catch (error) {
    await Promise.allSettled(
      uploadedPublicIds.map((publicId) => deleteCloudinaryAsset(publicId))
    );

    return next(new AppError(
      'No se pudo almacenar la imagen en Cloudinary',
      502,
      'CLOUDINARY_UPLOAD_FAILED'
    ));
  }
};

const createImageUpload = (folderName) => multer({
  storage: env.imageStorage === 'cloudinary'
    ? multer.memoryStorage()
    : createLocalStorage(folderName),
  fileFilter: fileFilterForFolder(folderName),
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
