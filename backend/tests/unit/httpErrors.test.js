import { describe, expect, test } from '@jest/globals';
import {
  AppError,
  errorPayload,
  normalizeError
} from '../../src/utils/httpErrors.js';

describe('normalizacion de errores HTTP', () => {
  test('conserva un AppError controlado', () => {
    const source = new AppError('No encontrado', 404, 'RESOURCE_NOT_FOUND');
    expect(normalizeError(source)).toBe(source);
  });

  test('mapea duplicados SQL Server a 409', () => {
    const error = normalizeError({ number: 2627, message: 'duplicate key' });
    expect(error.status).toBe(409);
    expect(error.code).toBe('DUPLICATE_RESOURCE');
  });

  test('mapea conflicto de llave foranea al eliminar a 409', () => {
    const error = normalizeError({
      number: 547,
      message: 'The DELETE statement conflicted with the REFERENCE constraint'
    });
    expect(error.status).toBe(409);
    expect(error.code).toBe('RELATED_DATA_CONFLICT');
  });

  test('mapea archivo grande a 413', () => {
    const error = normalizeError({ code: 'LIMIT_FILE_SIZE' });
    expect(error.status).toBe(413);
    expect(error.code).toBe('FILE_TOO_LARGE');
  });

  test('solo expone detalles cuando son validos', () => {
    const payload = errorPayload(new AppError(
      'Datos invalidos',
      400,
      'VALIDATION_ERROR',
      [{ field: 'email', message: 'Formato invalido' }]
    ));

    expect(payload).toEqual({
      error: 'Datos invalidos',
      code: 'VALIDATION_ERROR',
      details: [{ field: 'email', message: 'Formato invalido' }]
    });
  });
});
