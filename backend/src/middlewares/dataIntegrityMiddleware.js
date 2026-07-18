import { getConnection, sql } from '../config/database.js';
import { AppError, errorPayload } from '../utils/httpErrors.js';
import { cleanupRequestFiles } from '../utils/fileCleanup.js';

const TABLES = Object.freeze({
  Departamentos: { parentField: null, parentBodyField: null, label: 'departamento' },
  Provincias: { parentField: 'departamento_id', parentBodyField: 'departamento_id', label: 'provincia' },
  Distritos: { parentField: 'provincia_id', parentBodyField: 'provincia_id', label: 'distrito' },
  Ciudades: { parentField: 'distrito_id', parentBodyField: 'distrito_id', label: 'ciudad' },
  LugaresTuristicos: { parentField: 'departamento_id', parentBodyField: 'departamento_id', label: 'lugar turístico' },
  ComidasTipicas: { parentField: 'departamento_id', parentBodyField: 'departamento_id', label: 'comida típica' },
  LugaresTuristicosProvincias: { parentField: 'provincia_id', parentBodyField: 'provincia_id', label: 'lugar turístico' },
  ComidasTipicasProvincias: { parentField: 'provincia_id', parentBodyField: 'provincia_id', label: 'comida típica' },
  LugaresTuristicosDistritos: { parentField: 'distrito_id', parentBodyField: 'distrito_id', label: 'lugar turístico' },
  ComidasTipicasDistritos: { parentField: 'distrito_id', parentBodyField: 'distrito_id', label: 'comida típica' },
  LugaresTuristicosCiudades: { parentField: 'ciudad_id', parentBodyField: 'ciudad_id', label: 'lugar turístico' },
  ComidasTipicasCiudades: { parentField: 'ciudad_id', parentBodyField: 'ciudad_id', label: 'comida típica' }
});

const RELATIONS = Object.freeze({
  departamentos: { table: 'Departamentos', label: 'Departamento' },
  provincias: { table: 'Provincias', label: 'Provincia' },
  distritos: { table: 'Distritos', label: 'Distrito' },
  ciudades: { table: 'Ciudades', label: 'Ciudad' }
});

const reject = async (req, res, error) => {
  await cleanupRequestFiles(req);
  return res.status(error.status).json(errorPayload(error));
};

export const ensureRelationExists = (relationKey, bodyField) => {
  const relation = RELATIONS[relationKey];

  if (!relation) {
    throw new Error(`Relación no configurada: ${relationKey}`);
  }

  return async (req, res, next) => {
    try {
      const id = Number(req.body?.[bodyField]);
      const pool = await getConnection();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`SELECT id FROM dbo.${relation.table} WHERE id = @id`);

      if (!result.recordset[0]) {
        return reject(req, res, new AppError(
          `${relation.label} asociado no encontrado`,
          404,
          'RELATED_RESOURCE_NOT_FOUND',
          [{ field: bodyField, message: `${relation.label} asociado no existe` }]
        ));
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
};


export const ensureResourceExists = (tableName) => {
  const config = TABLES[tableName];

  if (!config) {
    throw new Error(`Tabla no permitida para validación de existencia: ${tableName}`);
  }

  return async (req, res, next) => {
    try {
      const id = Number(req.params?.id);
      const pool = await getConnection();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`SELECT TOP 1 * FROM dbo.${tableName} WHERE id = @id`);

      if (!result.recordset[0]) {
        return reject(req, res, new AppError(
          `${config.label.charAt(0).toUpperCase()}${config.label.slice(1)} no encontrado`,
          404,
          'RESOURCE_NOT_FOUND'
        ));
      }

      req.existingResource = result.recordset[0];
      return next();
    } catch (error) {
      return next(error);
    }
  };
};

export const ensureUniqueName = (tableName) => {
  const config = TABLES[tableName];

  if (!config) {
    throw new Error(`Tabla no permitida para validación de duplicados: ${tableName}`);
  }

  return async (req, res, next) => {
    try {
      const nombre = String(req.body?.nombre || '').trim();
      const currentId = req.params?.id ? Number(req.params.id) : null;
      let parentId = config.parentBodyField
        ? Number(req.body?.[config.parentBodyField])
        : null;

      const pool = await getConnection();

      if (config.parentField && (!Number.isInteger(parentId) || parentId <= 0) && currentId) {
        const current = await pool.request()
          .input('id', sql.Int, currentId)
          .query(`SELECT ${config.parentField} AS parent_id FROM dbo.${tableName} WHERE id = @id`);
        parentId = Number(current.recordset[0]?.parent_id);
      }

      const request = pool.request()
        .input('nombre', sql.VarChar(160), nombre);

      let where = 'LOWER(LTRIM(RTRIM(nombre))) = LOWER(LTRIM(RTRIM(@nombre)))';

      if (config.parentField) {
        request.input('parent_id', sql.Int, parentId);
        where += ` AND ${config.parentField} = @parent_id`;
      }

      if (currentId) {
        request.input('current_id', sql.Int, currentId);
        where += ' AND id <> @current_id';
      }

      const result = await request.query(`SELECT TOP 1 id FROM dbo.${tableName} WHERE ${where}`);

      if (result.recordset[0]) {
        return reject(req, res, new AppError(
          `Ya existe ${config.label === 'comida típica' ? 'una' : 'un'} ${config.label} con ese nombre`,
          409,
          'DUPLICATE_RESOURCE',
          [{ field: 'nombre', message: 'El nombre ya está registrado en el mismo ámbito' }]
        ));
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
};
