import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { createRequest, createResponse } from '../helpers/httpMocks.js';

const departamentoModel = {
  getAllDepartamentos: jest.fn(),
  getDepartamentoById: jest.fn(),
  createDepartamento: jest.fn(),
  updateDepartamento: jest.fn(),
  updateDepartamentoIntroduccion: jest.fn(),
  deleteDepartamento: jest.fn()
};

const imageLifecycle = {
  cleanupReplacedImages: jest.fn(),
  cleanupResourceImages: jest.fn()
};

jest.unstable_mockModule('../../src/models/departamentoModel.js', () => departamentoModel);
jest.unstable_mockModule('../../src/utils/imageLifecycle.js', () => imageLifecycle);

const {
  getDepartamentos,
  getDepartamentoById,
  createDepartamento,
  updateDepartamento,
  updateDepartamentoIntroduccion,
  deleteDepartamento
} = await import('../../src/controllers/departamentoController.js');

const departamentoBase = {
  id: 10,
  nombre: 'Ayacucho',
  capital: 'Huamanga',
  region_natural: 'Sierra',
  area_km2: 43814.8,
  poblacion_aprox: 700000,
  introduccion: 'Texto anterior',
  imagen_fondo: '/uploads/departamentos/anterior.jpg'
};

beforeEach(() => {
  jest.clearAllMocks();
  for (const fn of Object.values(departamentoModel)) {
    fn.mockReset();
  }
  imageLifecycle.cleanupReplacedImages.mockReset().mockResolvedValue(undefined);
  imageLifecycle.cleanupResourceImages.mockReset().mockResolvedValue(undefined);
});

