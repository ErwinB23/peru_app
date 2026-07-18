import path from 'path';
import crypto from 'crypto';
import { env } from '../config/env.js';

let clientPromise;

const sanitizeName = (value = 'imagen') => {
  const extension = path.extname(value);
  const base = path.basename(value, extension);

  return base
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
    .slice(0, 60) || 'imagen';
};

const hasCloudinaryCredentials = () => Boolean(
  env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret
);

const getCloudinaryClient = async () => {
  if (!hasCloudinaryCredentials()) {
    throw new Error('Faltan credenciales de Cloudinary en las variables de entorno.');
  }

  if (!clientPromise) {
    clientPromise = import('cloudinary').then(({ v2: cloudinary }) => {
      cloudinary.config({
        cloud_name: env.cloudinary.cloudName,
        api_key: env.cloudinary.apiKey,
        api_secret: env.cloudinary.apiSecret,
        secure: true,
      });

      return cloudinary;
    });
  }

  return clientPromise;
};

const buildUploadOptions = ({ folder, originalName }) => ({
  resource_type: 'image',
  folder: `${env.cloudinary.folder}/${folder}`.replace(/\/{2,}/g, '/'),
  public_id: `${Date.now()}-${crypto.randomUUID()}-${sanitizeName(originalName)}`,
  overwrite: false,
  unique_filename: false,
  use_filename: false,
  invalidate: true,
  tags: ['peru-app', env.nodeEnv],
});

export const uploadBufferToCloudinary = async (buffer, options) => {
  const cloudinary = await getCloudinaryClient();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      buildUploadOptions(options),
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

export const uploadFileToCloudinary = async (filePath, options) => {
  const cloudinary = await getCloudinaryClient();
  return cloudinary.uploader.upload(filePath, buildUploadOptions(options));
};

export const deleteCloudinaryAsset = async (publicId) => {
  if (!publicId || !hasCloudinaryCredentials()) {
    return false;
  }

  const cloudinary = await getCloudinaryClient();
  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: 'image',
    invalidate: true,
  });

  return ['ok', 'not found'].includes(result?.result);
};

export const getCloudinaryPublicIdFromUrl = (storedUrl) => {
  if (typeof storedUrl !== 'string' || !storedUrl.includes('res.cloudinary.com')) {
    return null;
  }

  try {
    const url = new URL(storedUrl);
    const segments = url.pathname.split('/').filter(Boolean);
    const uploadIndex = segments.indexOf('upload');

    if (uploadIndex < 0) {
      return null;
    }

    const afterUpload = segments.slice(uploadIndex + 1);
    const versionIndex = afterUpload.findIndex((segment) => /^v\d+$/.test(segment));
    const publicIdSegments = versionIndex >= 0
      ? afterUpload.slice(versionIndex + 1)
      : afterUpload;

    if (publicIdSegments.length === 0) {
      return null;
    }

    const lastIndex = publicIdSegments.length - 1;
    publicIdSegments[lastIndex] = publicIdSegments[lastIndex].replace(/\.[^.]+$/, '');

    return decodeURIComponent(publicIdSegments.join('/')) || null;
  } catch {
    return null;
  }
};

export const deleteCloudinaryAssetByUrl = async (storedUrl) => {
  const publicId = getCloudinaryPublicIdFromUrl(storedUrl);
  return publicId ? deleteCloudinaryAsset(publicId) : false;
};

export const verifyCloudinaryConnection = async () => {
  const cloudinary = await getCloudinaryClient();
  return cloudinary.api.ping();
};
