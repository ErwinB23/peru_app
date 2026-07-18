import { cleanupRequestFiles } from '../utils/fileCleanup.js';
import { AppError, errorPayload, normalizeError } from '../utils/httpErrors.js';

export const notFoundHandler = (req, res) => {
  const error = new AppError(
    'Ruta no encontrada',
    404,
    'ROUTE_NOT_FOUND',
    [{ field: 'path', message: req.originalUrl }]
  );

  return res.status(404).json(errorPayload(error));
};

export const errorHandler = async (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  await cleanupRequestFiles(req);

  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    const jsonError = new AppError(
      'El cuerpo JSON no es válido',
      400,
      'INVALID_JSON'
    );
    return res.status(400).json(errorPayload(jsonError));
  }

  if (error.type === 'entity.too.large') {
    const bodyError = new AppError(
      'El cuerpo de la solicitud es demasiado grande',
      413,
      'REQUEST_TOO_LARGE'
    );
    return res.status(413).json(errorPayload(bodyError));
  }

  if (error.code === 'CORS_ORIGIN_DENIED') {
    const corsError = new AppError(
      'Origen no autorizado por CORS',
      403,
      'CORS_ORIGIN_DENIED'
    );
    return res.status(403).json(errorPayload(corsError));
  }

  const normalized = normalizeError(error);

  if (normalized.status >= 500) {
    console.error('Error no controlado:', error);
  }

  return res.status(normalized.status).json(errorPayload(normalized));
};
