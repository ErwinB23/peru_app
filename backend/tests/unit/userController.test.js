import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { createRequest, createResponse } from '../helpers/httpMocks.js';

const userModel = {
  getAllUsers: jest.fn(),
  findUserById: jest.fn(),
  findUserByEmail: jest.fn(),
  searchUsers: jest.fn(),
  updateUserByAdmin: jest.fn(),
  deleteUser: jest.fn(),
  countAdmins: jest.fn()
};

jest.unstable_mockModule('../../src/models/userModel.js', () => userModel);

const {
  getUsers,
  searchUsersController,
  getUserById,
  updateUserAdmin,
  deleteUserAdmin
} = await import('../../src/controllers/userController.js');

const admin = {
  id: 1,
  nombres: 'Admin',
  apellidos: 'QA',
  fecha_nacimiento: '1990-01-01',
  email: 'admin.qa@peruapp.com',
  rol: 'admin'
};

const normalUser = {
  id: 2,
  nombres: 'Usuario',
  apellidos: 'QA',
  fecha_nacimiento: '2000-01-01',
  email: 'usuario.qa@peruapp.com',
  rol: 'usuario'
};

const validBody = {
  nombres: ' Usuario ',
  apellidos: ' QA ',
  fecha_nacimiento: '2000-01-01',
  email: ' USUARIO.QA@PERUAPP.COM ',
  rol: 'usuario'
};

beforeEach(() => {
  jest.clearAllMocks();
  for (const fn of Object.values(userModel)) fn.mockReset();
});

describe('userController.getUsers y searchUsersController', () => {
  test('lista usuarios', async () => {
    userModel.getAllUsers.mockResolvedValue([admin, normalUser]);
    const res = createResponse();
    await getUsers(createRequest(), res);
    expect(res.body).toHaveLength(2);
  });

  test('normaliza error al listar usuarios', async () => {
    userModel.getAllUsers.mockRejectedValue(new Error('db'));
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const res = createResponse();
    await getUsers(createRequest(), res);
    expect(res.statusCode).toBe(500);
    expect(res.body.code).toBe('INTERNAL_ERROR');
    spy.mockRestore();
  });

  test.each([undefined, '', '   '])('rechaza busqueda vacia %#', async (q) => {
    const res = createResponse();
    await searchUsersController(createRequest({ query: { q } }), res);
    expect(res.statusCode).toBe(400);
  });

  test('busca usuarios con texto normalizado', async () => {
    userModel.searchUsers.mockResolvedValue([normalUser]);
    const res = createResponse();
    await searchUsersController(createRequest({ query: { q: '  usuario  ' } }), res);
    expect(userModel.searchUsers).toHaveBeenCalledWith('usuario');
    expect(res.body).toEqual([normalUser]);
  });
});

describe('userController.getUserById', () => {
  test.each(['abc', '0', '-1', '1.5'])('rechaza ID invalido %s', async (id) => {
    const res = createResponse();
    await getUserById(createRequest({ params: { id } }), res);
    expect(res.statusCode).toBe(400);
  });

  test('devuelve 404 cuando el usuario no existe', async () => {
    userModel.findUserById.mockResolvedValue(undefined);
    const res = createResponse();
    await getUserById(createRequest({ params: { id: '2' } }), res);
    expect(res.statusCode).toBe(404);
  });

  test('devuelve usuario existente', async () => {
    userModel.findUserById.mockResolvedValue(normalUser);
    const res = createResponse();
    await getUserById(createRequest({ params: { id: '2' } }), res);
    expect(res.body).toEqual(normalUser);
  });
});

