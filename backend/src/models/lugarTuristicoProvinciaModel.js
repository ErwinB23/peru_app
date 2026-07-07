import { getConnection, sql } from '../config/database.js';

export const getLugaresByProvinciaId = async (provinciaId) => {
    const pool = await getConnection();

    const result = await pool.request()
        .input('provincia_id', sql.Int, provinciaId)
        .query(`
            SELECT *
            FROM LugaresTuristicosProvincias
            WHERE provincia_id = @provincia_id
            ORDER BY fecha_creacion DESC
        `);

    return result.recordset;
};

export const getLugarById = async (id) => {
    const pool = await getConnection();

    const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
            SELECT *
            FROM LugaresTuristicosProvincias
            WHERE id = @id
        `);

    return result.recordset[0];
};

export const createLugar = async (data) => {
    const pool = await getConnection();

    const result = await pool.request()
        .input('provincia_id', sql.Int, data.provincia_id)
        .input('nombre', sql.VarChar, data.nombre)
        .input('descripcion', sql.VarChar(sql.MAX), data.descripcion)
        .input('imagen', sql.VarChar, data.imagen)
        .input('ubicacion_referencial', sql.VarChar, data.ubicacion_referencial)
        .query(`
            INSERT INTO LugaresTuristicosProvincias (
                provincia_id,
                nombre,
                descripcion,
                imagen,
                ubicacion_referencial
            )
            OUTPUT INSERTED.*
            VALUES (
                @provincia_id,
                @nombre,
                @descripcion,
                @imagen,
                @ubicacion_referencial
            )
        `);

    return result.recordset[0];
};

export const updateLugar = async (id, data) => {
    const pool = await getConnection();

    const result = await pool.request()
        .input('id', sql.Int, id)
        .input('nombre', sql.VarChar, data.nombre)
        .input('descripcion', sql.VarChar(sql.MAX), data.descripcion)
        .input('imagen', sql.VarChar, data.imagen)
        .input('ubicacion_referencial', sql.VarChar, data.ubicacion_referencial)
        .query(`
            UPDATE LugaresTuristicosProvincias
            SET
                nombre = @nombre,
                descripcion = @descripcion,
                imagen = @imagen,
                ubicacion_referencial = @ubicacion_referencial
            OUTPUT INSERTED.*
            WHERE id = @id
        `);

    return result.recordset[0];
};

export const deleteLugar = async (id) => {
    const pool = await getConnection();

    const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
            DELETE FROM LugaresTuristicosProvincias
            OUTPUT DELETED.*
            WHERE id = @id
        `);

    return result.recordset[0];
};