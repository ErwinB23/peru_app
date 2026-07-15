import { beforeAll, describe, expect, jest, test } from '@jest/globals';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import request from 'supertest';

const passwordHash = await bcrypt.hash('ClaveSegura123', 4);

const users = [
  {
    id: 1,
    nombres: 'Admin',
    apellidos: 'QA',
    email: 'admin.qa@peruapp.test',
    password: passwordHash,
    rol: 'admin'
  },
  {
    id: 2,
    nombres: 'Usuario',
    apellidos: 'QA',
    email: 'usuario.qa@peruapp.test',
    password: passwordHash,
    rol: 'usuario'
  }
];

const createdDepartments = [];

jest.unstable_mockModule('../../src/models/userModel.js', () => ({
  findUserByEmail: jest.fn(async (email) => users.find((user) => user.email === email)),
  createUser: jest.fn(),
  findUserById: jest.fn(async (id) => {
    const user = users.find((item) => item.id === Number(id));
    if (!user) return undefined;
    const { password, ...safeUser } = user;
    return safeUser;
  }),
  findUserByIdWithPassword: jest.fn(async (id) => users.find((user) => user.id === Number(id))),
  updateUser: jest.fn(),
  updatePassword: jest.fn(),
  getAllUsers: jest.fn(async () => users),
  searchUsers: jest.fn(async () => users),
  updateUserByAdmin: jest.fn(),
  deleteUser: jest.fn(),
  countAdmins: jest.fn(async () => 1)
}));

jest.unstable_mockModule('../../src/models/departamentoModel.js', () => ({
  getAllDepartamentos: jest.fn(async () => createdDepartments),
  getDepartamentoById: jest.fn(async (id) => createdDepartments.find((item) => item.id === Number(id))),
  createDepartamento: jest.fn(async (data) => {
    const created = { id: createdDepartments.length + 10, ...data };
    createdDepartments.push(created);
    return created;
  }),
  updateDepartamento: jest.fn(async (id, data) => ({ id: Number(id), ...data })),
  deleteDepartamento: jest.fn(async (id) => {
    const index = createdDepartments.findIndex((item) => item.id === Number(id));
    return index >= 0 ? createdDepartments.splice(index, 1)[0] : undefined;
  })
}));

jest.unstable_mockModule('../../src/middlewares/dataIntegrityMiddleware.js', () => ({
  ensureRelationExists: () => async (req, res, next) => next(),
  ensureResourceExists: () => async (req, res, next) => {
    if (Number(req.params.id) === 999999) {
      return res.status(404).json({
        error: 'Recurso no encontrado',
        code: 'RESOURCE_NOT_FOUND'
      });
    }
    return next();
  },
  ensureUniqueName: () => async (req, res, next) => {
    if (String(req.body?.nombre || '').toLowerCase() === 'ayacucho') {
      return res.status(409).json({
        error: 'Ya existe un departamento con ese nombre',
        code: 'DUPLICATE_RESOURCE'
      });
    }
    return next();
  }
}));

let app;
let adminToken;
let userToken;

beforeAll(async () => {
  ({ default: app } = await import('../../src/app.js'));
  const secret = process.env.JWT_SECRET;
  adminToken = jwt.sign({ id: 1 }, secret, { expiresIn: '1h' });
  userToken = jwt.sign({ id: 2 }, secret, { expiresIn: '1h' });
});

describe('API de autenticacion y autorizacion', () => {
  test('login correcto devuelve token y usuario', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin.qa@peruapp.test', password: 'ClaveSegura123' });

    expect(response.status).toBe(200);
    expect(response.body.token).toEqual(expect.any(String));
    expect(response.body.user.rol).toBe('admin');
  });

  test('login incorrecto devuelve 401', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin.qa@peruapp.test', password: 'incorrecta' });

    expect(response.status).toBe(401);
    expect(response.body.error).toMatch(/credenciales/i);
  });

  test('consulta protegida sin token devuelve 401', async () => {
    const response = await request(app).get('/api/departamentos');
    expect(response.status).toBe(401);
  });

  test('usuario normal no puede crear departamentos', async () => {
    const response = await request(app)
      .post('/api/departamentos')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        nombre: 'QA Normal',
        capital: 'QA Capital',
        region_natural: 'Sierra',
        area_km2: 100,
        poblacion_aprox: 1000
      });

    expect(response.status).toBe(403);
  });

  test('administrador crea un departamento valido', async () => {
    const response = await request(app)
      .post('/api/departamentos')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nombre: 'QA Automatizado',
        capital: 'QA Capital',
        region_natural: 'Sierra',
        area_km2: 120.5,
        poblacion_aprox: 5000,
        descripcion: 'Registro creado solamente dentro de un mock de integracion.'
      });

    expect(response.status).toBe(201);
    expect(response.body.departamento.nombre).toBe('QA Automatizado');
  });

  test('datos invalidos devuelven 400 con detalles', async () => {
    const response = await request(app)
      .post('/api/departamentos')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ nombre: '', area_km2: -1, poblacion_aprox: -5 });

    expect(response.status).toBe(400);
    expect(response.body.code).toBe('VALIDATION_ERROR');
    expect(response.body.details).toEqual(expect.any(Array));
  });

  test('recurso inexistente devuelve 404', async () => {
    const response = await request(app)
      .get('/api/departamentos/999999')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body.code).toBe('RESOURCE_NOT_FOUND');
  });

  test('registro duplicado devuelve 409', async () => {
    const response = await request(app)
      .post('/api/departamentos')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nombre: 'Ayacucho',
        capital: 'Huamanga',
        region_natural: 'Sierra',
        area_km2: 43814.8,
        poblacion_aprox: 700000
      });

    expect(response.status).toBe(409);
    expect(response.body.code).toBe('DUPLICATE_RESOURCE');
  });

  test('token expirado devuelve 401', async () => {
    const expiredToken = jwt.sign(
      { id: 1 },
      process.env.JWT_SECRET,
      { expiresIn: -1 }
    );

    const response = await request(app)
      .get('/api/departamentos')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(response.status).toBe(401);
    expect(response.body.error).toMatch(/expirado/i);
  });
});
