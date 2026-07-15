import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { createRequest, createResponse } from '../helpers/httpMocks.js';

const departamentoModel = { getDepartamentoById: jest.fn() };
const provinciaModel = {
  getAllProvincias: jest.fn(),
  getProvinciasByDepartamento: jest.fn(),
  getProvinciaById: jest.fn(),
  createProvincia: jest.fn(),
  updateProvincia: jest.fn(),
  deleteProvincia: jest.fn()
};
const distritoModel = {
  getAllDistritos: jest.fn(),
  getDistritosByProvincia: jest.fn(),
  getDistritoById: jest.fn(),
  createDistrito: jest.fn(),
  updateDistrito: jest.fn(),
  deleteDistrito: jest.fn()
};
const ciudadModel = {
  getAllCiudades: jest.fn(),
  getCiudadesByDepartamento: jest.fn(),
  getCiudadesByProvincia: jest.fn(),
  getCiudadesByDistrito: jest.fn(),
  getCiudadById: jest.fn(),
  createCiudad: jest.fn(),
  updateCiudad: jest.fn(),
  deleteCiudad: jest.fn()
};
const imageLifecycle = {
  cleanupReplacedImages: jest.fn(),
  cleanupResourceImages: jest.fn()
};

jest.unstable_mockModule('../../src/models/departamentoModel.js', () => departamentoModel);
jest.unstable_mockModule('../../src/models/provinciaModel.js', () => provinciaModel);
jest.unstable_mockModule('../../src/models/distritoModel.js', () => distritoModel);
jest.unstable_mockModule('../../src/models/ciudadModel.js', () => ciudadModel);
jest.unstable_mockModule('../../src/utils/imageLifecycle.js', () => imageLifecycle);

const provinciaController = await import('../../src/controllers/provinciaController.js');
const distritoController = await import('../../src/controllers/distritoController.js');
const ciudadController = await import('../../src/controllers/ciudadController.js');

const provinciaBase = {
  id: 20,
  nombre: 'Huamanga',
  capital: 'Ayacucho',
  departamento_id: 1,
  area_km2: 2981.37,
  poblacion_aprox: 300000,
  imagen_fondo: '/uploads/provincias/anterior.jpg'
};

const distritoBase = {
  id: 30,
  nombre: 'Ayacucho',
  provincia_id: 20,
  area_km2: 85.29,
  poblacion_aprox: 120000,
  tipo_zona: 'Urbano',
  nivel_desarrollo: 'Alto',
  imagen_fondo: '/uploads/distritos/anterior.jpg'
};

const ciudadBase = {
  id: 40,
  nombre: 'Ayacucho',
  distrito_id: 30,
  tipo_ciudad: 'Capital',
  poblacion: 120000,
  imagen_fondo: '/uploads/ciudades/anterior.jpg'
};

const validProvinciaBody = {
  nombre: ' Huamanga ',
  capital: ' Ayacucho ',
  departamento_id: 1,
  area_km2: 2981.37,
  poblacion_aprox: 300000,
  actividad_economica_principal: 'Comercio',
  festividad_representativa: 'Semana Santa',
  descripcion_general: 'Provincia QA'
};

const validDistritoBody = {
  nombre: ' Ayacucho ',
  provincia_id: 20,
  area_km2: 85.29,
  poblacion_aprox: 120000,
  altitud_msnm: 2761,
  tipo_zona: 'Urbano',
  servicios_basicos: 'Completos',
  nivel_desarrollo: 'Alto',
  descripcion: 'Distrito QA'
};

const validCiudadBody = {
  nombre: ' Ayacucho ',
  distrito_id: 30,
  tipo_ciudad: 'Capital',
  poblacion: 120000,
  latitud: -13.1631,
  longitud: -74.2236,
  clima: 'Templado',
  principal_actividad: 'Servicios',
  atractivo_turistico: 'Centro historico',
  descripcion_cultural: 'Ciudad QA'
};

