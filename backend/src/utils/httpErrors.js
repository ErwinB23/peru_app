import { cleanupRequestFiles } from './fileCleanup.js';

export class AppError extends Error {
  constructor(message, status = 500, code = 'INTERNAL_ERROR', details = undefined) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const getSqlNumber = (error) => {
  return (
    error?.number ??
    error?.originalError?.info?.number ??
    error?.precedingErrors?.[0]?.number ??
    null
  );
};

const getSqlMessage = (error) => {
  return String(
    error?.originalError?.info?.message ||
    error?.message ||
    ''
  );
};

const mapSqlError = (error) => {
  const number = getSqlNumber(error);
  const message = getSqlMessage(error).toLowerCase();

  if ([2601, 2627].includes(number)) {
    return new AppError(
      'Ya existe un registro con los mismos datos únicos',
      409,
      'DUPLICATE_RESOURCE'
    );
  }

  if (number === 547) {
    if (message.includes('delete') || message.includes('elimin')) {
      return new AppError(
        'No se puede eliminar el registro porque tiene información relacionada',
        409,
        'RELATED_DATA_CONFLICT'
      );
    }

    if (message.includes('check constraint')) {
      return new AppError(
        'Los datos no cumplen las restricciones de integridad',
        400,
        'CHECK_CONSTRAINT_FAILED'
      );
    }

    return new AppError(
      'La relación indicada no existe o no es válida',
      409,
      'FOREIGN_KEY_CONFLICT'
    );
  }

  if ([515, 245, 8114, 8115, 8152, 2628].includes(number)) {
    return new AppError(
      'Los datos enviados no tienen el formato o longitud permitidos',
      400,
      'INVALID_DATABASE_VALUE'
    );
  }

  return null;
};

export const normalizeError = (error, fallbackMessage = 'Error interno inesperado') => {
  if (error instanceof AppError) {
    return error;
  }

  const sqlError = mapSqlError(error);
  if (sqlError) {
    return sqlError;
  }

  if (error?.code === 'LIMIT_FILE_SIZE') {
    return new AppError(
      'La imagen supera el tamaño máximo permitido de 5 MB',
      413,
      'FILE_TOO_LARGE'
    );
  }

  if (error?.code === 'LIMIT_UNEXPECTED_FILE') {
    return new AppError(
      'El campo o la cantidad de archivos enviados no está permitido',
      400,
      'UNEXPECTED_FILE'
    );
  }

  if (error?.code === 'UNSUPPORTED_MEDIA_TYPE') {
    return new AppError(
      error.message || 'El tipo de archivo no está permitido',
      415,
      'UNSUPPORTED_MEDIA_TYPE'
    );
  }

  if (Number.isInteger(error?.status) && error.status >= 400 && error.status < 600) {
    return new AppError(
      error.message || fallbackMessage,
      error.status,
      error.code || 'REQUEST_ERROR',
      error.details
    );
  }

  return new AppError(fallbackMessage, 500, 'INTERNAL_ERROR');
};

export const errorPayload = (error) => {
  const payload = {
    error: error.message,
    code: error.code
  };

  if (Array.isArray(error.details) && error.details.length > 0) {
    payload.details = error.details;
  }

  return payload;
};

export const handleControllerError = async (
  error,
  req,
  res,
  fallbackMessage = 'Error interno inesperado'
) => {
  await cleanupRequestFiles(req);

  const normalized = normalizeError(error, fallbackMessage);

  if (normalized.status >= 500) {
    console.error(fallbackMessage, error);
  }

  return res.status(normalized.status).json(errorPayload(normalized));
};
