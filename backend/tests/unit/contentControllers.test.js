import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { createRequest, createResponse } from '../helpers/httpMocks.js';

const lugarDepartamentoModel = {
  getLugaresByDepartamentoId: jest.fn(), getLugarById: jest.fn(),
  createLugarTuristico: jest.fn(), updateLugarTuristico: jest.fn(), deleteLugarTuristico: jest.fn()
};
const lugarProvinciaModel = {
  getLugaresByProvinciaId: jest.fn(), getLugarById: jest.fn(),
  createLugar: jest.fn(), updateLugar: jest.fn(), deleteLugar: jest.fn()
};
const lugarDistritoModel = {
  getLugaresByDistritoId: jest.fn(), getLugarById: jest.fn(),
  createLugar: jest.fn(), updateLugar: jest.fn(), deleteLugar: jest.fn()
};
const lugarCiudadModel = {
  getLugaresByCiudadId: jest.fn(), getLugarById: jest.fn(),
  createLugar: jest.fn(), updateLugar: jest.fn(), deleteLugar: jest.fn()
};
const comidaDepartamentoModel = {
  getComidasByDepartamentoId: jest.fn(), getComidaById: jest.fn(),
  createComidaTipica: jest.fn(), updateComidaTipica: jest.fn(), deleteComidaTipica: jest.fn()
};
const comidaProvinciaModel = {
  getComidasByProvinciaId: jest.fn(), getComidaById: jest.fn(),
  createComida: jest.fn(), updateComida: jest.fn(), deleteComida: jest.fn()
};
const comidaDistritoModel = {
  getComidasByDistritoId: jest.fn(), getComidaById: jest.fn(),
  createComida: jest.fn(), updateComida: jest.fn(), deleteComida: jest.fn()
};
const comidaCiudadModel = {
  getComidasByCiudadId: jest.fn(), getComidaById: jest.fn(),
  createComida: jest.fn(), updateComida: jest.fn(), deleteComida: jest.fn()
};

const provinciaModel = { getProvinciaById: jest.fn() };
const distritoModel = { getDistritoById: jest.fn() };
const ciudadModel = { getCiudadById: jest.fn() };
const imageLifecycle = { cleanupReplacedImages: jest.fn(), cleanupResourceImages: jest.fn() };

jest.unstable_mockModule('../../src/models/lugarTuristicoModel.js', () => lugarDepartamentoModel);
jest.unstable_mockModule('../../src/models/lugarTuristicoProvinciaModel.js', () => lugarProvinciaModel);
jest.unstable_mockModule('../../src/models/lugarTuristicoDistritoModel.js', () => lugarDistritoModel);
jest.unstable_mockModule('../../src/models/lugarTuristicoCiudadModel.js', () => lugarCiudadModel);
jest.unstable_mockModule('../../src/models/comidaTipicaModel.js', () => comidaDepartamentoModel);
jest.unstable_mockModule('../../src/models/comidaTipicaProvinciaModel.js', () => comidaProvinciaModel);
jest.unstable_mockModule('../../src/models/comidaTipicaDistritoModel.js', () => comidaDistritoModel);
jest.unstable_mockModule('../../src/models/comidaTipicaCiudadModel.js', () => comidaCiudadModel);
jest.unstable_mockModule('../../src/models/provinciaModel.js', () => provinciaModel);
jest.unstable_mockModule('../../src/models/distritoModel.js', () => distritoModel);
jest.unstable_mockModule('../../src/models/ciudadModel.js', () => ciudadModel);
jest.unstable_mockModule('../../src/utils/imageLifecycle.js', () => imageLifecycle);

const lugarDepartamentoController = await import('../../src/controllers/lugarTuristicoController.js');
const lugarProvinciaController = await import('../../src/controllers/lugarTuristicoProvinciaController.js');
const lugarDistritoController = await import('../../src/controllers/lugarTuristicoDistritoController.js');
const lugarCiudadController = await import('../../src/controllers/lugarTuristicoCiudadController.js');
const comidaDepartamentoController = await import('../../src/controllers/comidaTipicaController.js');
const comidaProvinciaController = await import('../../src/controllers/comidaTipicaProvinciaController.js');
const comidaDistritoController = await import('../../src/controllers/comidaTipicaDistritoController.js');
const comidaCiudadController = await import('../../src/controllers/comidaTipicaCiudadController.js');

const baseLugar = { id: 10, nombre: 'Lugar QA', imagen: '/uploads/anterior.jpg' };
const baseComida = { id: 20, nombre: 'Comida QA', imagen: '/uploads/anterior.jpg' };