beforeEach(() => {
  jest.clearAllMocks();
  for (const group of [departamentoModel, provinciaModel, distritoModel, ciudadModel, imageLifecycle]) {
    for (const fn of Object.values(group)) {
      fn.mockReset();
    }
  }
  imageLifecycle.cleanupReplacedImages.mockResolvedValue(undefined);
  imageLifecycle.cleanupResourceImages.mockResolvedValue(undefined);
});

describe('provinciaController', () => {
  test('lista todas las provincias', async () => {
    provinciaModel.getAllProvincias.mockResolvedValue([provinciaBase]);
    const res = createResponse();
    await provinciaController.getProvincias(createRequest(), res);
    expect(res.body).toEqual([provinciaBase]);
    expect(provinciaModel.getAllProvincias).toHaveBeenCalled();
  });

  test('rechaza filtro con departamento invalido', async () => {
    const res = createResponse();
    await provinciaController.getProvincias(createRequest({ query: { departamento_id: 'abc' } }), res);
    expect(res.statusCode).toBe(400);
  });

  test('devuelve 404 cuando el departamento del filtro no existe', async () => {
    departamentoModel.getDepartamentoById.mockResolvedValue(undefined);
    const res = createResponse();
    await provinciaController.getProvincias(createRequest({ query: { departamento_id: '1' } }), res);
    expect(res.statusCode).toBe(404);
  });

  test('lista provincias filtradas por departamento', async () => {
    departamentoModel.getDepartamentoById.mockResolvedValue({ id: 1 });
    provinciaModel.getProvinciasByDepartamento.mockResolvedValue([provinciaBase]);
    const res = createResponse();
    await provinciaController.getProvincias(createRequest({ query: { departamento_id: '1' } }), res);
    expect(provinciaModel.getProvinciasByDepartamento).toHaveBeenCalledWith(1);
    expect(res.body).toEqual([provinciaBase]);
  });

  test('normaliza error al listar provincias', async () => {
    provinciaModel.getAllProvincias.mockRejectedValue(new Error('db'));
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const res = createResponse();
    await provinciaController.getProvincias(createRequest(), res);
    expect(res.statusCode).toBe(500);
    expect(res.body.code).toBe('INTERNAL_ERROR');
    spy.mockRestore();
  });

  test.each(['abc', '0', '-1'])('rechaza ID de provincia invalido %s', async (id) => {
    const res = createResponse();
    await provinciaController.getProvinciaById(createRequest({ params: { id } }), res);
    expect(res.statusCode).toBe(400);
  });

  test('devuelve 404 al consultar provincia inexistente', async () => {
    provinciaModel.getProvinciaById.mockResolvedValue(undefined);
    const res = createResponse();
    await provinciaController.getProvinciaById(createRequest({ params: { id: '20' } }), res);
    expect(res.statusCode).toBe(404);
  });

  test('devuelve provincia por ID', async () => {
    provinciaModel.getProvinciaById.mockResolvedValue(provinciaBase);
    const res = createResponse();
    await provinciaController.getProvinciaById(createRequest({ params: { id: '20' } }), res);
    expect(res.body).toEqual(provinciaBase);
  });

  test('rechaza creacion con campos incompletos', async () => {
    const res = createResponse();
    await provinciaController.createProvincia(createRequest({ body: { nombre: 'QA' } }), res);
    expect(res.statusCode).toBe(400);
  });

  test('rechaza creacion con departamento invalido', async () => {
    const res = createResponse();
    await provinciaController.createProvincia(createRequest({ body: { ...validProvinciaBody, departamento_id: 'x' } }), res);
    expect(res.statusCode).toBe(400);
  });

  test('rechaza creacion si el departamento no existe', async () => {
    departamentoModel.getDepartamentoById.mockResolvedValue(undefined);
    const res = createResponse();
    await provinciaController.createProvincia(createRequest({ body: validProvinciaBody }), res);
    expect(res.statusCode).toBe(404);
  });

  test('crea provincia con imagen cargada y datos normalizados', async () => {
    departamentoModel.getDepartamentoById.mockResolvedValue({ id: 1 });
    provinciaModel.createProvincia.mockImplementation(async (data) => ({ id: 21, ...data }));
    const req = createRequest({ body: validProvinciaBody, file: { filename: 'huamanga.webp' } });
    const res = createResponse();
    await provinciaController.createProvincia(req, res);
    expect(res.statusCode).toBe(201);
    expect(provinciaModel.createProvincia).toHaveBeenCalledWith(expect.objectContaining({
      nombre: 'Huamanga',
      capital: 'Ayacucho',
      imagen_fondo: '/uploads/provincias/huamanga.webp'
    }));
  });

  test('crea provincia conservando URL de imagen enviada', async () => {
    departamentoModel.getDepartamentoById.mockResolvedValue({ id: 1 });
    provinciaModel.createProvincia.mockImplementation(async (data) => ({ id: 21, ...data }));
    const res = createResponse();
    await provinciaController.createProvincia(createRequest({ body: { ...validProvinciaBody, imagen_fondo: 'https://cdn.test/prov.jpg' } }), res);
    expect(provinciaModel.createProvincia).toHaveBeenCalledWith(expect.objectContaining({ imagen_fondo: 'https://cdn.test/prov.jpg' }));
  });

  test('actualiza provincia y elimina imagen reemplazada', async () => {
    provinciaModel.getProvinciaById.mockResolvedValue(provinciaBase);
    departamentoModel.getDepartamentoById.mockResolvedValue({ id: 1 });
    provinciaModel.updateProvincia.mockImplementation(async (id, data) => ({ id, ...data }));
    const req = createRequest({ params: { id: '20' }, body: validProvinciaBody, file: { filename: 'nueva.jpg' } });
    const res = createResponse();
    await provinciaController.updateProvincia(req, res);
    expect(res.statusCode).toBe(200);
    expect(imageLifecycle.cleanupReplacedImages).toHaveBeenCalledWith(provinciaBase, expect.any(Object), ['imagen_fondo']);
  });

  test('actualizacion conserva imagen anterior', async () => {
    provinciaModel.getProvinciaById.mockResolvedValue(provinciaBase);
    departamentoModel.getDepartamentoById.mockResolvedValue({ id: 1 });
    provinciaModel.updateProvincia.mockImplementation(async (id, data) => ({ id, ...data }));
    const res = createResponse();
    await provinciaController.updateProvincia(createRequest({ params: { id: '20' }, body: validProvinciaBody }), res);
    expect(provinciaModel.updateProvincia).toHaveBeenCalledWith(20, expect.objectContaining({ imagen_fondo: provinciaBase.imagen_fondo }));
  });

  test('actualizacion devuelve 404 si provincia no existe', async () => {
    provinciaModel.getProvinciaById.mockResolvedValue(undefined);
    const res = createResponse();
    await provinciaController.updateProvincia(createRequest({ params: { id: '20' }, body: validProvinciaBody }), res);
    expect(res.statusCode).toBe(404);
  });

  test('elimina provincia y su imagen', async () => {
    provinciaModel.deleteProvincia.mockResolvedValue(provinciaBase);
    const res = createResponse();
    await provinciaController.deleteProvincia(createRequest({ params: { id: '20' } }), res);
    expect(res.statusCode).toBe(200);
    expect(imageLifecycle.cleanupResourceImages).toHaveBeenCalledWith(provinciaBase, ['imagen_fondo']);
  });

  test('eliminacion devuelve 404 si no existe', async () => {
    provinciaModel.deleteProvincia.mockResolvedValue(undefined);
    const res = createResponse();
    await provinciaController.deleteProvincia(createRequest({ params: { id: '20' } }), res);
    expect(res.statusCode).toBe(404);
  });
});

