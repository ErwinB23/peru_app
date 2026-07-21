import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const input = jest.fn();
const query = jest.fn();
const request = { input, query };
const pool = { request: jest.fn(() => request) };
input.mockReturnValue(request);

const sql = {
  Int: 'Int',
  MAX: 'MAX',
  VarChar: jest.fn((length) => ({ type: 'VarChar', length }))
};

jest.unstable_mockModule('../../src/config/database.js', () => ({
  getConnection: jest.fn(async () => pool),
  sql
}));

const { updateDepartamentoIntroduccion } = await import('../../src/models/departamentoModel.js');

beforeEach(() => {
  jest.clearAllMocks();
  input.mockReturnValue(request);
});

describe('departamentoModel.updateDepartamentoIntroduccion', () => {
  test('actualiza exclusivamente introduccion mediante parametros y devuelve el registro', async () => {
    const updated = { id: 10, nombre: 'Ayacucho', introduccion: 'Nueva presentación' };
    query.mockResolvedValue({ recordset: [updated] });

    const result = await updateDepartamentoIntroduccion(10, 'Nueva presentación');

    expect(input).toHaveBeenNthCalledWith(1, 'id', sql.Int, 10);
    expect(input).toHaveBeenNthCalledWith(
      2,
      'introduccion',
      { type: 'VarChar', length: 'MAX' },
      'Nueva presentación'
    );
    expect(query).toHaveBeenCalledWith(expect.stringMatching(
      /UPDATE Departamentos\s+SET introduccion = @introduccion\s+OUTPUT INSERTED\.\*\s+WHERE id = @id/
    ));
    expect(result).toEqual(updated);
  });

  test('envia null para retirar la introduccion', async () => {
    query.mockResolvedValue({ recordset: [{ id: 10, introduccion: null }] });

    await updateDepartamentoIntroduccion(10, null);

    expect(input).toHaveBeenNthCalledWith(
      2,
      'introduccion',
      { type: 'VarChar', length: 'MAX' },
      null
    );
  });
});
