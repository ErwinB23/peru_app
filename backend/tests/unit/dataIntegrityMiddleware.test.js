import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { createRequest, createResponse } from '../helpers/httpMocks.js';

const queryMock = jest.fn();
const inputMock = jest.fn();
const requestMock = { input: inputMock, query: queryMock };
const poolMock = { request: jest.fn(() => requestMock) };
const getConnection = jest.fn(async () => poolMock);
const cleanupRequestFiles = jest.fn();
const sql = { Int: Symbol('Int'), VarChar: jest.fn((size) => `VarChar(${size})`) };

inputMock.mockImplementation(() => requestMock);

jest.unstable_mockModule('../../src/config/database.js', () => ({ getConnection, sql }));
jest.unstable_mockModule('../../src/utils/fileCleanup.js', () => ({ cleanupRequestFiles }));

const {
  ensureRelationExists,
  ensureResourceExists,
  ensureUniqueName
} = await import('../../src/middlewares/dataIntegrityMiddleware.js');

const next = () => jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  inputMock.mockImplementation(() => requestMock);
  poolMock.request.mockImplementation(() => requestMock);
  getConnection.mockResolvedValue(poolMock);
  cleanupRequestFiles.mockResolvedValue(undefined);
});

describe('ensureRelationExists', () => {
  test('rechaza relacion no configurada al construir middleware', () => {
    expect(() => ensureRelationExists('inexistente', 'id')).toThrow(/no configurada/i);
  });

  test('continua cuando la relacion existe', async () => {
    queryMock.mockResolvedValue({ recordset: [{ id: 1 }] });
    const middleware = ensureRelationExists('departamentos', 'departamento_id');
    const req = createRequest({ body: { departamento_id: 1 } });
    const res = createResponse();
    const nextFn = next();
    await middleware(req, res, nextFn);
    expect(nextFn).toHaveBeenCalledWith();
    expect(inputMock).toHaveBeenCalledWith('id', sql.Int, 1);
  });

  test('devuelve 404, detalles y limpia archivos si relacion no existe', async () => {
    queryMock.mockResolvedValue({ recordset: [] });
    const middleware = ensureRelationExists('provincias', 'provincia_id');
    const req = createRequest({ body: { provincia_id: 999 }, file: { path: 'tmp/a.jpg' } });
    const res = createResponse();
    const nextFn = next();
    await middleware(req, res, nextFn);
    expect(res.statusCode).toBe(404);
    expect(res.body.code).toBe('RELATED_RESOURCE_NOT_FOUND');
    expect(res.body.details[0].field).toBe('provincia_id');
    expect(cleanupRequestFiles).toHaveBeenCalledWith(req);
    expect(nextFn).not.toHaveBeenCalled();
  });

  test('propaga errores de base de datos', async () => {
    queryMock.mockRejectedValue(new Error('db'));
    const middleware = ensureRelationExists('distritos', 'distrito_id');
    const nextFn = next();
    await middleware(createRequest({ body: { distrito_id: 1 } }), createResponse(), nextFn);
    expect(nextFn.mock.calls[0][0]).toBeInstanceOf(Error);
  });
});

describe('ensureResourceExists', () => {
  test('rechaza tabla no permitida', () => {
    expect(() => ensureResourceExists('UsuariosSecretos')).toThrow(/no permitida/i);
  });

  test('guarda recurso existente en req y continua', async () => {
    const record = { id: 4, nombre: 'Ciudad QA' };
    queryMock.mockResolvedValue({ recordset: [record] });
    const middleware = ensureResourceExists('Ciudades');
    const req = createRequest({ params: { id: '4' } });
    const res = createResponse();
    const nextFn = next();
    await middleware(req, res, nextFn);
    expect(req.existingResource).toEqual(record);
    expect(nextFn).toHaveBeenCalledWith();
  });

  test('devuelve 404 y limpia archivo si recurso no existe', async () => {
    queryMock.mockResolvedValue({ recordset: [] });
    const middleware = ensureResourceExists('LugaresTuristicos');
    const req = createRequest({ params: { id: '90' }, file: { path: 'tmp/a.jpg' } });
    const res = createResponse();
    const nextFn = next();
    await middleware(req, res, nextFn);
    expect(res.statusCode).toBe(404);
    expect(res.body.code).toBe('RESOURCE_NOT_FOUND');
    expect(cleanupRequestFiles).toHaveBeenCalledWith(req);
  });
});

describe('ensureUniqueName', () => {
  test('rechaza tabla no permitida', () => {
    expect(() => ensureUniqueName('NoExiste')).toThrow(/no permitida/i);
  });

  test('continua cuando nombre de departamento es unico', async () => {
    queryMock.mockResolvedValue({ recordset: [] });
    const middleware = ensureUniqueName('Departamentos');
    const nextFn = next();
    await middleware(createRequest({ body: { nombre: ' Ayacucho ' } }), createResponse(), nextFn);
    expect(inputMock).toHaveBeenCalledWith('nombre', 'VarChar(160)', 'Ayacucho');
    expect(nextFn).toHaveBeenCalledWith();
  });

  test('considera padre e ID actual en una actualizacion', async () => {
    queryMock.mockResolvedValue({ recordset: [] });
    const middleware = ensureUniqueName('Provincias');
    const nextFn = next();
    await middleware(createRequest({
      params: { id: '7' },
      body: { nombre: 'Huamanga', departamento_id: 1 }
    }), createResponse(), nextFn);
    expect(inputMock).toHaveBeenCalledWith('parent_id', sql.Int, 1);
    expect(inputMock).toHaveBeenCalledWith('current_id', sql.Int, 7);
    expect(nextFn).toHaveBeenCalledWith();
  });

  test('recupera el padre actual cuando no viene en el body de update', async () => {
    queryMock
      .mockResolvedValueOnce({ recordset: [{ parent_id: 3 }] })
      .mockResolvedValueOnce({ recordset: [] });
    const middleware = ensureUniqueName('Distritos');
    const nextFn = next();
    await middleware(createRequest({ params: { id: '8' }, body: { nombre: 'QA' } }), createResponse(), nextFn);
    expect(inputMock).toHaveBeenCalledWith('parent_id', sql.Int, 3);
    expect(nextFn).toHaveBeenCalledWith();
  });

  test('devuelve 409 y limpia archivos ante duplicado', async () => {
    queryMock.mockResolvedValue({ recordset: [{ id: 99 }] });
    const middleware = ensureUniqueName('ComidasTipicasCiudades');
    const req = createRequest({ body: { nombre: 'Puca Picante', ciudad_id: 4 }, file: { path: 'tmp/a.jpg' } });
    const res = createResponse();
    const nextFn = next();
    await middleware(req, res, nextFn);
    expect(res.statusCode).toBe(409);
    expect(res.body.code).toBe('DUPLICATE_RESOURCE');
    expect(res.body.error).toMatch(/una comida/i);
    expect(cleanupRequestFiles).toHaveBeenCalledWith(req);
  });

  test('propaga error al consultar duplicados', async () => {
    queryMock.mockRejectedValue(new Error('db'));
    const middleware = ensureUniqueName('Ciudades');
    const nextFn = next();
    await middleware(createRequest({ body: { nombre: 'QA', distrito_id: 1 } }), createResponse(), nextFn);
    expect(nextFn.mock.calls[0][0]).toBeInstanceOf(Error);
  });
});
