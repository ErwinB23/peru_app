import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { createResponse } from '../helpers/httpMocks.js';

const jwtMock = {
  verify: jest.fn()
};

const userModel = {
  findUserById: jest.fn()
};

jest.unstable_mockModule('jsonwebtoken', () => ({ default: jwtMock }));
jest.unstable_mockModule('../../src/models/userModel.js', () => userModel);

const { verifyToken } = await import('../../src/middlewares/authMiddleware.js');

const createAuthRequest = (authorization) => ({
  get: jest.fn((headerName) => (
    headerName.toLowerCase() === 'authorization' ? authorization : undefined
  ))
});

beforeEach(() => {
  jwtMock.verify.mockReset();
  userModel.findUserById.mockReset();
});

describe('verifyToken', () => {
  test('devuelve 401 cuando no existe cabecera Authorization', async () => {
    const req = createAuthRequest(undefined);
    const res = createResponse();
    const next = jest.fn();

    await verifyToken(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/no se proporciono token|no se proporcionó token/i);
    expect(next).not.toHaveBeenCalled();
  });

  test.each([
    'Basic abc123',
    'Bearer',
    'Token abc123',
    '   Bearer   '
  ])('rechaza el formato de autorizacion %s', async (authorization) => {
    const req = createAuthRequest(authorization);
    const res = createResponse();
    const next = jest.fn();

    await verifyToken(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/formato/i);
    expect(jwtMock.verify).not.toHaveBeenCalled();
  });

  test.each([
    {},
    { id: 0 },
    { id: -1 },
    { id: 'abc' },
    { sub: '1.5' }
  ])('rechaza un identificador invalido contenido en el JWT', async (decoded) => {
    jwtMock.verify.mockReturnValue(decoded);
    const req = createAuthRequest('Bearer token-valido');
    const res = createResponse();
    const next = jest.fn();

    await verifyToken(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/token invalido|token inválido/i);
    expect(userModel.findUserById).not.toHaveBeenCalled();
  });

  test('acepta el identificador contenido en sub', async () => {
    jwtMock.verify.mockReturnValue({ sub: 8, iat: 10, exp: 20 });
    userModel.findUserById.mockResolvedValue({
      id: 8,
      email: 'usuario@ejemplo.com',
      rol: 'usuario'
    });
    const req = createAuthRequest('Bearer token-valido');
    const res = createResponse();
    const next = jest.fn();

    await verifyToken(req, res, next);

    expect(userModel.findUserById).toHaveBeenCalledWith(8);
    expect(req.user.id).toBe(8);
    expect(req.auth).toEqual({ tokenIssuedAt: 10, tokenExpiresAt: 20 });
    expect(next).toHaveBeenCalledTimes(1);
  });

  test('rechaza el token si el usuario ya no existe', async () => {
    jwtMock.verify.mockReturnValue({ id: 7 });
    userModel.findUserById.mockResolvedValue(undefined);
    const req = createAuthRequest('Bearer token-valido');
    const res = createResponse();
    const next = jest.fn();

    await verifyToken(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/usuario no existe/i);
    expect(next).not.toHaveBeenCalled();
  });

  test('establece el usuario vigente y continua', async () => {
    const currentUser = {
      id: 7,
      email: 'admin@ejemplo.com',
      rol: 'admin'
    };
    jwtMock.verify.mockReturnValue({ id: 7, iat: 100, exp: 200 });
    userModel.findUserById.mockResolvedValue(currentUser);
    const req = createAuthRequest('  Bearer   token-valido  ');
    const res = createResponse();
    const next = jest.fn();

    await verifyToken(req, res, next);

    expect(jwtMock.verify).toHaveBeenCalledWith('token-valido', expect.any(String));
    expect(req.user).toBe(currentUser);
    expect(req.auth).toEqual({ tokenIssuedAt: 100, tokenExpiresAt: 200 });
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.body).toBeUndefined();
  });

  test('devuelve 401 para un token expirado', async () => {
    const error = new Error('expired');
    error.name = 'TokenExpiredError';
    jwtMock.verify.mockImplementation(() => {
      throw error;
    });
    const req = createAuthRequest('Bearer expirado');
    const res = createResponse();
    const next = jest.fn();

    await verifyToken(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/expirado/i);
  });

  test.each(['JsonWebTokenError', 'NotBeforeError'])(
    'devuelve 401 para %s',
    async (errorName) => {
      const error = new Error('invalid');
      error.name = errorName;
      jwtMock.verify.mockImplementation(() => {
        throw error;
      });
      const req = createAuthRequest('Bearer invalido');
      const res = createResponse();
      const next = jest.fn();

      await verifyToken(req, res, next);

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toMatch(/invalido|inválido/i);
    }
  );

  test('devuelve 500 si ocurre un error inesperado al consultar la sesion', async () => {
    jwtMock.verify.mockReturnValue({ id: 7 });
    userModel.findUserById.mockRejectedValue(new Error('database down'));
    const req = createAuthRequest('Bearer token-valido');
    const res = createResponse();
    const next = jest.fn();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await verifyToken(req, res, next);

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toMatch(/no fue posible validar/i);
    expect(next).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
