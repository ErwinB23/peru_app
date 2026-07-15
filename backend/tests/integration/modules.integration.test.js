import { beforeAll, describe, expect, jest, test } from '@jest/globals';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import request from 'supertest';

const passwordHash = await bcrypt.hash('ClaveSegura123', 4);
const users = [
  { id: 1, nombres: 'Admin', apellidos: 'QA', fecha_nacimiento: '1990-01-01', email: 'admin.modules@test.local', password: passwordHash, rol: 'admin' },
  { id: 2, nombres: 'Usuario', apellidos: 'QA', fecha_nacimiento: '2000-01-01', email: 'user.modules@test.local', password: passwordHash, rol: 'usuario' }
];

const stores = {
  provincias: [{ id: 1, nombre: 'Huamanga', departamento_id: 1 }],
  distritos: [{ id: 1, nombre: 'Ayacucho', provincia_id: 1 }],
  ciudades: [{ id: 1, nombre: 'Ayacucho', distrito_id: 1 }],
  lugaresDepartamento: [], comidasDepartamento: [],
  lugaresProvincia: [], comidasProvincia: [],
  lugaresDistrito: [], comidasDistrito: [],
  lugaresCiudad: [], comidasCiudad: []
};

const createCrudModel = ({ store, listName, createName, updateName, deleteName, getName = 'getLugarById' }) => ({
  [listName]: jest.fn(async () => store),
  [getName]: jest.fn(async (id) => store.find((item) => item.id === Number(id))),
  [createName]: jest.fn(async (data) => {
    const created = { id: store.length + 10, ...data };
    store.push(created);
    return created;
  }),
  [updateName]: jest.fn(async (id, data) => ({ id: Number(id), ...data })),
  [deleteName]: jest.fn(async (id) => {
    const index = store.findIndex((item) => item.id === Number(id));
    return index >= 0 ? store.splice(index, 1)[0] : undefined;
  })
});

const provinciaModel = {
  getAllProvincias: jest.fn(async () => stores.provincias),
  getProvinciasByDepartamento: jest.fn(async () => stores.provincias),
  getProvinciaById: jest.fn(async (id) => stores.provincias.find((item) => item.id === Number(id))),
  createProvincia: jest.fn(async (data) => { const created = { id: stores.provincias.length + 10, ...data }; stores.provincias.push(created); return created; }),
  updateProvincia: jest.fn(), deleteProvincia: jest.fn()
};
const distritoModel = {
  getAllDistritos: jest.fn(async () => ({ data: stores.distritos, total: stores.distritos.length })),
  getDistritosByProvincia: jest.fn(async () => ({ data: stores.distritos, total: stores.distritos.length })),
  getDistritoById: jest.fn(async (id) => stores.distritos.find((item) => item.id === Number(id))),
  createDistrito: jest.fn(async (data) => { const created = { id: stores.distritos.length + 10, ...data }; stores.distritos.push(created); return created; }),
  updateDistrito: jest.fn(), deleteDistrito: jest.fn()
};
const ciudadModel = {
  getAllCiudades: jest.fn(async () => ({ data: stores.ciudades, total: stores.ciudades.length })),
  getCiudadesByDepartamento: jest.fn(async () => ({ data: stores.ciudades, total: stores.ciudades.length })),
  getCiudadesByProvincia: jest.fn(async () => ({ data: stores.ciudades, total: stores.ciudades.length })),
  getCiudadesByDistrito: jest.fn(async () => ({ data: stores.ciudades, total: stores.ciudades.length })),
  getCiudadById: jest.fn(async (id) => stores.ciudades.find((item) => item.id === Number(id))),
  createCiudad: jest.fn(async (data) => { const created = { id: stores.ciudades.length + 10, ...data }; stores.ciudades.push(created); return created; }),
  updateCiudad: jest.fn(), deleteCiudad: jest.fn()
};

jest.unstable_mockModule('../../src/models/userModel.js', () => ({
  findUserByEmail: jest.fn(async (email) => users.find((user) => user.email === email)),
  createUser: jest.fn(),
  findUserById: jest.fn(async (id) => {
    const user = users.find((item) => item.id === Number(id));
    if (!user) return undefined;
    const { password, ...safe } = user;
    return safe;
  }),
  findUserByIdWithPassword: jest.fn(async (id) => users.find((user) => user.id === Number(id))),
  updateUser: jest.fn(), updatePassword: jest.fn(),
  getAllUsers: jest.fn(async () => users.map(({ password, ...user }) => user)),
  searchUsers: jest.fn(async () => users), updateUserByAdmin: jest.fn(), deleteUser: jest.fn(), countAdmins: jest.fn(async () => 1)
}));

