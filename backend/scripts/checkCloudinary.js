import { env } from '../src/config/env.js';
import { verifyCloudinaryConnection } from '../src/services/cloudinaryService.js';

if (env.imageStorage !== 'cloudinary') {
  console.error('IMAGE_STORAGE debe ser cloudinary para ejecutar esta comprobación.');
  process.exit(1);
}

try {
  const result = await verifyCloudinaryConnection();
  console.log('[OK] Conexión con Cloudinary verificada.');
  console.log(JSON.stringify({ status: result?.status || 'ok', cloudName: env.cloudinary.cloudName }, null, 2));
} catch (error) {
  console.error('[ERROR] No se pudo conectar con Cloudinary:', error.message);
  process.exit(1);
}
