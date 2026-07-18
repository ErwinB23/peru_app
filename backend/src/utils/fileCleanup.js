import fs from 'fs/promises';
import { deleteCloudinaryAsset } from '../services/cloudinaryService.js';

const collectFiles = (req) => {
  const files = [];

  if (req?.file) {
    files.push(req.file);
  }

  if (Array.isArray(req?.files)) {
    files.push(...req.files);
  } else if (req?.files && typeof req.files === 'object') {
    for (const value of Object.values(req.files)) {
      if (Array.isArray(value)) {
        files.push(...value);
      }
    }
  }

  return files;
};

export const cleanupRequestFiles = async (req) => {
  const files = collectFiles(req);

  await Promise.all(
    files.map(async (file) => {
      if (file?.cloudinaryPublicId) {
        try {
          await deleteCloudinaryAsset(file.cloudinaryPublicId);
        } catch (error) {
          console.error(
            `No se pudo eliminar el recurso temporal Cloudinary ${file.cloudinaryPublicId}:`,
            error.message
          );
        }
      }

      if (!file?.path || /^https?:\/\//i.test(file.path)) {
        return;
      }

      try {
        await fs.unlink(file.path);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          console.error(`No se pudo eliminar el archivo temporal ${file.path}:`, error.message);
        }
      }
    })
  );
};