jest.unstable_mockModule('../../src/models/departamentoModel.js', () => ({
  getAllDepartamentos: jest.fn(async () => [{ id: 1, nombre: 'Ayacucho' }]),
  getDepartamentoById: jest.fn(async (id) => Number(id) === 1 ? { id: 1, nombre: 'Ayacucho' } : undefined),
  createDepartamento: jest.fn(), updateDepartamento: jest.fn(), deleteDepartamento: jest.fn()
}));
jest.unstable_mockModule('../../src/models/provinciaModel.js', () => provinciaModel);
jest.unstable_mockModule('../../src/models/distritoModel.js', () => distritoModel);
jest.unstable_mockModule('../../src/models/ciudadModel.js', () => ciudadModel);

jest.unstable_mockModule('../../src/models/lugarTuristicoModel.js', () => createCrudModel({
  store: stores.lugaresDepartamento, listName: 'getLugaresByDepartamentoId', createName: 'createLugarTuristico', updateName: 'updateLugarTuristico', deleteName: 'deleteLugarTuristico'
}));
jest.unstable_mockModule('../../src/models/comidaTipicaModel.js', () => createCrudModel({
  store: stores.comidasDepartamento, listName: 'getComidasByDepartamentoId', getName: 'getComidaById', createName: 'createComidaTipica', updateName: 'updateComidaTipica', deleteName: 'deleteComidaTipica'
}));
jest.unstable_mockModule('../../src/models/lugarTuristicoProvinciaModel.js', () => createCrudModel({
  store: stores.lugaresProvincia, listName: 'getLugaresByProvinciaId', createName: 'createLugar', updateName: 'updateLugar', deleteName: 'deleteLugar'
}));
jest.unstable_mockModule('../../src/models/comidaTipicaProvinciaModel.js', () => createCrudModel({
  store: stores.comidasProvincia, listName: 'getComidasByProvinciaId', getName: 'getComidaById', createName: 'createComida', updateName: 'updateComida', deleteName: 'deleteComida'
}));
jest.unstable_mockModule('../../src/models/lugarTuristicoDistritoModel.js', () => createCrudModel({
  store: stores.lugaresDistrito, listName: 'getLugaresByDistritoId', createName: 'createLugar', updateName: 'updateLugar', deleteName: 'deleteLugar'
}));
jest.unstable_mockModule('../../src/models/comidaTipicaDistritoModel.js', () => createCrudModel({
  store: stores.comidasDistrito, listName: 'getComidasByDistritoId', getName: 'getComidaById', createName: 'createComida', updateName: 'updateComida', deleteName: 'deleteComida'
}));
jest.unstable_mockModule('../../src/models/lugarTuristicoCiudadModel.js', () => createCrudModel({
  store: stores.lugaresCiudad, listName: 'getLugaresByCiudadId', createName: 'createLugar', updateName: 'updateLugar', deleteName: 'deleteLugar'
}));
jest.unstable_mockModule('../../src/models/comidaTipicaCiudadModel.js', () => createCrudModel({
  store: stores.comidasCiudad, listName: 'getComidasByCiudadId', getName: 'getComidaById', createName: 'createComida', updateName: 'updateComida', deleteName: 'deleteComida'
}));

jest.unstable_mockModule('../../src/middlewares/dataIntegrityMiddleware.js', () => ({
  ensureRelationExists: () => async (req, res, next) => next(),
  ensureResourceExists: () => async (req, res, next) => next(),
  ensureUniqueName: () => async (req, res, next) => next()
}));

let app;
let adminToken;
let userToken;

