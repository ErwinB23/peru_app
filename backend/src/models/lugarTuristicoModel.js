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
            SELECT 
                lt.*,
                d.nombre AS departamento_nombre
            FROM LugaresTuristicos lt
            LEFT JOIN Departamentos d ON d.id = lt.departamento_id
            WHERE lt.id = @id
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
        .input("acerca", sql.VarChar(sql.MAX), data.acerca || null)
        .input("recomendaciones_antes", sql.VarChar(sql.MAX), data.recomendaciones_antes || null)
        .input("recomendaciones_durante", sql.VarChar(sql.MAX), data.recomendaciones_durante || null)
        .input("clima", sql.VarChar, data.clima || null)
        .input("altura", sql.VarChar, data.altura || null)
        .input("provincia", sql.VarChar, data.provincia || null)
        .input("distrito", sql.VarChar, data.distrito || null)
        .input("origen_nombre", sql.VarChar, data.origen_nombre || null)
        .input("latitud_origen", sql.Decimal(10, 7), data.latitud_origen || null)
        .input("longitud_origen", sql.Decimal(10, 7), data.longitud_origen || null)
        .input("latitud_destino", sql.Decimal(10, 7), data.latitud_destino || null)
        .input("longitud_destino", sql.Decimal(10, 7), data.longitud_destino || null)
        .input("imagen_2", sql.VarChar, data.imagen_2 || null)
        .input("imagen_3", sql.VarChar, data.imagen_3 || null)
        .input("imagen_4", sql.VarChar, data.imagen_4 || null)
        .input("origen_busqueda", sql.VarChar, data.origen_busqueda || null)
        .input("destino_nombre", sql.VarChar, data.destino_nombre || null)
        .input("destino_busqueda", sql.VarChar, data.destino_busqueda || null)
        .query(`
            INSERT INTO LugaresTuristicos (
                departamento_id,
                nombre,
                descripcion,
                imagen,
                ubicacion_referencial,
                acerca,
                recomendaciones_antes,
                recomendaciones_durante,
                clima,
                altura,
                provincia,
                distrito,
                origen_nombre,
                latitud_origen,
                longitud_origen,
                latitud_destino,
                longitud_destino,
                imagen_2,
                imagen_3,
                imagen_4,
                origen_busqueda,
                destino_nombre,
                destino_busqueda
            )
            OUTPUT INSERTED.*
            VALUES (
                @departamento_id,
                @nombre,
                @descripcion,
                @imagen,
                @ubicacion_referencial,
                @acerca,
                @recomendaciones_antes,
                @recomendaciones_durante,
                @clima,
                @altura,
                @provincia,
                @distrito,
                @origen_nombre,
                @latitud_origen,
                @longitud_origen,
                @latitud_destino,
                @longitud_destino,
                @imagen_2,
                @imagen_3,
                @imagen_4,
                @origen_busqueda,
                @destino_nombre,
                @destino_busqueda
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
        .input("acerca", sql.VarChar(sql.MAX), data.acerca || null)
        .input("recomendaciones_antes", sql.VarChar(sql.MAX), data.recomendaciones_antes || null)
        .input("recomendaciones_durante", sql.VarChar(sql.MAX), data.recomendaciones_durante || null)
        .input("clima", sql.VarChar, data.clima || null)
        .input("altura", sql.VarChar, data.altura || null)
        .input("provincia", sql.VarChar, data.provincia || null)
        .input("distrito", sql.VarChar, data.distrito || null)
        .input("origen_nombre", sql.VarChar, data.origen_nombre || null)
        .input("latitud_origen", sql.Decimal(10, 7), data.latitud_origen || null)
        .input("longitud_origen", sql.Decimal(10, 7), data.longitud_origen || null)
        .input("latitud_destino", sql.Decimal(10, 7), data.latitud_destino || null)
        .input("longitud_destino", sql.Decimal(10, 7), data.longitud_destino || null)
        .input("imagen_2", sql.VarChar, data.imagen_2 || null)
        .input("imagen_3", sql.VarChar, data.imagen_3 || null)
        .input("imagen_4", sql.VarChar, data.imagen_4 || null)
        .input("origen_busqueda", sql.VarChar, data.origen_busqueda || null)
        .input("destino_nombre", sql.VarChar, data.destino_nombre || null)
        .input("destino_busqueda", sql.VarChar, data.destino_busqueda || null)
        .query(`
            UPDATE LugaresTuristicos
            SET
                nombre = @nombre,
                descripcion = @descripcion,
                imagen = @imagen,
                ubicacion_referencial = @ubicacion_referencial,
                acerca = @acerca,
                recomendaciones_antes = @recomendaciones_antes,
                recomendaciones_durante = @recomendaciones_durante,
                clima = @clima,
                altura = @altura,
                provincia = @provincia,
                distrito = @distrito,
                origen_nombre = @origen_nombre,
                latitud_origen = @latitud_origen,
                longitud_origen = @longitud_origen,
                latitud_destino = @latitud_destino,
                longitud_destino = @longitud_destino,
                imagen_2 = @imagen_2,
                imagen_3 = @imagen_3,
                imagen_4 = @imagen_4,
                origen_busqueda = @origen_busqueda,
                destino_nombre = @destino_nombre,
                destino_busqueda = @destino_busqueda
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