import { getConnection, sql } from '../config/database.js';

export const getComidasByProvinciaId = async (provinciaId) => {
    const pool = await getConnection();

    const result = await pool.request()
        .input('provincia_id', sql.Int, provinciaId)
        .query(`
            SELECT *
            FROM ComidasTipicasProvincias
            WHERE provincia_id = @provincia_id
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
            FROM ComidasTipicasProvincias
            WHERE id = @id
        `);

    return result.recordset[0];
};

export const createComida = async (data) => {
    const pool = await getConnection();

    const result = await pool.request()
        .input('provincia_id', sql.Int, data.provincia_id)
        .input('nombre', sql.VarChar, data.nombre)
        .input('descripcion', sql.VarChar(sql.MAX), data.descripcion)
        .input('imagen', sql.VarChar, data.imagen)
        .input('origen_descripcion', sql.VarChar, data.origen_descripcion)
        .query(`
            INSERT INTO ComidasTipicasProvincias (
                provincia_id,
                nombre,
                descripcion,
                imagen,
                origen_descripcion
            )
            OUTPUT INSERTED.*
            VALUES (
                @provincia_id,
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
            UPDATE ComidasTipicasProvincias
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
            DELETE FROM ComidasTipicasProvincias
            OUTPUT DELETED.*
            WHERE id = @id
        `);

    return result.recordset[0];
};