describe('userController.updateUserAdmin', () => {
  test('rechaza ID invalido', async () => {
    const res = createResponse();
    await updateUserAdmin(createRequest({ params: { id: 'x' }, body: validBody, user: admin }), res);
    expect(res.statusCode).toBe(400);
  });

  test('rechaza campos obligatorios incompletos', async () => {
    const res = createResponse();
    await updateUserAdmin(createRequest({ params: { id: '2' }, body: { nombres: 'QA' }, user: admin }), res);
    expect(res.statusCode).toBe(400);
  });

  test('rechaza rol invalido', async () => {
    const res = createResponse();
    await updateUserAdmin(createRequest({ params: { id: '2' }, body: { ...validBody, rol: 'superadmin' }, user: admin }), res);
    expect(res.statusCode).toBe(400);
  });

  test('devuelve 404 si usuario no existe', async () => {
    userModel.findUserById.mockResolvedValue(undefined);
    const res = createResponse();
    await updateUserAdmin(createRequest({ params: { id: '2' }, body: validBody, user: admin }), res);
    expect(res.statusCode).toBe(404);
  });

  test('rechaza email duplicado de otro usuario', async () => {
    userModel.findUserById.mockResolvedValue(normalUser);
    userModel.findUserByEmail.mockResolvedValue({ id: 3, email: normalUser.email });
    const res = createResponse();
    await updateUserAdmin(createRequest({ params: { id: '2' }, body: validBody, user: admin }), res);
    expect(res.statusCode).toBe(409);
    expect(res.body.code).toBe('DUPLICATE_RESOURCE');
  });

  test('impide que el administrador se quite su propio rol', async () => {
    userModel.findUserById.mockResolvedValue(admin);
    userModel.findUserByEmail.mockResolvedValue(admin);
    const res = createResponse();
    await updateUserAdmin(createRequest({
      params: { id: '1' },
      body: { ...validBody, email: admin.email, rol: 'usuario' },
      user: admin
    }), res);
    expect(res.statusCode).toBe(409);
    expect(res.body.code).toBe('ADMIN_CONFLICT');
  });

  test('impide degradar al ultimo administrador', async () => {
    userModel.findUserById.mockResolvedValue({ ...admin, id: 3 });
    userModel.findUserByEmail.mockResolvedValue(undefined);
    userModel.countAdmins.mockResolvedValue(1);
    const res = createResponse();
    await updateUserAdmin(createRequest({ params: { id: '3' }, body: { ...validBody, rol: 'usuario' }, user: admin }), res);
    expect(res.statusCode).toBe(409);
    expect(res.body.code).toBe('LAST_ADMIN_CONFLICT');
  });

  test('permite degradar un admin cuando existen otros administradores', async () => {
    const target = { ...admin, id: 3 };
    userModel.findUserById.mockResolvedValue(target);
    userModel.findUserByEmail.mockResolvedValue(undefined);
    userModel.countAdmins.mockResolvedValue(2);
    userModel.updateUserByAdmin.mockImplementation(async (id, data) => ({ id, ...data }));
    const res = createResponse();
    await updateUserAdmin(createRequest({ params: { id: '3' }, body: validBody, user: admin }), res);
    expect(res.statusCode).toBe(200);
    expect(userModel.updateUserByAdmin).toHaveBeenCalledWith(3, expect.objectContaining({
      nombres: 'Usuario',
      apellidos: 'QA',
      email: 'usuario.qa@peruapp.com',
      rol: 'usuario'
    }));
  });

  test('actualiza usuario normal sin contar administradores', async () => {
    userModel.findUserById.mockResolvedValue(normalUser);
    userModel.findUserByEmail.mockResolvedValue(normalUser);
    userModel.updateUserByAdmin.mockImplementation(async (id, data) => ({ id, ...data }));
    const res = createResponse();
    await updateUserAdmin(createRequest({ params: { id: '2' }, body: validBody, user: admin }), res);
    expect(res.statusCode).toBe(200);
    expect(userModel.countAdmins).not.toHaveBeenCalled();
  });
});

describe('userController.deleteUserAdmin', () => {
  test('rechaza ID invalido', async () => {
    const res = createResponse();
    await deleteUserAdmin(createRequest({ params: { id: 'x' }, user: admin }), res);
    expect(res.statusCode).toBe(400);
  });

  test('impide autoeliminacion del administrador', async () => {
    const res = createResponse();
    await deleteUserAdmin(createRequest({ params: { id: '1' }, user: admin }), res);
    expect(res.statusCode).toBe(409);
    expect(res.body.code).toBe('ADMIN_CONFLICT');
  });

  test('devuelve 404 si usuario no existe', async () => {
    userModel.findUserById.mockResolvedValue(undefined);
    const res = createResponse();
    await deleteUserAdmin(createRequest({ params: { id: '2' }, user: admin }), res);
    expect(res.statusCode).toBe(404);
  });

  test('impide eliminar al ultimo administrador', async () => {
    userModel.findUserById.mockResolvedValue({ ...admin, id: 3 });
    userModel.countAdmins.mockResolvedValue(1);
    const res = createResponse();
    await deleteUserAdmin(createRequest({ params: { id: '3' }, user: admin }), res);
    expect(res.statusCode).toBe(409);
    expect(res.body.code).toBe('LAST_ADMIN_CONFLICT');
  });

  test('elimina un usuario normal', async () => {
    userModel.findUserById.mockResolvedValue(normalUser);
    userModel.deleteUser.mockResolvedValue(normalUser);
    const res = createResponse();
    await deleteUserAdmin(createRequest({ params: { id: '2' }, user: admin }), res);
    expect(res.statusCode).toBe(200);
    expect(res.body.user).toEqual(normalUser);
  });

  test('elimina un administrador cuando queda otro', async () => {
    const otherAdmin = { ...admin, id: 3 };
    userModel.findUserById.mockResolvedValue(otherAdmin);
    userModel.countAdmins.mockResolvedValue(2);
    userModel.deleteUser.mockResolvedValue(otherAdmin);
    const res = createResponse();
    await deleteUserAdmin(createRequest({ params: { id: '3' }, user: admin }), res);
    expect(res.statusCode).toBe(200);
  });

  test('normaliza error inesperado al eliminar', async () => {
    userModel.findUserById.mockRejectedValue(new Error('db'));
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const res = createResponse();
    await deleteUserAdmin(createRequest({ params: { id: '2' }, user: admin }), res);
    expect(res.statusCode).toBe(500);
    spy.mockRestore();
  });
});
