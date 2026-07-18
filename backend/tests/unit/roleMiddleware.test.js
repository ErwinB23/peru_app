import { describe, expect, jest, test } from '@jest/globals';
import { isAdmin } from '../../src/middlewares/roleMiddleware.js';
import { createRequest, createResponse } from '../helpers/httpMocks.js';

describe('isAdmin', () => {
  test('devuelve 401 cuando no existe usuario autenticado', () => {
    const req = createRequest();
    const res = createResponse();
    const next = jest.fn();

    isAdmin(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/no autenticado/i);
    expect(next).not.toHaveBeenCalled();
  });

  test('devuelve 403 para un usuario normal', () => {
    const req = createRequest({ user: { id: 2, rol: 'usuario' } });
    const res = createResponse();
    const next = jest.fn();

    isAdmin(req, res, next);

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toMatch(/administrador/i);
    expect(next).not.toHaveBeenCalled();
  });

  test('permite continuar a un administrador', () => {
    const req = createRequest({ user: { id: 1, rol: 'admin' } });
    const res = createResponse();
    const next = jest.fn();

    isAdmin(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.body).toBeUndefined();
  });

  test('devuelve 500 ante un error inesperado al leer el usuario', () => {
    const req = {};
    Object.defineProperty(req, 'user', {
      get() {
        throw new Error('lectura inesperada');
      }
    });
    const res = createResponse();
    const next = jest.fn();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    isAdmin(req, res, next);

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toMatch(/verificar los permisos/i);
    expect(next).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

});
