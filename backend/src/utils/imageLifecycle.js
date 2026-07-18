import fs from 'fs/promises';
import path from 'path';
import {
  deleteCloudinaryAssetByUrl,
  getCloudinaryPublicIdFromUrl
} from '../services/cloudinaryService.js';

const uploadsRoot = path.resolve(process.cwd(), 'uploads');

const toLocalAbsolutePath = (storedPath) => {
  if (typeof storedPath !== 'string') {
    return null;
  }

  const value = storedPath.trim().split('?')[0].split('#')[0];

  if (!value.startsWith('/uploads/')) {
    return null;
  }

  const relativePath = value.replace(/^\/+/, '').replace(/\//g, path.sep);
  const absolutePath = path.resolve(process.cwd(), relativePath);
  const relativeToUploads = path.relative(uploadsRoot, absolutePath);

  if (
    relativeToUploads.startsWith('..') ||
    path.isAbsolute(relativeToUploads) ||
    relativeToUploads === ''
  ) {
    return null;
  }

  return absolutePath;
};

export const deleteStoredImage = async (storedPath) => {
  const cloudinaryPublicId = getCloudinaryPublicIdFromUrl(storedPath);

  if (cloudinaryPublicId) {
    try {
      return await deleteCloudinaryAssetByUrl(storedPath);
    } catch (error) {
      console.error(`No se pudo eliminar la imagen Cloudinary ${storedPath}:`, error.message);
      return false;
    }
  }

  const absolutePath = toLocalAbsolutePath(storedPath);

  if (!absolutePath) {
    return false;
  }

  try {
    await fs.unlink(absolutePath);
    return true;
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error(`No se pudo eliminar la imagen ${storedPath}:`, error.message);
    }
    return false;
  }
};

export const deleteStoredImages = async (storedPaths = []) => {
  const uniquePaths = [...new Set(storedPaths.filter(Boolean))];
  await Promise.all(uniquePaths.map((storedPath) => deleteStoredImage(storedPath)));
};

export const cleanupReplacedImages = async (previousResource, currentResource, fields) => {
  const replacedPaths = fields
    .map((field) => ({
      previous: previousResource?.[field],
      current: currentResource?.[field]
    }))
    .filter(({ previous, current }) => previous && previous !== current)
    .map(({ previous }) => previous);

  await deleteStoredImages(replacedPaths);
};

export const cleanupResourceImages = async (resource, fields) => {
  await deleteStoredImages(fields.map((field) => resource?.[field]));
};
