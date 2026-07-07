import { getConnection, sql } from '../config/database.js';

// Obtener todos los distritos CON PAGINACIÓN
export const getAllDistritos = async (page = 1, limit = 20) => {
  const pool = await getConnection();
  const offset = (page - 1) * limit;
  
  // Obtener total de registros
  const countResult = await pool.request().query('SELECT COUNT(*) as total FROM Distritos');
  const totalItems = countResult.recordset[0].total;
  
  // Obtener datos paginados
  const result = await pool.request()
    .input('limit', sql.Int, limit)
    .input('offset', sql.Int, offset)
    .query(`
      SELECT 
        di.*,
        p.nombre as provincia_nombre,
        d.nombre as departamento_nombre,
        (SELECT COUNT(*) FROM Ciudades WHERE distrito_id = di.id) as total_ciudades
      FROM Distritos di
      INNER JOIN Provincias p ON di.provincia_id = p.id
      INNER JOIN Departamentos d ON p.departamento_id = d.id
      ORDER BY d.nombre, p.nombre, di.nombre
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `);
    
  return {
    data: result.recordset,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems: totalItems,
      itemsPerPage: limit,
      hasNextPage: page < Math.ceil(totalItems / limit),
      hasPrevPage: page > 1
    }
  };
};

// Obtener distritos por provincia CON PAGINACIÓN
export const getDistritosByProvincia = async (provincia_id, page = 1, limit = 20) => {
  const pool = await getConnection();
  const offset = (page - 1) * limit;
  
  // Obtener total de registros
  const countResult = await pool.request()
    .input('provincia_id', sql.Int, provincia_id)
    .query('SELECT COUNT(*) as total FROM Distritos WHERE provincia_id = @provincia_id');
  const totalItems = countResult.recordset[0].total;
  
  // Obtener datos paginados
  const result = await pool.request()
    .input('provincia_id', sql.Int, provincia_id)
    .input('limit', sql.Int, limit)
    .input('offset', sql.Int, offset)
    .query(`
      SELECT 
        di.*,
        (SELECT COUNT(*) FROM Ciudades WHERE distrito_id = di.id) as total_ciudades
      FROM Distritos di
      WHERE di.provincia_id = @provincia_id
      ORDER BY di.nombre
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `);
    
  return {
    data: result.recordset,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems: totalItems,
      itemsPerPage: limit,
      hasNextPage: page < Math.ceil(totalItems / limit),
      hasPrevPage: page > 1
    }
  };
};

// Obtener distrito por ID
export const getDistritoById = async (id) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      SELECT 
        di.*,
        p.nombre as provincia_nombre,
        d.nombre as departamento_nombre,
        (SELECT COUNT(*) FROM Ciudades WHERE distrito_id = di.id) as total_ciudades
      FROM Distritos di
      INNER JOIN Provincias p ON di.provincia_id = p.id
      INNER JOIN Departamentos d ON p.departamento_id = d.id
      WHERE di.id = @id
    `);
  return result.recordset[0];
};

// Crear distrito
export const createDistrito = async (data) => {
  const pool = await getConnection();

  const result = await pool.request()
    .input('nombre', sql.VarChar, data.nombre)
    .input('provincia_id', sql.Int, data.provincia_id)
    .input('area_km2', sql.Decimal(10, 2), data.area_km2)
    .input('poblacion_aprox', sql.Int, data.poblacion_aprox)
    .input('altitud_msnm', sql.Int, data.altitud_msnm)
    .input('tipo_zona', sql.VarChar, data.tipo_zona)
    .input('servicios_basicos', sql.VarChar, data.servicios_basicos)
    .input('nivel_desarrollo', sql.VarChar, data.nivel_desarrollo)
    .input('descripcion', sql.VarChar, data.descripcion)
    .input('imagen_fondo', sql.VarChar, data.imagen_fondo)
    .query(`
      INSERT INTO Distritos (
        nombre,
        provincia_id,
        area_km2,
        poblacion_aprox,
        altitud_msnm,
        tipo_zona,
        servicios_basicos,
        nivel_desarrollo,
        descripcion,
        imagen_fondo
      )
      OUTPUT INSERTED.*
      VALUES (
        @nombre,
        @provincia_id,
        @area_km2,
        @poblacion_aprox,
        @altitud_msnm,
        @tipo_zona,
        @servicios_basicos,
        @nivel_desarrollo,
        @descripcion,
        @imagen_fondo
      )
    `);

  return result.recordset[0];
};

// Actualizar distrito
export const updateDistrito = async (id, data) => {
  const pool = await getConnection();

  const result = await pool.request()
    .input('id', sql.Int, id)
    .input('nombre', sql.VarChar, data.nombre)
    .input('provincia_id', sql.Int, data.provincia_id)
    .input('area_km2', sql.Decimal(10, 2), data.area_km2)
    .input('poblacion_aprox', sql.Int, data.poblacion_aprox)
    .input('altitud_msnm', sql.Int, data.altitud_msnm)
    .input('tipo_zona', sql.VarChar, data.tipo_zona)
    .input('servicios_basicos', sql.VarChar, data.servicios_basicos)
    .input('nivel_desarrollo', sql.VarChar, data.nivel_desarrollo)
    .input('descripcion', sql.VarChar, data.descripcion)
    .input('imagen_fondo', sql.VarChar, data.imagen_fondo)
    .query(`
      UPDATE Distritos 
      SET 
        nombre = @nombre,
        provincia_id = @provincia_id,
        area_km2 = @area_km2,
        poblacion_aprox = @poblacion_aprox,
        altitud_msnm = @altitud_msnm,
        tipo_zona = @tipo_zona,
        servicios_basicos = @servicios_basicos,
        nivel_desarrollo = @nivel_desarrollo,
        descripcion = @descripcion,
        imagen_fondo = @imagen_fondo
      OUTPUT INSERTED.*
      WHERE id = @id
    `);

  return result.recordset[0];
};

// Eliminar distrito
export const deleteDistrito = async (id) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      DELETE FROM Distritos
      OUTPUT DELETED.*
      WHERE id = @id
    `);

  return result.recordset[0];
};