const descriptors = [
  {
    name: 'lugar turistico de departamento', controller: lugarDepartamentoController,
    model: lugarDepartamentoModel, listFn: 'getLugaresByDepartamentoId', controllerList: 'getLugaresByDepartamentoId',
    routeParam: 'departamentoId', bodyParent: 'departamento_id', parentId: 1,
    getFn: 'getLugarById', controllerGet: 'getLugarById', createModel: 'createLugarTuristico', controllerCreate: 'createLugarTuristico',
    updateModel: 'updateLugarTuristico', controllerUpdate: 'updateLugarTuristico', deleteModel: 'deleteLugarTuristico', controllerDelete: 'deleteLugarTuristico',
    base: baseLugar, responseField: 'lugar', imageDir: 'lugares-turisticos', parentModel: null, imageFields: ['imagen', 'imagen_2', 'imagen_3', 'imagen_4']
  },
  {
    name: 'lugar turistico de provincia', controller: lugarProvinciaController,
    model: lugarProvinciaModel, listFn: 'getLugaresByProvinciaId', controllerList: 'getLugaresByProvinciaId',
    routeParam: 'provinciaId', bodyParent: 'provincia_id', parentId: 2,
    getFn: 'getLugarById', controllerGet: 'getLugarById', createModel: 'createLugar', controllerCreate: 'createLugar',
    updateModel: 'updateLugar', controllerUpdate: 'updateLugar', deleteModel: 'deleteLugar', controllerDelete: 'deleteLugar',
    base: baseLugar, responseField: 'lugar', imageDir: 'lugares-turisticos-provincias', parentModel: provinciaModel, parentGet: 'getProvinciaById', imageFields: ['imagen']
  },
  {
    name: 'lugar turistico de distrito', controller: lugarDistritoController,
    model: lugarDistritoModel, listFn: 'getLugaresByDistritoId', controllerList: 'getLugaresByDistritoId',
    routeParam: 'distritoId', bodyParent: 'distrito_id', parentId: 3,
    getFn: 'getLugarById', controllerGet: 'getLugarById', createModel: 'createLugar', controllerCreate: 'createLugar',
    updateModel: 'updateLugar', controllerUpdate: 'updateLugar', deleteModel: 'deleteLugar', controllerDelete: 'deleteLugar',
    base: baseLugar, responseField: 'lugar', imageDir: 'lugares-turisticos-distritos', parentModel: distritoModel, parentGet: 'getDistritoById', imageFields: ['imagen']
  },
  {
    name: 'lugar turistico de ciudad', controller: lugarCiudadController,
    model: lugarCiudadModel, listFn: 'getLugaresByCiudadId', controllerList: 'getLugaresByCiudadId',
    routeParam: 'ciudadId', bodyParent: 'ciudad_id', parentId: 4,
    getFn: 'getLugarById', controllerGet: 'getLugarById', createModel: 'createLugar', controllerCreate: 'createLugar',
    updateModel: 'updateLugar', controllerUpdate: 'updateLugar', deleteModel: 'deleteLugar', controllerDelete: 'deleteLugar',
    base: baseLugar, responseField: 'lugar', imageDir: 'lugares-turisticos-ciudades', parentModel: ciudadModel, parentGet: 'getCiudadById', imageFields: ['imagen']
  },
  {
    name: 'comida tipica de departamento', controller: comidaDepartamentoController,
    model: comidaDepartamentoModel, listFn: 'getComidasByDepartamentoId', controllerList: 'getComidasByDepartamentoId',
    routeParam: 'departamentoId', bodyParent: 'departamento_id', parentId: 1,
    getFn: 'getComidaById', controllerGet: 'getComidaById', createModel: 'createComidaTipica', controllerCreate: 'createComidaTipica',
    updateModel: 'updateComidaTipica', controllerUpdate: 'updateComidaTipica', deleteModel: 'deleteComidaTipica', controllerDelete: 'deleteComidaTipica',
    base: baseComida, responseField: 'comida', imageDir: 'comidas-tipicas', parentModel: null, imageFields: ['imagen']
  },
  {
    name: 'comida tipica de provincia', controller: comidaProvinciaController,
    model: comidaProvinciaModel, listFn: 'getComidasByProvinciaId', controllerList: 'getComidasByProvinciaId',
    routeParam: 'provinciaId', bodyParent: 'provincia_id', parentId: 2,
    getFn: 'getComidaById', controllerGet: 'getComidaById', createModel: 'createComida', controllerCreate: 'createComida',
    updateModel: 'updateComida', controllerUpdate: 'updateComida', deleteModel: 'deleteComida', controllerDelete: 'deleteComida',
    base: baseComida, responseField: 'comida', imageDir: 'comidas-tipicas-provincias', parentModel: provinciaModel, parentGet: 'getProvinciaById', imageFields: ['imagen']
  },
  {
    name: 'comida tipica de distrito', controller: comidaDistritoController,
    model: comidaDistritoModel, listFn: 'getComidasByDistritoId', controllerList: 'getComidasByDistritoId',
    routeParam: 'distritoId', bodyParent: 'distrito_id', parentId: 3,
    getFn: 'getComidaById', controllerGet: 'getComidaById', createModel: 'createComida', controllerCreate: 'createComida',
    updateModel: 'updateComida', controllerUpdate: 'updateComida', deleteModel: 'deleteComida', controllerDelete: 'deleteComida',
    base: baseComida, responseField: 'comida', imageDir: 'comidas-tipicas-distritos', parentModel: distritoModel, parentGet: 'getDistritoById', imageFields: ['imagen']
  },
  {
    name: 'comida tipica de ciudad', controller: comidaCiudadController,
    model: comidaCiudadModel, listFn: 'getComidasByCiudadId', controllerList: 'getComidasByCiudadId',
    routeParam: 'ciudadId', bodyParent: 'ciudad_id', parentId: 4,
    getFn: 'getComidaById', controllerGet: 'getComidaById', createModel: 'createComida', controllerCreate: 'createComida',
    updateModel: 'updateComida', controllerUpdate: 'updateComida', deleteModel: 'deleteComida', controllerDelete: 'deleteComida',
    base: baseComida, responseField: 'comida', imageDir: 'comidas-tipicas-ciudades', parentModel: ciudadModel, parentGet: 'getCiudadById', imageFields: ['imagen']
  }
];

