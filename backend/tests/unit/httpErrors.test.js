import { describe, expect, jest, test } from '@jest/globals';
import {
  AppError,
  errorPayload,
  handleControllerError,
  normalizeError
} from '../../src/utils/httpErrors.js';
import { createRequest, createResponse } from '../helpers/httpMocks.js';

describe('AppError y normalizacion HTTP', () => {
  test('conserva un AppError controlado con sus propiedades', () => {
    const source = new AppError(
      'No encontrado',
      404,
      'RESOURCE_NOT_FOUND',
      [{ field: 'id', message: 'No existe' }]
    );

    expect(normalizeError(source)).toBe(source);
    expect(source.name).toBe('AppError');
    expect(source.details).toHaveLength(1);
  });

  test.each([2601, 2627])('mapea el duplicado SQL %s a 409', (number) => {
    const error = normalizeError({ number, message: 'duplicate key' });

    expect(error.status).toBe(409);
    expect(error.code).toBe('DUPLICATE_RESOURCE');
  });

  test('obtiene el numero SQL desde originalError.info', () => {
    const error = normalizeError({
      originalError: {
        info: {
          number: 2627,
          message: 'Violation of UNIQUE KEY constraint'
        }
      }
    });

    expect(error.status).toBe(409);
    expect(error.code).toBe('DUPLICATE_RESOURCE');
  });

  test('obtiene el numero SQL desde precedingErrors', () => {
    const error = normalizeError({
      precedingErrors: [{ number: 515 }],
      message: 'Cannot insert NULL'
    });

    expect(error.status).toBe(400);
    expect(error.code).toBe('INVALID_DATABASE_VALUE');
  });

  test('mapea conflicto de llave foranea al eliminar a 409', () => {
    const error = normalizeError({
      number: 547,
      message: 'The DELETE statement conflicted with the REFERENCE constraint'
    });

    expect(error.status).toBe(409);
    expect(error.code).toBe('RELATED_DATA_CONFLICT');
  });

  test('mapea una restriccion CHECK a 400', () => {
    const error = normalizeError({
      number: 547,
      message: 'The INSERT statement conflicted with the CHECK constraint'
    });

    expect(error.status).toBe(400);
    expect(error.code).toBe('CHECK_CONSTRAINT_FAILED');
  });

  test('mapea una relacion foranea invalida a 409', () => {
    const error = normalizeError({
      number: 547,
      message: 'The INSERT statement conflicted with the FOREIGN KEY constraint'
    });

    expect(error.status).toBe(409);
    expect(error.code).toBe('FOREIGN_KEY_CONFLICT');
  });

  test.each([515, 245, 8114, 8115, 8152, 2628])(
    'mapea el error de valor SQL %s a 400',
    (number) => {
      const error = normalizeError({ number, message: 'invalid database value' });

      expect(error.status).toBe(400);
      expect(error.code).toBe('INVALID_DATABASE_VALUE');
    }
  );

  test('usa el fallback ante un error SQL no reconocido', () => {
    const error = normalizeError(
      { number: 99999, message: 'unknown sql error' },
      'Fallo controlado de prueba'
    );

    expect(error.status).toBe(500);
    expect(error.code).toBe('INTERNAL_ERROR');
    expect(error.message).toBe('Fallo controlado de prueba');
  });

  test('mapea archivo grande a 413', () => {
    const error = normalizeError({ code: 'LIMIT_FILE_SIZE' });

    expect(error.status).toBe(413);
    expect(error.code).toBe('FILE_TOO_LARGE');
  });

  test('mapea campo inesperado de Multer a 400', () => {
    const error = normalizeError({ code: 'LIMIT_UNEXPECTED_FILE' });

    expect(error.status).toBe(400);
    expect(error.code).toBe('UNEXPECTED_FILE');
  });

  test('mapea exceso de archivos a 400', () => {
    const error = normalizeError({ code: 'LIMIT_FILE_COUNT' });

    expect(error.status).toBe(400);
    expect(error.code).toBe('TOO_MANY_FILES');
  });

  test('mapea tipo multimedia no permitido a 415 conservando el mensaje', () => {
    const error = normalizeError({
      code: 'UNSUPPORTED_MEDIA_TYPE',
      message: 'Firma binaria no permitida'
    });

    expect(error.status).toBe(415);
    expect(error.code).toBe('UNSUPPORTED_MEDIA_TYPE');
    expect(error.message).toBe('Firma binaria no permitida');
  });

  test('usa el mensaje predeterminado para tipo multimedia no permitido', () => {
    const error = normalizeError({ code: 'UNSUPPORTED_MEDIA_TYPE' });

    expect(error.status).toBe(415);
    expect(error.message).toMatch(/tipo de archivo/i);
  });

  test('conserva un error HTTP generico con status, codigo y detalles', () => {
    const source = {
      status: 422,
      code: 'BUSINESS_RULE',
      message: 'Regla de negocio incumplida',
      details: [{ field: 'nombre', message: 'Valor reservado' }]
    };
    const error = normalizeError(source);

    expect(error).toBeInstanceOf(AppError);
    expect(error.status).toBe(422);
    expect(error.code).toBe('BUSINESS_RULE');
    expect(error.details).toEqual(source.details);
  });

  test('usa REQUEST_ERROR cuando un error HTTP no tiene codigo', () => {
    const error = normalizeError({ status: 400, message: 'Solicitud incorrecta' });

    expect(error.status).toBe(400);
    expect(error.code).toBe('REQUEST_ERROR');
  });

  test('ignora status fuera del intervalo HTTP de error', () => {
    const error = normalizeError({ status: 200, message: 'No debe aceptarse' });

    expect(error.status).toBe(500);
    expect(error.code).toBe('INTERNAL_ERROR');
  });
});

describe('errorPayload', () => {
  test('expone detalles solamente cuando son un arreglo no vacio', () => {
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

  test.each([undefined, [], 'detalle-no-valido'])(
    'no expone details para %p',
    (details) => {
      const payload = errorPayload(new AppError(
        'Error controlado',
        400,
        'CONTROLLED',
        details
      ));

      expect(payload).toEqual({
        error: 'Error controlado',
        code: 'CONTROLLED'
      });
    }
  );
});

describe('handleControllerError', () => {
  test('responde con el AppError normalizado', async () => {
    const req = createRequest();
    const res = createResponse();

    await handleControllerError(
      new AppError('Duplicado', 409, 'DUPLICATE_RESOURCE'),
      req,
      res,
      'Fallback'
    );

    expect(res.statusCode).toBe(409);
    expect(res.body).toEqual({
      error: 'Duplicado',
      code: 'DUPLICATE_RESOURCE'
    });
  });

  test('registra y oculta la causa interna de un error 500', async () => {
    const req = createRequest();
    const res = createResponse();
    const source = new Error('password=secreto-interno');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await handleControllerError(source, req, res, 'Error seguro para el cliente');

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      error: 'Error seguro para el cliente',
      code: 'INTERNAL_ERROR'
    });
    expect(JSON.stringify(res.body)).not.toContain('secreto-interno');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
