import fs from 'fs/promises';

const collectFiles = (req) => {
  const files = [];

  if (req?.file?.path) {
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

  return files.filter((file) => file?.path);
};

export const cleanupRequestFiles = async (req) => {
  const files = collectFiles(req);

  await Promise.all(
    files.map(async (file) => {
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
