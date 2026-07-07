import { getConnection, sql } from '../config/database.js';

// Obtener todas las ciudades CON PAGINACIÓN
export const getAllCiudades = async (page = 1, limit = 20) => {
    const pool = await getConnection();
    const offset = (page - 1) * limit;

    const countResult = await pool.request()
        .query('SELECT COUNT(*) as total FROM Ciudades');

    const totalItems = countResult.recordset[0].total;

    const result = await pool.request()
        .input('limit', sql.Int, limit)
        .input('offset', sql.Int, offset)
        .query(`
            SELECT 
                c.*,
                di.id AS distrito_id,
                di.nombre AS distrito_nombre,
                p.id AS provincia_id,
                p.nombre AS provincia_nombre,
                d.id AS departamento_id,
                d.nombre AS departamento_nombre
            FROM Ciudades c
            INNER JOIN Distritos di ON c.distrito_id = di.id
            INNER JOIN Provincias p ON di.provincia_id = p.id
            INNER JOIN Departamentos d ON p.departamento_id = d.id
            ORDER BY d.nombre, p.nombre, di.nombre, c.nombre
            OFFSET @offset ROWS
            FETCH NEXT @limit ROWS ONLY
        `);

    return {
        data: result.recordset,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
            totalItems,
            itemsPerPage: limit,
            hasNextPage: page < Math.ceil(totalItems / limit),
            hasPrevPage: page > 1
        }
    };
};

export const getCiudadesByDepartamento = async (departamento_id, page = 1, limit = 100) => {
    const pool = await getConnection();
    const offset = (page - 1) * limit;

    const countResult = await pool.request()
        .input('departamento_id', sql.Int, departamento_id)
        .query(`
            SELECT COUNT(*) AS total
            FROM Ciudades c
            INNER JOIN Distritos di ON c.distrito_id = di.id
            INNER JOIN Provincias p ON di.provincia_id = p.id
            INNER JOIN Departamentos d ON p.departamento_id = d.id
            WHERE d.id = @departamento_id
        `);

    const totalItems = countResult.recordset[0].total;

    const result = await pool.request()
        .input('departamento_id', sql.Int, departamento_id)
        .input('limit', sql.Int, limit)
        .input('offset', sql.Int, offset)
        .query(`
            SELECT 
                c.*,
                di.id AS distrito_id,
                di.nombre AS distrito_nombre,
                p.id AS provincia_id,
                p.nombre AS provincia_nombre,
                d.id AS departamento_id,
                d.nombre AS departamento_nombre
            FROM Ciudades c
            INNER JOIN Distritos di ON c.distrito_id = di.id
            INNER JOIN Provincias p ON di.provincia_id = p.id
            INNER JOIN Departamentos d ON p.departamento_id = d.id
            WHERE d.id = @departamento_id
            ORDER BY p.nombre, di.nombre, c.nombre
            OFFSET @offset ROWS
            FETCH NEXT @limit ROWS ONLY
        `);

    return {
        data: result.recordset,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
            totalItems,
            itemsPerPage: limit,
            hasNextPage: page < Math.ceil(totalItems / limit),
            hasPrevPage: page > 1
        }
    };
};

export const getCiudadesByProvincia = async (provincia_id, page = 1, limit = 100) => {
    const pool = await getConnection();
    const offset = (page - 1) * limit;

    const countResult = await pool.request()
        .input('provincia_id', sql.Int, provincia_id)
        .query(`
            SELECT COUNT(*) AS total
            FROM Ciudades c
            INNER JOIN Distritos di ON c.distrito_id = di.id
            INNER JOIN Provincias p ON di.provincia_id = p.id
            WHERE p.id = @provincia_id
        `);

    const totalItems = countResult.recordset[0].total;

    const result = await pool.request()
        .input('provincia_id', sql.Int, provincia_id)
        .input('limit', sql.Int, limit)
        .input('offset', sql.Int, offset)
        .query(`
            SELECT 
                c.*,
                di.id AS distrito_id,
                di.nombre AS distrito_nombre,
                p.id AS provincia_id,
                p.nombre AS provincia_nombre,
                d.id AS departamento_id,
                d.nombre AS departamento_nombre
            FROM Ciudades c
            INNER JOIN Distritos di ON c.distrito_id = di.id
            INNER JOIN Provincias p ON di.provincia_id = p.id
            INNER JOIN Departamentos d ON p.departamento_id = d.id
            WHERE p.id = @provincia_id
            ORDER BY di.nombre, c.nombre
            OFFSET @offset ROWS
            FETCH NEXT @limit ROWS ONLY
        `);

    return {
        data: result.recordset,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
            totalItems,
            itemsPerPage: limit,
            hasNextPage: page < Math.ceil(totalItems / limit),
            hasPrevPage: page > 1
        }
    };
};

