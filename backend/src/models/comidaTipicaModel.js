import { getConnection, sql } from "../config/database.js";

export const getComidasByDepartamentoId = async (departamentoId) => {
    const pool = await getConnection();

    const result = await pool
        .request()
        .input("departamento_id", sql.Int, departamentoId).query(`
            SELECT *
            FROM ComidasTipicas
            WHERE departamento_id = @departamento_id
            ORDER BY fecha_creacion DESC
        `);

    return result.recordset;
};

export const getComidaById = async (id) => {
    const pool = await getConnection();

    const result = await pool.request().input("id", sql.Int, id).query(`
            SELECT *
            FROM ComidasTipicas
            WHERE id = @id
        `);

    return result.recordset[0];
};

export const createComidaTipica = async (data) => {
    const pool = await getConnection();

    const result = await pool
        .request()
        .input("departamento_id", sql.Int, data.departamento_id)
        .input("nombre", sql.VarChar, data.nombre)
        .input("descripcion", sql.VarChar(sql.MAX), data.descripcion)
        .input("imagen", sql.VarChar, data.imagen)
        .input("origen_descripcion", sql.VarChar, data.origen_descripcion).query(`
            INSERT INTO ComidasTipicas (
                departamento_id,
                nombre,
                descripcion,
                imagen,
                origen_descripcion
            )
            OUTPUT INSERTED.*
            VALUES (
                @departamento_id,
                @nombre,
                @descripcion,
                @imagen,
                @origen_descripcion
            )
        `);

    return result.recordset[0];
};

export const updateComidaTipica = async (id, data) => {
    const pool = await getConnection();

    const result = await pool
        .request()
        .input("id", sql.Int, id)
        .input("nombre", sql.VarChar, data.nombre)
        .input("descripcion", sql.VarChar(sql.MAX), data.descripcion)
        .input("imagen", sql.VarChar, data.imagen)
        .input("origen_descripcion", sql.VarChar, data.origen_descripcion).query(`
            UPDATE ComidasTipicas
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

export const deleteComidaTipica = async (id) => {
    const pool = await getConnection();

    const result = await pool.request().input("id", sql.Int, id).query(`
            DELETE FROM ComidasTipicas
            OUTPUT DELETED.*
            WHERE id = @id
        `);

    return result.recordset[0];
};