describe('departamentoController.getDepartamentos', () => {
  test('devuelve el listado de departamentos', async () => {
    departamentoModel.getAllDepartamentos.mockResolvedValue([departamentoBase]);
    const req = createRequest();
    const res = createResponse();

    await getDepartamentos(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([departamentoBase]);
  });

  test('normaliza un error inesperado del listado', async () => {
    departamentoModel.getAllDepartamentos.mockRejectedValue(new Error('database down'));
    const req = createRequest();
    const res = createResponse();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await getDepartamentos(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body.code).toBe('INTERNAL_ERROR');
    expect(res.body.error).toBe('Error al obtener departamentos');
    consoleSpy.mockRestore();
  });
});

describe('departamentoController.getDepartamentoById', () => {
  test.each(['abc', '0', '-2', '1.5'])('rechaza el ID invalido %s', async (id) => {
    const req = createRequest({ params: { id } });
    const res = createResponse();

    await getDepartamentoById(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/id de departamento invalido|id de departamento inválido/i);
  });

  test('devuelve 404 estandarizado cuando no existe', async () => {
    departamentoModel.getDepartamentoById.mockResolvedValue(undefined);
    const req = createRequest({ params: { id: '999' } });
    const res = createResponse();

    await getDepartamentoById(req, res);

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({
      error: 'Departamento no encontrado',
      code: 'RESOURCE_NOT_FOUND'
    });
  });

  test('devuelve el departamento solicitado', async () => {
    departamentoModel.getDepartamentoById.mockResolvedValue(departamentoBase);
    const req = createRequest({ params: { id: '10' } });
    const res = createResponse();

    await getDepartamentoById(req, res);

    expect(departamentoModel.getDepartamentoById).toHaveBeenCalledWith(10);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(departamentoBase);
  });

  test('normaliza un error inesperado de consulta', async () => {
    departamentoModel.getDepartamentoById.mockRejectedValue(new Error('database down'));
    const req = createRequest({ params: { id: '10' } });
    const res = createResponse();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await getDepartamentoById(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Error al obtener departamento');
    consoleSpy.mockRestore();
  });
});

describe('departamentoController.createDepartamento', () => {
  test('crea un departamento sin imagen ni introduccion', async () => {
    departamentoModel.createDepartamento.mockImplementation(async (data) => ({
      id: 11,
      ...data
    }));
    const req = createRequest({
      body: {
        nombre: 'Apurimac',
        capital: 'Abancay',
        region_natural: 'Sierra',
        area_km2: 20895.8,
        poblacion_aprox: 430000
      }
    });
    const res = createResponse();

    await createDepartamento(req, res);

    expect(departamentoModel.createDepartamento).toHaveBeenCalledWith(
      expect.objectContaining({ imagen_fondo: null, introduccion: null })
    );
    expect(res.statusCode).toBe(201);
    expect(res.body.departamento.nombre).toBe('Apurimac');
  });

  test('usa la ruta del archivo cargado y conserva la introduccion', async () => {
    departamentoModel.createDepartamento.mockImplementation(async (data) => ({
      id: 12,
      ...data
    }));
    const req = createRequest({
      body: {
        nombre: 'Cusco',
        introduccion: 'Introduccion QA'
      },
      file: { filename: 'cusco.webp' }
    });
    const res = createResponse();

    await createDepartamento(req, res);

    expect(departamentoModel.createDepartamento).toHaveBeenCalledWith(
      expect.objectContaining({
        imagen_fondo: '/uploads/departamentos/cusco.webp',
        introduccion: 'Introduccion QA'
      })
    );
    expect(res.statusCode).toBe(201);
  });

  test('acepta una URL o ruta ya enviada en el cuerpo', async () => {
    departamentoModel.createDepartamento.mockImplementation(async (data) => ({
      id: 13,
      ...data
    }));
    const req = createRequest({
      body: {
        nombre: 'Puno',
        imagen_fondo: 'https://cdn.example.test/puno.jpg'
      }
    });
    const res = createResponse();

    await createDepartamento(req, res);

    expect(departamentoModel.createDepartamento).toHaveBeenCalledWith(
      expect.objectContaining({
        imagen_fondo: 'https://cdn.example.test/puno.jpg'
      })
    );
  });

  test('normaliza un error inesperado de creacion', async () => {
    departamentoModel.createDepartamento.mockRejectedValue(new Error('database down'));
    const req = createRequest({ body: { nombre: 'QA' } });
    const res = createResponse();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await createDepartamento(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Error al crear departamento');
    consoleSpy.mockRestore();
  });
});

describe('departamentoController.updateDepartamento', () => {
  test.each(['abc', '0', '-1'])('rechaza el ID invalido %s', async (id) => {
    const req = createRequest({ params: { id }, body: {} });
    const res = createResponse();

    await updateDepartamento(req, res);

    expect(res.statusCode).toBe(400);
    expect(departamentoModel.getDepartamentoById).not.toHaveBeenCalled();
  });

  test('devuelve 404 cuando el departamento no existe', async () => {
    departamentoModel.getDepartamentoById.mockResolvedValue(undefined);
    const req = createRequest({ params: { id: '99' }, body: {} });
    const res = createResponse();

    await updateDepartamento(req, res);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/no encontrado/i);
    expect(departamentoModel.updateDepartamento).not.toHaveBeenCalled();
  });

  test('conserva imagen e introduccion cuando no se reemplazan', async () => {
    departamentoModel.getDepartamentoById.mockResolvedValue(departamentoBase);
    departamentoModel.updateDepartamento.mockImplementation(async (id, data) => ({
      id,
      ...data
    }));
    const req = createRequest({
      params: { id: '10' },
      body: { nombre: 'Ayacucho actualizado' }
    });
    const res = createResponse();

    await updateDepartamento(req, res);

    expect(departamentoModel.updateDepartamento).toHaveBeenCalledWith(
      10,
      expect.objectContaining({
        nombre: 'Ayacucho actualizado',
        imagen_fondo: '/uploads/departamentos/anterior.jpg',
        introduccion: 'Texto anterior'
      })
    );
    expect(imageLifecycle.cleanupReplacedImages).toHaveBeenCalledWith(
      departamentoBase,
      expect.any(Object),
      ['imagen_fondo']
    );
    expect(res.statusCode).toBe(200);
  });

  test('reemplaza imagen e introduccion cuando se envian', async () => {
    departamentoModel.getDepartamentoById.mockResolvedValue(departamentoBase);
    departamentoModel.updateDepartamento.mockImplementation(async (id, data) => ({
      id,
      ...data
    }));
    const req = createRequest({
      params: { id: '10' },
      body: { introduccion: '', imagen_fondo: 'ignorada.jpg' },
      file: { filename: 'nueva.png' }
    });
    const res = createResponse();

    await updateDepartamento(req, res);

    expect(departamentoModel.updateDepartamento).toHaveBeenCalledWith(
      10,
      expect.objectContaining({
        imagen_fondo: '/uploads/departamentos/nueva.png',
        introduccion: ''
      })
    );
    expect(imageLifecycle.cleanupReplacedImages).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(200);
  });

  test('usa imagen del cuerpo si no existe un archivo nuevo', async () => {
    departamentoModel.getDepartamentoById.mockResolvedValue(departamentoBase);
    departamentoModel.updateDepartamento.mockImplementation(async (id, data) => ({
      id,
      ...data
    }));
    const req = createRequest({
      params: { id: '10' },
      body: { imagen_fondo: 'https://cdn.example.test/nueva.webp' }
    });
    const res = createResponse();

    await updateDepartamento(req, res);

    expect(departamentoModel.updateDepartamento).toHaveBeenCalledWith(
      10,
      expect.objectContaining({
        imagen_fondo: 'https://cdn.example.test/nueva.webp'
      })
    );
  });

  test('normaliza un error inesperado de actualizacion', async () => {
    departamentoModel.getDepartamentoById.mockResolvedValue(departamentoBase);
    departamentoModel.updateDepartamento.mockRejectedValue(new Error('database down'));
    const req = createRequest({ params: { id: '10' }, body: {} });
    const res = createResponse();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await updateDepartamento(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Error al actualizar departamento');
    expect(imageLifecycle.cleanupReplacedImages).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

describe('departamentoController.updateDepartamentoIntroduccion', () => {
  test('actualiza solamente la introduccion y devuelve el departamento', async () => {
    const updated = { ...departamentoBase, introduccion: 'Nueva presentación' };
    departamentoModel.updateDepartamentoIntroduccion.mockResolvedValue(updated);
    const req = createRequest({
      params: { id: '10' },
      body: { introduccion: 'Nueva presentación' }
    });
    const res = createResponse();

    await updateDepartamentoIntroduccion(req, res);

    expect(departamentoModel.updateDepartamentoIntroduccion).toHaveBeenCalledWith(
      10,
      'Nueva presentación'
    );
    expect(res.statusCode).toBe(200);
    expect(res.body.departamento).toEqual(updated);
  });

  test('permite retirar la introduccion con null', async () => {
    const updated = { ...departamentoBase, introduccion: null };
    departamentoModel.updateDepartamentoIntroduccion.mockResolvedValue(updated);
    const req = createRequest({ params: { id: '10' }, body: { introduccion: null } });
    const res = createResponse();

    await updateDepartamentoIntroduccion(req, res);

    expect(departamentoModel.updateDepartamentoIntroduccion).toHaveBeenCalledWith(10, null);
    expect(res.body.departamento.introduccion).toBeNull();
  });

  test('normaliza un error inesperado', async () => {
    departamentoModel.updateDepartamentoIntroduccion.mockRejectedValue(new Error('database down'));
    const req = createRequest({ params: { id: '10' }, body: { introduccion: 'QA' } });
    const res = createResponse();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await updateDepartamentoIntroduccion(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Error al actualizar la presentación del departamento');
    consoleSpy.mockRestore();
  });
});

describe('departamentoController.deleteDepartamento', () => {
  test.each(['abc', '0', '-1'])('rechaza el ID invalido %s', async (id) => {
    const req = createRequest({ params: { id } });
    const res = createResponse();

    await deleteDepartamento(req, res);

    expect(res.statusCode).toBe(400);
    expect(departamentoModel.deleteDepartamento).not.toHaveBeenCalled();
  });

  test('devuelve 404 si no existe el departamento', async () => {
    departamentoModel.deleteDepartamento.mockResolvedValue(undefined);
    const req = createRequest({ params: { id: '99' } });
    const res = createResponse();

    await deleteDepartamento(req, res);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/no encontrado/i);
    expect(imageLifecycle.cleanupResourceImages).not.toHaveBeenCalled();
  });

  test('elimina el registro y limpia la imagen asociada', async () => {
    departamentoModel.deleteDepartamento.mockResolvedValue(departamentoBase);
    const req = createRequest({ params: { id: '10' } });
    const res = createResponse();

    await deleteDepartamento(req, res);

    expect(departamentoModel.deleteDepartamento).toHaveBeenCalledWith(10);
    expect(imageLifecycle.cleanupResourceImages).toHaveBeenCalledWith(
      departamentoBase,
      ['imagen_fondo']
    );
    expect(res.statusCode).toBe(200);
    expect(res.body.departamento).toEqual(departamentoBase);
  });

  test('normaliza un error inesperado de eliminacion', async () => {
    departamentoModel.deleteDepartamento.mockRejectedValue(new Error('database down'));
    const req = createRequest({ params: { id: '10' } });
    const res = createResponse();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await deleteDepartamento(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Error al eliminar departamento');
    consoleSpy.mockRestore();
  });
});
