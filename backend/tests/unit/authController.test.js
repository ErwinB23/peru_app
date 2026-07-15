import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { createRequest, createResponse } from '../helpers/httpMocks.js';

const userModel = {
  findUserByEmail: jest.fn(),
  createUser: jest.fn(),
  findUserById: jest.fn(),
  findUserByIdWithPassword: jest.fn(),
  updateUser: jest.fn(),
  updatePassword: jest.fn()
};

const bcryptMock = {
  hash: jest.fn(),
  compare: jest.fn()
};

const jwtMock = {
  sign: jest.fn()
};

jest.unstable_mockModule('../../src/models/userModel.js', () => userModel);
jest.unstable_mockModule('bcrypt', () => ({ default: bcryptMock }));
jest.unstable_mockModule('jsonwebtoken', () => ({ default: jwtMock }));

const {
  register,
  login,
  getProfile,
  updateProfile
} = await import('../../src/controllers/authController.js');

const validRegistration = {
  nombres: '  Ana  ',
  apellidos: '  Quispe  ',
  fecha_nacimiento: '2000-05-20',
  email: ' ANA@EJEMPLO.COM ',
  password: 'ClaveSegura123'
};

const authenticatedUser = {
  id: 7,
  nombres: 'Ana',
  apellidos: 'Quispe',
  email: 'ana@ejemplo.com',
  rol: 'usuario'
};

beforeEach(() => {
  jest.clearAllMocks();
  for (const fn of Object.values(userModel)) {
    fn.mockReset();
  }
  bcryptMock.hash.mockReset();
  bcryptMock.compare.mockReset();
  jwtMock.sign.mockReset();
});

describe('authController.register', () => {
  test('rechaza campos obligatorios ausentes', async () => {
    const req = createRequest({ body: { nombres: 'Ana' } });
    const res = createResponse();

    await register(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/obligatorios/i);
    expect(userModel.findUserByEmail).not.toHaveBeenCalled();
  });

  test('rechaza una contrasena menor de seis caracteres', async () => {
    const req = createRequest({
      body: { ...validRegistration, password: '12345' }
    });
    const res = createResponse();

    await register(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/al menos 6/i);
  });

  test('rechaza un correo duplicado y normaliza el email', async () => {
    userModel.findUserByEmail.mockResolvedValue(authenticatedUser);
    const req = createRequest({ body: { ...validRegistration } });
    const res = createResponse();

    await register(req, res);

    expect(userModel.findUserByEmail).toHaveBeenCalledWith('ana@ejemplo.com');
    expect(res.statusCode).toBe(409);
    expect(res.body.code).toBe('DUPLICATE_RESOURCE');
  });

  test('registra un usuario normal con contrasena cifrada', async () => {
    userModel.findUserByEmail.mockResolvedValue(undefined);
    bcryptMock.hash.mockResolvedValue('hash-seguro');
    userModel.createUser.mockResolvedValue(authenticatedUser);
    const req = createRequest({ body: { ...validRegistration } });
    const res = createResponse();

    await register(req, res);

    expect(bcryptMock.hash).toHaveBeenCalledWith('ClaveSegura123', 10);
    expect(userModel.createUser).toHaveBeenCalledWith(
      'Ana',
      'Quispe',
      '2000-05-20',
      'ana@ejemplo.com',
      'hash-seguro',
      'usuario'
    );
    expect(res.statusCode).toBe(201);
    expect(res.body.user).toEqual(authenticatedUser);
    expect(res.body.user.password).toBeUndefined();
  });

  test('normaliza como 500 un error inesperado del modelo', async () => {
    userModel.findUserByEmail.mockRejectedValue(new Error('database down'));
    const req = createRequest({ body: { ...validRegistration } });
    const res = createResponse();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await register(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body.code).toBe('INTERNAL_ERROR');
    expect(res.body.error).toBe('Error al registrar usuario');
    consoleSpy.mockRestore();
  });
});

