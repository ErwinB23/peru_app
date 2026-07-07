import { getConnection, sql } from '../config/database.js';

export const getComidasByCiudadId = async (ciudadId) => {
    const pool = await getConnection();

    const result = await pool.request()
        .input('ciudad_id', sql.Int, ciudadId)
        .query(`
            SELECT *
            FROM ComidasTipicasCiudades
            WHERE ciudad_id = @ciudad_id
            ORDER BY fecha_creacion DESC
        `);

    return result.recordset;
};

export const getComidaById = async (id) => {
    const pool = await getConnection();

    const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
            SELECT *
            FROM ComidasTipicasCiudades
            WHERE id = @id
        `);

    return result.recordset[0];
};

export const createComida = async (data) => {
    const pool = await getConnection();

    const result = await pool.request()
        .input('ciudad_id', sql.Int, data.ciudad_id)
        .input('nombre', sql.VarChar, data.nombre)
        .input('descripcion', sql.VarChar(sql.MAX), data.descripcion)
        .input('imagen', sql.VarChar, data.imagen)
        .input('origen_descripcion', sql.VarChar, data.origen_descripcion)
        .query(`
            INSERT INTO ComidasTipicasCiudades (
                ciudad_id,
                nombre,
                descripcion,
                imagen,
                origen_descripcion
            )
            OUTPUT INSERTED.*
            VALUES (
                @ciudad_id,
                @nombre,
                @descripcion,
                @imagen,
                @origen_descripcion
            )
        `);

    return result.recordset[0];
};

export const updateComida = async (id, data) => {
    const pool = await getConnection();

    const result = await pool.request()
        .input('id', sql.Int, id)
        .input('nombre', sql.VarChar, data.nombre)
        .input('descripcion', sql.VarChar(sql.MAX), data.descripcion)
        .input('imagen', sql.VarChar, data.imagen)
        .input('origen_descripcion', sql.VarChar, data.origen_descripcion)
        .query(`
            UPDATE ComidasTipicasCiudades
            SET
                nombre = @nombre,
                descripcion = @descripcion,
                imagen = @imagen,
                origen_descripcion = @origen_descripcion
            OUTPUT INSERTED.*
            WHERE id = @id
        `);

    return result.recordset[0];
};

export const deleteComida = async (id) => {
    const pool = await getConnection();

    const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
            DELETE FROM ComidasTipicasCiudades
            OUTPUT DELETED.*
            WHERE id = @id
        `);

    return result.recordset[0];
};