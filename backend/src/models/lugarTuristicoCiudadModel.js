import { getConnection, sql } from '../config/database.js';

export const getLugaresByCiudadId = async (ciudadId) => {
    const pool = await getConnection();

    const result = await pool.request()
        .input('ciudad_id', sql.Int, ciudadId)
        .query(`
            SELECT *
            FROM LugaresTuristicosCiudades
            WHERE ciudad_id = @ciudad_id
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
            FROM LugaresTuristicosCiudades
            WHERE id = @id
        `);

    return result.recordset[0];
};

export const createLugar = async (data) => {
    const pool = await getConnection();

    const result = await pool.request()
        .input('ciudad_id', sql.Int, data.ciudad_id)
        .input('nombre', sql.VarChar, data.nombre)
        .input('descripcion', sql.VarChar(sql.MAX), data.descripcion)
        .input('imagen', sql.VarChar, data.imagen)
        .input('ubicacion_referencial', sql.VarChar, data.ubicacion_referencial)
        .query(`
            INSERT INTO LugaresTuristicosCiudades (
                ciudad_id,
                nombre,
                descripcion,
                imagen,
                ubicacion_referencial
            )
            OUTPUT INSERTED.*
            VALUES (
                @ciudad_id,
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
            UPDATE LugaresTuristicosCiudades
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
            DELETE FROM LugaresTuristicosCiudades
            OUTPUT DELETED.*
            WHERE id = @id
        `);

    return result.recordset[0];
};