beforeEach(() => {
  jest.clearAllMocks();
  const groups = [
    lugarDepartamentoModel, lugarProvinciaModel, lugarDistritoModel, lugarCiudadModel,
    comidaDepartamentoModel, comidaProvinciaModel, comidaDistritoModel, comidaCiudadModel,
    provinciaModel, distritoModel, ciudadModel, imageLifecycle
  ];
  for (const group of groups) for (const fn of Object.values(group)) fn.mockReset();
  imageLifecycle.cleanupReplacedImages.mockResolvedValue(undefined);
  imageLifecycle.cleanupResourceImages.mockResolvedValue(undefined);
});

for (const d of descriptors) {
  describe(d.name, () => {
    test('rechaza ID padre invalido al listar', async () => {
      const res = createResponse();
      await d.controller[d.controllerList](createRequest({ params: { [d.routeParam]: 'x' } }), res);
      expect(res.statusCode).toBe(400);
    });

    test('lista contenido del ambito solicitado', async () => {
      d.model[d.listFn].mockResolvedValue([d.base]);
      const res = createResponse();
      await d.controller[d.controllerList](createRequest({ params: { [d.routeParam]: String(d.parentId) } }), res);
      expect(d.model[d.listFn]).toHaveBeenCalledWith(d.parentId);
      expect(res.body).toEqual([d.base]);
    });

    test('normaliza error inesperado al listar', async () => {
      d.model[d.listFn].mockRejectedValue(new Error('db'));
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const res = createResponse();
      await d.controller[d.controllerList](createRequest({ params: { [d.routeParam]: String(d.parentId) } }), res);
      expect(res.statusCode).toBe(500);
      expect(res.body.code).toBe('INTERNAL_ERROR');
      spy.mockRestore();
    });

    test('rechaza ID de contenido invalido', async () => {
      const res = createResponse();
      await d.controller[d.controllerGet](createRequest({ params: { id: 'x' } }), res);
      expect(res.statusCode).toBe(400);
    });

    test('devuelve 404 cuando el contenido no existe', async () => {
      d.model[d.getFn].mockResolvedValue(undefined);
      const res = createResponse();
      await d.controller[d.controllerGet](createRequest({ params: { id: '10' } }), res);
      expect(res.statusCode).toBe(404);
    });

    test('devuelve contenido por ID', async () => {
      d.model[d.getFn].mockResolvedValue(d.base);
      const res = createResponse();
      await d.controller[d.controllerGet](createRequest({ params: { id: '10' } }), res);
      expect(res.body).toEqual(d.base);
    });

    if (d.parentModel) {
      test('rechaza ID padre invalido al crear', async () => {
        const res = createResponse();
        await d.controller[d.controllerCreate](createRequest({ body: { nombre: 'QA', [d.bodyParent]: 'x' } }), res);
        expect(res.statusCode).toBe(400);
      });

      test('devuelve 404 si la relacion padre no existe', async () => {
        d.parentModel[d.parentGet].mockResolvedValue(undefined);
        const res = createResponse();
        await d.controller[d.controllerCreate](createRequest({ body: { nombre: 'QA', [d.bodyParent]: d.parentId } }), res);
        expect(res.statusCode).toBe(404);
      });
    }

    test('crea contenido con imagen cargada', async () => {
      if (d.parentModel) d.parentModel[d.parentGet].mockResolvedValue({ id: d.parentId });
      d.model[d.createModel].mockImplementation(async (data) => ({ id: 50, ...data }));
      const req = createRequest({
        body: { nombre: 'Contenido QA', descripcion: 'Descripcion QA', [d.bodyParent]: d.parentId },
        file: { filename: 'contenido.webp' }
      });
      const res = createResponse();
      await d.controller[d.controllerCreate](req, res);
      expect(res.statusCode).toBe(201);
      expect(d.model[d.createModel]).toHaveBeenCalledWith(expect.objectContaining({
        [d.bodyParent]: d.parentId,
        imagen: `/uploads/${d.imageDir}/contenido.webp`
      }));
    });

    test('crea contenido conservando URL recibida', async () => {
      if (d.parentModel) d.parentModel[d.parentGet].mockResolvedValue({ id: d.parentId });
      d.model[d.createModel].mockImplementation(async (data) => ({ id: 51, ...data }));
      const res = createResponse();
      await d.controller[d.controllerCreate](createRequest({
        body: { nombre: 'Contenido QA', [d.bodyParent]: d.parentId, imagen: 'https://cdn.test/imagen.jpg' }
      }), res);
      expect(res.statusCode).toBe(201);
      expect(d.model[d.createModel]).toHaveBeenCalledWith(expect.objectContaining({ imagen: 'https://cdn.test/imagen.jpg' }));
    });

    test('actualizacion devuelve 404 cuando no existe', async () => {
      d.model[d.getFn].mockResolvedValue(undefined);
      const res = createResponse();
      await d.controller[d.controllerUpdate](createRequest({ params: { id: '10' }, body: { nombre: 'QA' } }), res);
      expect(res.statusCode).toBe(404);
    });

    test('actualiza contenido, reemplaza imagen y limpia la anterior', async () => {
      d.model[d.getFn].mockResolvedValue(d.base);
      d.model[d.updateModel].mockImplementation(async (id, data) => ({ id, ...data }));
      const res = createResponse();
      await d.controller[d.controllerUpdate](createRequest({
        params: { id: '10' }, body: { nombre: 'Actualizado' }, file: { filename: 'nueva.jpg' }
      }), res);
      expect(res.statusCode).toBe(200);
      expect(d.model[d.updateModel]).toHaveBeenCalledWith(10, expect.objectContaining({
        imagen: `/uploads/${d.imageDir}/nueva.jpg`
      }));
      expect(imageLifecycle.cleanupReplacedImages).toHaveBeenCalledWith(d.base, expect.any(Object), d.imageFields);
    });

    test('actualizacion conserva imagen anterior cuando no se envia otra', async () => {
      d.model[d.getFn].mockResolvedValue(d.base);
      d.model[d.updateModel].mockImplementation(async (id, data) => ({ id, ...data }));
      const res = createResponse();
      await d.controller[d.controllerUpdate](createRequest({ params: { id: '10' }, body: { nombre: 'Actualizado' } }), res);
      expect(d.model[d.updateModel]).toHaveBeenCalledWith(10, expect.objectContaining({ imagen: d.base.imagen }));
    });

    test('eliminacion devuelve 404 cuando no existe', async () => {
      d.model[d.deleteModel].mockResolvedValue(undefined);
      const res = createResponse();
      await d.controller[d.controllerDelete](createRequest({ params: { id: '10' } }), res);
      expect(res.statusCode).toBe(404);
    });

    test('elimina contenido y limpia sus imagenes', async () => {
      d.model[d.deleteModel].mockResolvedValue(d.base);
      const res = createResponse();
      await d.controller[d.controllerDelete](createRequest({ params: { id: '10' } }), res);
      expect(res.statusCode).toBe(200);
      expect(imageLifecycle.cleanupResourceImages).toHaveBeenCalledWith(d.base, d.imageFields);
    });

    test('normaliza error inesperado al eliminar', async () => {
      d.model[d.deleteModel].mockRejectedValue(new Error('db'));
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const res = createResponse();
      await d.controller[d.controllerDelete](createRequest({ params: { id: '10' } }), res);
      expect(res.statusCode).toBe(500);
      spy.mockRestore();
    });
  });
}