beforeAll(async () => {
  ({ default: app } = await import('../../src/app.js'));
  adminToken = jwt.sign({ id: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });
  userToken = jwt.sign({ id: 2 }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

const auth = (token) => ({ Authorization: `Bearer ${token}` });

describe('Integracion de modulos territoriales', () => {
  test('provincias exige autenticacion', async () => {
    expect((await request(app).get('/api/provincias')).status).toBe(401);
  });

  test('usuario autenticado lista provincias, distritos y ciudades', async () => {
    expect((await request(app).get('/api/provincias').set(auth(userToken))).status).toBe(200);
    expect((await request(app).get('/api/distritos').set(auth(userToken))).status).toBe(200);
    expect((await request(app).get('/api/ciudades').set(auth(userToken))).status).toBe(200);
  });

  test('usuario normal no puede crear provincia', async () => {
    const response = await request(app).post('/api/provincias').set(auth(userToken)).send({
      nombre: 'Provincia Usuario', capital: 'Capital', departamento_id: 1, area_km2: 10, poblacion_aprox: 100
    });
    expect(response.status).toBe(403);
  });

  test('administrador crea provincia valida', async () => {
    const response = await request(app).post('/api/provincias').set(auth(adminToken)).send({
      nombre: 'Provincia Integracion', capital: 'Capital QA', departamento_id: 1, area_km2: 10.5, poblacion_aprox: 1000
    });
    expect(response.status).toBe(201);
    expect(response.body.provincia.nombre).toBe('Provincia Integracion');
  });

  test('provincia invalida devuelve 400 con detalles', async () => {
    const response = await request(app).post('/api/provincias').set(auth(adminToken)).send({ nombre: '', area_km2: -1 });
    expect(response.status).toBe(400);
    expect(response.body.code).toBe('VALIDATION_ERROR');
  });

  test('administrador crea distrito valido', async () => {
    const response = await request(app).post('/api/distritos').set(auth(adminToken)).send({
      nombre: 'Distrito Integracion', provincia_id: 1, area_km2: 20, poblacion_aprox: 500, tipo_zona: 'Mixto', nivel_desarrollo: 'Medio'
    });
    expect(response.status).toBe(201);
  });

  test('administrador crea ciudad valida', async () => {
    const response = await request(app).post('/api/ciudades').set(auth(adminToken)).send({
      nombre: 'Ciudad Integracion', distrito_id: 1, tipo_ciudad: 'Turistica', poblacion: 2000, latitud: -13.1, longitud: -74.2
    });
    expect(response.status).toBe(201);
  });

  test('usuario normal no puede crear ciudad', async () => {
    const response = await request(app).post('/api/ciudades').set(auth(userToken)).send({
      nombre: 'Ciudad Usuario', distrito_id: 1, poblacion: 10
    });
    expect(response.status).toBe(403);
  });
});

describe('Integracion de usuarios y contenido', () => {
  test('solo administrador lista usuarios', async () => {
    expect((await request(app).get('/api/users').set(auth(userToken))).status).toBe(403);
    const adminResponse = await request(app).get('/api/users').set(auth(adminToken));
    expect(adminResponse.status).toBe(200);
    expect(adminResponse.body).toHaveLength(2);
  });

  test('administrador crea lugar turistico departamental', async () => {
    const response = await request(app).post('/api/lugares-turisticos').set(auth(adminToken)).send({
      departamento_id: 1, nombre: 'Lugar Integracion', descripcion: 'Descripcion suficiente para la prueba'
    });
    expect(response.status).toBe(201);
  });

  test('usuario consulta lugares departamentales', async () => {
    const response = await request(app).get('/api/lugares-turisticos/departamento/1').set(auth(userToken));
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.any(Array));
  });

  test('administrador crea comida de provincia', async () => {
    const response = await request(app).post('/api/comidas-tipicas-provincias').set(auth(adminToken)).send({
      provincia_id: 1, nombre: 'Comida Provincia QA', descripcion: 'Descripcion suficiente para la prueba'
    });
    expect(response.status).toBe(201);
  });

  test('administrador crea lugar de distrito', async () => {
    const response = await request(app).post('/api/lugares-turisticos-distritos').set(auth(adminToken)).send({
      distrito_id: 1, nombre: 'Lugar Distrito QA', descripcion: 'Descripcion suficiente para la prueba'
    });
    expect(response.status).toBe(201);
  });

  test('administrador crea comida de ciudad', async () => {
    const response = await request(app).post('/api/comidas-tipicas-ciudades').set(auth(adminToken)).send({
      ciudad_id: 1, nombre: 'Comida Ciudad QA', descripcion: 'Descripcion suficiente para la prueba'
    });
    expect(response.status).toBe(201);
  });

  test('contenido incompleto devuelve 400', async () => {
    const response = await request(app).post('/api/lugares-turisticos-ciudades').set(auth(adminToken)).send({ ciudad_id: 1, nombre: 'X' });
    expect(response.status).toBe(400);
    expect(response.body.code).toBe('VALIDATION_ERROR');
  });

  test('usuario normal no puede crear contenido', async () => {
    const response = await request(app).post('/api/comidas-tipicas').set(auth(userToken)).send({
      departamento_id: 1, nombre: 'Comida Usuario', descripcion: 'Descripcion suficiente'
    });
    expect(response.status).toBe(403);
  });
});