describe('distritoController', () => {
  test('lista distritos paginados', async () => {
    distritoModel.getAllDistritos.mockResolvedValue({ data: [distritoBase], total: 1 });
    const res = createResponse();
    await distritoController.getDistritos(createRequest({ query: { page: '2', limit: '10' } }), res);
    expect(distritoModel.getAllDistritos).toHaveBeenCalledWith(2, 10);
    expect(res.statusCode).toBe(200);
  });

  test.each([
    { page: '0', limit: '20' },
    { page: '1', limit: '0' },
    { page: '1', limit: '101' },
    { page: 'x', limit: '20' }
  ])('rechaza paginacion invalida %#', async (query) => {
    const res = createResponse();
    await distritoController.getDistritos(createRequest({ query }), res);
    expect(res.statusCode).toBe(400);
  });

  test('rechaza filtro de provincia invalido', async () => {
    const res = createResponse();
    await distritoController.getDistritos(createRequest({ query: { provincia_id: 'x' } }), res);
    expect(res.statusCode).toBe(400);
  });

  test('devuelve 404 si la provincia filtrada no existe', async () => {
    provinciaModel.getProvinciaById.mockResolvedValue(undefined);
    const res = createResponse();
    await distritoController.getDistritos(createRequest({ query: { provincia_id: '20' } }), res);
    expect(res.statusCode).toBe(404);
  });

  test('lista distritos por provincia', async () => {
    provinciaModel.getProvinciaById.mockResolvedValue(provinciaBase);
    distritoModel.getDistritosByProvincia.mockResolvedValue({ data: [distritoBase], total: 1 });
    const res = createResponse();
    await distritoController.getDistritos(createRequest({ query: { provincia_id: '20', page: '1', limit: '5' } }), res);
    expect(distritoModel.getDistritosByProvincia).toHaveBeenCalledWith(20, 1, 5);
  });

  test('consulta distrito por ID y devuelve 404 cuando falta', async () => {
    distritoModel.getDistritoById.mockResolvedValue(undefined);
    const missing = createResponse();
    await distritoController.getDistritoById(createRequest({ params: { id: '30' } }), missing);
    expect(missing.statusCode).toBe(404);

    distritoModel.getDistritoById.mockResolvedValue(distritoBase);
    const found = createResponse();
    await distritoController.getDistritoById(createRequest({ params: { id: '30' } }), found);
    expect(found.body).toEqual(distritoBase);
  });

  test('rechaza campos incompletos al crear distrito', async () => {
    const res = createResponse();
    await distritoController.createDistrito(createRequest({ body: { nombre: 'QA' } }), res);
    expect(res.statusCode).toBe(400);
  });

  test('rechaza provincia asociada inexistente', async () => {
    provinciaModel.getProvinciaById.mockResolvedValue(undefined);
    const res = createResponse();
    await distritoController.createDistrito(createRequest({ body: validDistritoBody }), res);
    expect(res.statusCode).toBe(404);
  });

  test.each([
    ['tipo_zona', 'Industrial'],
    ['nivel_desarrollo', 'Muy alto']
  ])('rechaza %s invalido', async (field, value) => {
    provinciaModel.getProvinciaById.mockResolvedValue(provinciaBase);
    const res = createResponse();
    await distritoController.createDistrito(createRequest({ body: { ...validDistritoBody, [field]: value } }), res);
    expect(res.statusCode).toBe(400);
  });

  test('crea distrito con imagen y campos opcionales', async () => {
    provinciaModel.getProvinciaById.mockResolvedValue(provinciaBase);
    distritoModel.createDistrito.mockImplementation(async (data) => ({ id: 31, ...data }));
    const res = createResponse();
    await distritoController.createDistrito(createRequest({ body: validDistritoBody, file: { filename: 'distrito.webp' } }), res);
    expect(res.statusCode).toBe(201);
    expect(distritoModel.createDistrito).toHaveBeenCalledWith(expect.objectContaining({
      nombre: 'Ayacucho',
      imagen_fondo: '/uploads/distritos/distrito.webp'
    }));
  });

  test('actualiza distrito y limpia imagen anterior', async () => {
    distritoModel.getDistritoById.mockResolvedValue(distritoBase);
    provinciaModel.getProvinciaById.mockResolvedValue(provinciaBase);
    distritoModel.updateDistrito.mockImplementation(async (id, data) => ({ id, ...data }));
    const res = createResponse();
    await distritoController.updateDistrito(createRequest({ params: { id: '30' }, body: validDistritoBody, file: { filename: 'nueva.jpg' } }), res);
    expect(res.statusCode).toBe(200);
    expect(imageLifecycle.cleanupReplacedImages).toHaveBeenCalled();
  });

  test('actualizacion devuelve 404 si distrito no existe', async () => {
    distritoModel.getDistritoById.mockResolvedValue(undefined);
    const res = createResponse();
    await distritoController.updateDistrito(createRequest({ params: { id: '30' }, body: validDistritoBody }), res);
    expect(res.statusCode).toBe(404);
  });

  test('elimina distrito y limpia imagen', async () => {
    distritoModel.deleteDistrito.mockResolvedValue(distritoBase);
    const res = createResponse();
    await distritoController.deleteDistrito(createRequest({ params: { id: '30' } }), res);
    expect(res.statusCode).toBe(200);
    expect(imageLifecycle.cleanupResourceImages).toHaveBeenCalledWith(distritoBase, ['imagen_fondo']);
  });

  test('normaliza error inesperado de distrito', async () => {
    distritoModel.getAllDistritos.mockRejectedValue(new Error('db'));
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const res = createResponse();
    await distritoController.getDistritos(createRequest(), res);
    expect(res.statusCode).toBe(500);
    spy.mockRestore();
  });
});

