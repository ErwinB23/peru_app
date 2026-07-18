import { describe, expect, jest, test } from '@jest/globals';
import {
  validateDepartamentoBody,
  validateIdParam,
  validateRegisterBody
} from '../../src/validators/validationMiddleware.js';
import { createRequest, createResponse } from '../helpers/httpMocks.js';

const run = async (middleware, req) => {
  const res = createResponse();
  const next = jest.fn();
  await middleware(req, res, next);
  return { req, res, next };
};

describe('validacion centralizada', () => {
  test('normaliza un registro valido y permite continuar', async () => {
    const req = createRequest({
      body: {
        nombres: '  Ana  ',
        apellidos: ' Quispe ',
        fecha_nacimiento: '2000-05-20',
        email: ' ANA@EJEMPLO.COM ',
        password: 'segura123'
      }
    });

    const { next } = await run(validateRegisterBody, req);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.body.nombres).toBe('Ana');
    expect(req.body.email).toBe('ana@ejemplo.com');
  });

  test('rechaza correo invalido y contrasena corta con 400', async () => {
    const req = createRequest({
      body: {
        nombres: 'Ana',
        apellidos: 'Q',
        fecha_nacimiento: '2000-05-20',
        email: 'correo-invalido',
        password: '123'
      }
    });

    const { res, next } = await run(validateRegisterBody, req);

    expect(res.statusCode).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
    expect(res.body.details.map((item) => item.field)).toEqual(
      expect.arrayContaining(['apellidos', 'email', 'password'])
    );
    expect(next).not.toHaveBeenCalled();
  });

  test('rechaza una fecha futura', async () => {
    const req = createRequest({
      body: {
        nombres: 'Ana',
        apellidos: 'Quispe',
        fecha_nacimiento: '2999-01-01',
        email: 'ana@ejemplo.com',
        password: 'segura123'
      }
    });

    const { res } = await run(validateRegisterBody, req);

    expect(res.statusCode).toBe(400);
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'fecha_nacimiento' })
      ])
    );
  });

  test('rechaza area negativa y poblacion decimal', async () => {
    const req = createRequest({
      body: {
        nombre: 'QA Departamento',
        capital: 'QA Capital',
        region_natural: 'Sierra',
        area_km2: -1,
        poblacion_aprox: 10.5
      }
    });

    const { res } = await run(validateDepartamentoBody, req);

    expect(res.statusCode).toBe(400);
    expect(res.body.details.map((item) => item.field)).toEqual(
      expect.arrayContaining(['area_km2', 'poblacion_aprox'])
    );
  });

  test('rechaza identificadores no positivos', async () => {
    const req = createRequest({ params: { id: '0' } });
    const { res, next } = await run(validateIdParam, req);

    expect(res.statusCode).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
    expect(next).not.toHaveBeenCalled();
  });
});