describe('authController.login', () => {
  test('rechaza cuando falta email o contrasena', async () => {
    const req = createRequest({ body: { email: 'ana@ejemplo.com' } });
    const res = createResponse();

    await login(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/email y contrasena|email y contraseña/i);
  });

  test('rechaza un usuario inexistente', async () => {
    userModel.findUserByEmail.mockResolvedValue(undefined);
    const req = createRequest({
      body: { email: ' NOEXISTE@EJEMPLO.COM ', password: 'ClaveSegura123' }
    });
    const res = createResponse();

    await login(req, res);

    expect(userModel.findUserByEmail).toHaveBeenCalledWith('noexiste@ejemplo.com');
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/credenciales/i);
  });

  test('rechaza una contrasena incorrecta', async () => {
    userModel.findUserByEmail.mockResolvedValue({
      ...authenticatedUser,
      password: 'hash-guardado'
    });
    bcryptMock.compare.mockResolvedValue(false);
    const req = createRequest({
      body: { email: 'ana@ejemplo.com', password: 'incorrecta' }
    });
    const res = createResponse();

    await login(req, res);

    expect(bcryptMock.compare).toHaveBeenCalledWith('incorrecta', 'hash-guardado');
    expect(res.statusCode).toBe(401);
  });

  test('genera un JWT y devuelve solo datos seguros', async () => {
    userModel.findUserByEmail.mockResolvedValue({
      ...authenticatedUser,
      password: 'hash-guardado'
    });
    bcryptMock.compare.mockResolvedValue(true);
    jwtMock.sign.mockReturnValue('jwt-prueba');
    const req = createRequest({
      body: { email: 'ANA@EJEMPLO.COM', password: 'ClaveSegura123' }
    });
    const res = createResponse();

    await login(req, res);

    expect(jwtMock.sign).toHaveBeenCalledWith(
      { id: 7, email: 'ana@ejemplo.com' },
      expect.any(String),
      { expiresIn: expect.any(String) }
    );
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBe('jwt-prueba');
    expect(res.body.user.password).toBeUndefined();
  });

  test('normaliza como 500 un error inesperado al autenticar', async () => {
    userModel.findUserByEmail.mockRejectedValue(new Error('database down'));
    const req = createRequest({
      body: { email: 'ana@ejemplo.com', password: 'ClaveSegura123' }
    });
    const res = createResponse();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await login(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body.code).toBe('INTERNAL_ERROR');
    consoleSpy.mockRestore();
  });
});

describe('authController.getProfile', () => {
  test('devuelve el perfil del usuario autenticado', async () => {
    userModel.findUserById.mockResolvedValue(authenticatedUser);
    const req = createRequest({ user: { id: 7 } });
    const res = createResponse();

    await getProfile(req, res);

    expect(userModel.findUserById).toHaveBeenCalledWith(7);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(authenticatedUser);
  });

  test('devuelve 404 cuando el usuario ya no existe', async () => {
    userModel.findUserById.mockResolvedValue(undefined);
    const req = createRequest({ user: { id: 7 } });
    const res = createResponse();

    await getProfile(req, res);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/no encontrado/i);
  });

  test('normaliza un error inesperado al obtener perfil', async () => {
    userModel.findUserById.mockRejectedValue(new Error('database down'));
    const req = createRequest({ user: { id: 7 } });
    const res = createResponse();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await getProfile(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Error al obtener perfil');
    consoleSpy.mockRestore();
  });
});

