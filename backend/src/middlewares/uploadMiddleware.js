import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

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
