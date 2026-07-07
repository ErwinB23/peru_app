import { getConnection, sql } from "../config/database.js";

export const getLugaresByDepartamentoId = async (departamentoId) => {
    const pool = await getConnection();

    const result = await pool
        .request()
        .input("departamento_id", sql.Int, departamentoId).query(`
            SELECT *
            FROM LugaresTuristicos
            WHERE departamento_id = @departamento_id
            ORDER BY fecha_creacion DESC
        `);

    return result.recordset;
};

export const getLugarById = async (id) => {
    const pool = await getConnection();

    const result = await pool.request().input("id", sql.Int, id).query(`
            SELECT *
            FROM LugaresTuristicos
            WHERE id = @id
        `);

    return result.recordset[0];
};

export const createLugarTuristico = async (data) => {
    const pool = await getConnection();

    const result = await pool
        .request()
        .input("departamento_id", sql.Int, data.departamento_id)
        .input("nombre", sql.VarChar, data.nombre)
        .input("descripcion", sql.VarChar(sql.MAX), data.descripcion)
        .input("imagen", sql.VarChar, data.imagen)
        .input("ubicacion_referencial", sql.VarChar, data.ubicacion_referencial)
        .query(`
            INSERT INTO LugaresTuristicos (
                departamento_id,
                nombre,
                descripcion,
                imagen,
                ubicacion_referencial
            )
            OUTPUT INSERTED.*
            VALUES (
                @departamento_id,
                @nombre,
                @descripcion,
                @imagen,
                @ubicacion_referencial
            )
        `);

    return result.recordset[0];
};

export const updateLugarTuristico = async (id, data) => {
    const pool = await getConnection();

    const result = await pool
        .request()
        .input("id", sql.Int, id)
        .input("nombre", sql.VarChar, data.nombre)
        .input("descripcion", sql.VarChar(sql.MAX), data.descripcion)
        .input("imagen", sql.VarChar, data.imagen)
        .input("ubicacion_referencial", sql.VarChar, data.ubicacion_referencial)
        .query(`
            UPDATE LugaresTuristicos
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

export const deleteLugarTuristico = async (id) => {
    const pool = await getConnection();

    const result = await pool.request().input("id", sql.Int, id).query(`
            DELETE FROM LugaresTuristicos
            OUTPUT DELETED.*
            WHERE id = @id
        `);

    return result.recordset[0];
};