describe('authController.updateProfile', () => {
  const baseBody = {
    nombres: 'Ana',
    apellidos: 'Quispe',
    email: 'ana@ejemplo.com',
    fecha_nacimiento: '2000-05-20'
  };

  const createAuthenticatedRequest = (body) => createRequest({
    body,
    user: { id: 7, email: 'ana@ejemplo.com', rol: 'usuario' }
  });

  test('rechaza campos obligatorios ausentes', async () => {
    const req = createAuthenticatedRequest({ nombres: 'Ana' });
    const res = createResponse();

    await updateProfile(req, res);

    expect(res.statusCode).toBe(400);
    expect(userModel.updateUser).not.toHaveBeenCalled();
  });

  test('rechaza un nuevo correo utilizado por otra cuenta', async () => {
    userModel.findUserByEmail.mockResolvedValue({ id: 99 });
    const req = createAuthenticatedRequest({
      ...baseBody,
      email: 'OTRO@EJEMPLO.COM'
    });
    const res = createResponse();

    await updateProfile(req, res);

    expect(userModel.findUserByEmail).toHaveBeenCalledWith('otro@ejemplo.com');
    expect(res.statusCode).toBe(409);
    expect(res.body.code).toBe('DUPLICATE_RESOURCE');
  });

  test('permite conservar un correo asociado al mismo usuario', async () => {
    userModel.findUserByEmail.mockResolvedValue({ id: 7 });
    userModel.updateUser.mockResolvedValue({
      ...authenticatedUser,
      email: 'nuevo@ejemplo.com'
    });
    const req = createAuthenticatedRequest({
      ...baseBody,
      email: 'NUEVO@EJEMPLO.COM'
    });
    const res = createResponse();

    await updateProfile(req, res);

    expect(res.statusCode).toBe(200);
    expect(userModel.updateUser).toHaveBeenCalled();
  });

  test('exige la contrasena actual y la nueva conjuntamente', async () => {
    const req = createAuthenticatedRequest({
      ...baseBody,
      newPassword: 'NuevaSegura123'
    });
    const res = createResponse();

    await updateProfile(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/actual y la nueva/i);
  });

  test('rechaza una nueva contrasena demasiado corta', async () => {
    const req = createAuthenticatedRequest({
      ...baseBody,
      currentPassword: 'ActualSegura123',
      newPassword: '123'
    });
    const res = createResponse();

    await updateProfile(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/al menos 6/i);
  });

  test('devuelve 404 si no encuentra el usuario con contrasena', async () => {
    userModel.findUserByIdWithPassword.mockResolvedValue(undefined);
    const req = createAuthenticatedRequest({
      ...baseBody,
      currentPassword: 'ActualSegura123',
      newPassword: 'NuevaSegura123'
    });
    const res = createResponse();

    await updateProfile(req, res);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/no encontrado/i);
  });

  test('rechaza una contrasena actual incorrecta', async () => {
    userModel.findUserByIdWithPassword.mockResolvedValue({
      ...authenticatedUser,
      password: 'hash-actual'
    });
    bcryptMock.compare.mockResolvedValue(false);
    const req = createAuthenticatedRequest({
      ...baseBody,
      currentPassword: 'Incorrecta',
      newPassword: 'NuevaSegura123'
    });
    const res = createResponse();

    await updateProfile(req, res);

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/actual incorrecta/i);
  });

  test('actualiza datos sin modificar la contrasena', async () => {
    userModel.updateUser.mockResolvedValue({
      ...authenticatedUser,
      nombres: 'Ana Maria'
    });
    const req = createAuthenticatedRequest({
      ...baseBody,
      nombres: '  Ana Maria  '
    });
    const res = createResponse();

    await updateProfile(req, res);

    expect(userModel.updateUser).toHaveBeenCalledWith(7, {
      nombres: 'Ana Maria',
      apellidos: 'Quispe',
      email: 'ana@ejemplo.com',
      fecha_nacimiento: '2000-05-20'
    });
    expect(userModel.updatePassword).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
  });

  test('actualiza datos y contrasena cuando la actual es valida', async () => {
    userModel.findUserByIdWithPassword.mockResolvedValue({
      ...authenticatedUser,
      password: 'hash-actual'
    });
    bcryptMock.compare.mockResolvedValue(true);
    bcryptMock.hash.mockResolvedValue('hash-nuevo');
    userModel.updateUser.mockResolvedValue(authenticatedUser);
    userModel.updatePassword.mockResolvedValue(undefined);
    const req = createAuthenticatedRequest({
      ...baseBody,
      currentPassword: 'ActualSegura123',
      newPassword: 'NuevaSegura123'
    });
    const res = createResponse();

    await updateProfile(req, res);

    expect(bcryptMock.compare).toHaveBeenCalledWith('ActualSegura123', 'hash-actual');
    expect(bcryptMock.hash).toHaveBeenCalledWith('NuevaSegura123', 10);
    expect(userModel.updatePassword).toHaveBeenCalledWith(7, 'hash-nuevo');
    expect(res.statusCode).toBe(200);
  });

  test('normaliza un error inesperado al actualizar perfil', async () => {
    userModel.updateUser.mockRejectedValue(new Error('database down'));
    const req = createAuthenticatedRequest({ ...baseBody });
    const res = createResponse();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await updateProfile(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Error al actualizar perfil');
    consoleSpy.mockRestore();
  });
});