describe('ciudadController', () => {
  test('lista todas las ciudades paginadas', async () => {
    ciudadModel.getAllCiudades.mockResolvedValue({ data: [ciudadBase], total: 1 });
    const res = createResponse();
    await ciudadController.getCiudades(createRequest(), res);
    expect(ciudadModel.getAllCiudades).toHaveBeenCalledWith(1, 20);
  });

  test('lista por departamento y provincia', async () => {
    ciudadModel.getCiudadesByDepartamento.mockResolvedValue({ data: [ciudadBase] });
    const byDepartment = createResponse();
    await ciudadController.getCiudades(createRequest({ query: { departamento_id: '1' } }), byDepartment);
    expect(ciudadModel.getCiudadesByDepartamento).toHaveBeenCalledWith(1, 1, 20);

    ciudadModel.getCiudadesByProvincia.mockResolvedValue({ data: [ciudadBase] });
    const byProvince = createResponse();
    await ciudadController.getCiudades(createRequest({ query: { provincia_id: '20' } }), byProvince);
    expect(ciudadModel.getCiudadesByProvincia).toHaveBeenCalledWith(20, 1, 20);
  });

  test('lista por distrito existente', async () => {
    distritoModel.getDistritoById.mockResolvedValue(distritoBase);
    ciudadModel.getCiudadesByDistrito.mockResolvedValue({ data: [ciudadBase] });
    const res = createResponse();
    await ciudadController.getCiudades(createRequest({ query: { distrito_id: '30', page: '2', limit: '5' } }), res);
    expect(ciudadModel.getCiudadesByDistrito).toHaveBeenCalledWith(30, 2, 5);
  });

  test('devuelve 404 si distrito filtrado no existe', async () => {
    distritoModel.getDistritoById.mockResolvedValue(undefined);
    const res = createResponse();
    await ciudadController.getCiudades(createRequest({ query: { distrito_id: '30' } }), res);
    expect(res.statusCode).toBe(404);
  });

  test.each([
    { departamento_id: 'x' },
    { provincia_id: 'x' },
    { distrito_id: 'x' },
    { page: '0' },
    { limit: '101' }
  ])('rechaza filtro o paginacion invalida %#', async (query) => {
    const res = createResponse();
    await ciudadController.getCiudades(createRequest({ query }), res);
    expect(res.statusCode).toBe(400);
  });

  test('consulta ciudad existente e inexistente', async () => {
    ciudadModel.getCiudadById.mockResolvedValue(undefined);
    const missing = createResponse();
    await ciudadController.getCiudadById(createRequest({ params: { id: '40' } }), missing);
    expect(missing.statusCode).toBe(404);

    ciudadModel.getCiudadById.mockResolvedValue(ciudadBase);
    const found = createResponse();
    await ciudadController.getCiudadById(createRequest({ params: { id: '40' } }), found);
    expect(found.body).toEqual(ciudadBase);
  });

  test('rechaza creacion con datos incompletos', async () => {
    const res = createResponse();
    await ciudadController.createCiudad(createRequest({ body: { nombre: 'QA' } }), res);
    expect(res.statusCode).toBe(400);
  });

  test('rechaza distrito inexistente y tipo de ciudad invalido', async () => {
    distritoModel.getDistritoById.mockResolvedValue(undefined);
    const noParent = createResponse();
    await ciudadController.createCiudad(createRequest({ body: validCiudadBody }), noParent);
    expect(noParent.statusCode).toBe(404);

    distritoModel.getDistritoById.mockResolvedValue(distritoBase);
    const invalidType = createResponse();
    await ciudadController.createCiudad(createRequest({ body: { ...validCiudadBody, tipo_ciudad: 'Industrial' } }), invalidType);
    expect(invalidType.statusCode).toBe(400);
  });

  test('crea ciudad con imagen', async () => {
    distritoModel.getDistritoById.mockResolvedValue(distritoBase);
    ciudadModel.createCiudad.mockImplementation(async (data) => ({ id: 41, ...data }));
    const res = createResponse();
    await ciudadController.createCiudad(createRequest({ body: validCiudadBody, file: { filename: 'ciudad.webp' } }), res);
    expect(res.statusCode).toBe(201);
    expect(ciudadModel.createCiudad).toHaveBeenCalledWith(expect.objectContaining({
      nombre: 'Ayacucho',
      imagen_fondo: '/uploads/ciudades/ciudad.webp'
    }));
  });

  test('actualiza ciudad y limpia imagen anterior', async () => {
    ciudadModel.getCiudadById.mockResolvedValue(ciudadBase);
    distritoModel.getDistritoById.mockResolvedValue(distritoBase);
    ciudadModel.updateCiudad.mockImplementation(async (id, data) => ({ id, ...data }));
    const res = createResponse();
    await ciudadController.updateCiudad(createRequest({ params: { id: '40' }, body: validCiudadBody, file: { filename: 'nueva.jpg' } }), res);
    expect(res.statusCode).toBe(200);
    expect(imageLifecycle.cleanupReplacedImages).toHaveBeenCalled();
  });

  test('actualizacion devuelve 404 si ciudad no existe', async () => {
    ciudadModel.getCiudadById.mockResolvedValue(undefined);
    const res = createResponse();
    await ciudadController.updateCiudad(createRequest({ params: { id: '40' }, body: validCiudadBody }), res);
    expect(res.statusCode).toBe(404);
  });

  test('elimina ciudad y limpia imagen', async () => {
    ciudadModel.deleteCiudad.mockResolvedValue(ciudadBase);
    const res = createResponse();
    await ciudadController.deleteCiudad(createRequest({ params: { id: '40' } }), res);
    expect(res.statusCode).toBe(200);
    expect(imageLifecycle.cleanupResourceImages).toHaveBeenCalledWith(ciudadBase, ['imagen_fondo']);
  });

  test('normaliza error inesperado al listar ciudades', async () => {
    ciudadModel.getAllCiudades.mockRejectedValue(new Error('db'));
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const res = createResponse();
    await ciudadController.getCiudades(createRequest(), res);
    expect(res.statusCode).toBe(500);
    spy.mockRestore();
  });
});
