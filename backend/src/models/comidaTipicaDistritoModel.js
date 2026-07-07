import { getConnection, sql } from '../config/database.js';

export const getComidasByDistritoId = async (distritoId) => {
    const pool = await getConnection();

    const result = await pool.request()
        .input('distrito_id', sql.Int, distritoId)
        .query(`
            SELECT *
            FROM ComidasTipicasDistritos
            WHERE distrito_id = @distrito_id
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
            FROM ComidasTipicasDistritos
            WHERE id = @id
        `);

    return result.recordset[0];
};

export const createComida = async (data) => {
    const pool = await getConnection();

    const result = await pool.request()
        .input('distrito_id', sql.Int, data.distrito_id)
        .input('nombre', sql.VarChar, data.nombre)
        .input('descripcion', sql.VarChar(sql.MAX), data.descripcion)
        .input('imagen', sql.VarChar, data.imagen)
        .input('origen_descripcion', sql.VarChar, data.origen_descripcion)
        .query(`
            INSERT INTO ComidasTipicasDistritos (
                distrito_id,
                nombre,
                descripcion,
                imagen,
                origen_descripcion
            )
            OUTPUT INSERTED.*
            VALUES (
                @distrito_id,
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
            UPDATE ComidasTipicasDistritos
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
            DELETE FROM ComidasTipicasDistritos
            OUTPUT DELETED.*
            WHERE id = @id
        `);

    return result.recordset[0];
};