// Obtener ciudades por distrito CON PAGINACIÓN
export const getCiudadesByDistrito = async (distrito_id, page = 1, limit = 100) => {
    const pool = await getConnection();
    const offset = (page - 1) * limit;

    const countResult = await pool.request()
        .input('distrito_id', sql.Int, distrito_id)
        .query('SELECT COUNT(*) AS total FROM Ciudades WHERE distrito_id = @distrito_id');

    const totalItems = countResult.recordset[0].total;

    const result = await pool.request()
        .input('distrito_id', sql.Int, distrito_id)
        .input('limit', sql.Int, limit)
        .input('offset', sql.Int, offset)
        .query(`
            SELECT 
                c.*,
                di.id AS distrito_id,
                di.nombre AS distrito_nombre,
                p.id AS provincia_id,
                p.nombre AS provincia_nombre,
                d.id AS departamento_id,
                d.nombre AS departamento_nombre
            FROM Ciudades c
            INNER JOIN Distritos di ON c.distrito_id = di.id
            INNER JOIN Provincias p ON di.provincia_id = p.id
            INNER JOIN Departamentos d ON p.departamento_id = d.id
            WHERE c.distrito_id = @distrito_id
            ORDER BY c.nombre
            OFFSET @offset ROWS
            FETCH NEXT @limit ROWS ONLY
        `);

    return {
        data: result.recordset,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
            totalItems,
            itemsPerPage: limit,
            hasNextPage: page < Math.ceil(totalItems / limit),
            hasPrevPage: page > 1
        }
    };
};

// Obtener ciudad por ID
export const getCiudadById = async (id) => {
    const pool = await getConnection();

    const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
            SELECT 
                c.*,
                di.id AS distrito_id,
                di.nombre AS distrito_nombre,
                p.id AS provincia_id,
                p.nombre AS provincia_nombre,
                d.id AS departamento_id,
                d.nombre AS departamento_nombre
            FROM Ciudades c
            INNER JOIN Distritos di ON c.distrito_id = di.id
            INNER JOIN Provincias p ON di.provincia_id = p.id
            INNER JOIN Departamentos d ON p.departamento_id = d.id
            WHERE c.id = @id
        `);

    return result.recordset[0];
};

// Crear ciudad
export const createCiudad = async (data) => {
    const pool = await getConnection();

    const result = await pool.request()
        .input('nombre', sql.VarChar, data.nombre)
        .input('distrito_id', sql.Int, data.distrito_id)
        .input('tipo_ciudad', sql.VarChar, data.tipo_ciudad)
        .input('poblacion', sql.Int, data.poblacion)
        .input('latitud', sql.Decimal(10, 8), data.latitud)
        .input('longitud', sql.Decimal(11, 8), data.longitud)
        .input('clima', sql.VarChar, data.clima)
        .input('principal_actividad', sql.VarChar, data.principal_actividad)
        .input('atractivo_turistico', sql.VarChar, data.atractivo_turistico)
        .input('descripcion_cultural', sql.VarChar, data.descripcion_cultural)
        .input('imagen_fondo', sql.VarChar, data.imagen_fondo)
        .query(`
            INSERT INTO Ciudades (
                nombre,
                distrito_id,
                tipo_ciudad,
                poblacion,
                latitud,
                longitud,
                clima,
                principal_actividad,
                atractivo_turistico,
                descripcion_cultural,
                imagen_fondo
            )
            OUTPUT INSERTED.*
            VALUES (
                @nombre,
                @distrito_id,
                @tipo_ciudad,
                @poblacion,
                @latitud,
                @longitud,
                @clima,
                @principal_actividad,
                @atractivo_turistico,
                @descripcion_cultural,
                @imagen_fondo
            )
        `);

    return result.recordset[0];
};

// Actualizar ciudad
export const updateCiudad = async (id, data) => {
    const pool = await getConnection();

    const result = await pool.request()
        .input('id', sql.Int, id)
        .input('nombre', sql.VarChar, data.nombre)
        .input('distrito_id', sql.Int, data.distrito_id)
        .input('tipo_ciudad', sql.VarChar, data.tipo_ciudad)
        .input('poblacion', sql.Int, data.poblacion)
        .input('latitud', sql.Decimal(10, 8), data.latitud)
        .input('longitud', sql.Decimal(11, 8), data.longitud)
        .input('clima', sql.VarChar, data.clima)
        .input('principal_actividad', sql.VarChar, data.principal_actividad)
        .input('atractivo_turistico', sql.VarChar, data.atractivo_turistico)
        .input('descripcion_cultural', sql.VarChar, data.descripcion_cultural)
        .input('imagen_fondo', sql.VarChar, data.imagen_fondo)
        .query(`
            UPDATE Ciudades 
            SET
                nombre = @nombre,
                distrito_id = @distrito_id,
                tipo_ciudad = @tipo_ciudad,
                poblacion = @poblacion,
                latitud = @latitud,
                longitud = @longitud,
                clima = @clima,
                principal_actividad = @principal_actividad,
                atractivo_turistico = @atractivo_turistico,
                descripcion_cultural = @descripcion_cultural,
                imagen_fondo = @imagen_fondo
            OUTPUT INSERTED.*
            WHERE id = @id
        `);

    return result.recordset[0];
};

// Eliminar ciudad
export const deleteCiudad = async (id) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
            DELETE FROM Ciudades
            OUTPUT DELETED.*
            WHERE id = @id
        `);

    return result.recordset[0];
};