import { getConnection, sql } from '../config/database.js';

// Obtener todas las provincias
export const getAllProvincias = async () => {
    const pool = await getConnection();
    const result = await pool.request().query(`
    SELECT p.*,d.nombre as departamento_nombre,
    (SELECT COUNT(*) FROM Distritos WHERE provincia_id = p.id) as numero_distritos
    FROM Provincias p
    INNER JOIN Departamentos d ON p.departamento_id = d.id
    ORDER BY d.nombre, p.nombre`);
    return result.recordset;
};

// Obtener provincias por departamento
export const getProvinciasByDepartamento = async (departamento_id) => {
    const pool = await getConnection();
    const result = await pool.request()
    .input('departamento_id', sql.Int, departamento_id)
    .query(`
    SELECT p.*,(SELECT COUNT(*) FROM Distritos WHERE provincia_id = p.id) as numero_distritos
    FROM Provincias p
    WHERE p.departamento_id = @departamento_id
    ORDER BY p.nombre
    `);
    return result.recordset;
};

// Obtener provincia por ID
export const getProvinciaById = async (id) => {
    const pool = await getConnection();
    const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
    SELECT p.*,d.nombre as departamento_nombre,
    (SELECT COUNT(*) FROM Distritos WHERE provincia_id = p.id) as numero_distritos FROM Provincias p
    INNER JOIN Departamentos d ON p.departamento_id = d.id
    WHERE p.id = @id`);
    return result.recordset[0];
};

// Crear provincia
export const createProvincia = async (data) => {
    const pool = await getConnection();

    const result = await pool.request()
        .input('nombre', sql.VarChar, data.nombre)
        .input('capital', sql.VarChar, data.capital)
        .input('departamento_id', sql.Int, data.departamento_id)
        .input('area_km2', sql.Decimal(10, 2), data.area_km2)
        .input('poblacion_aprox', sql.Int, data.poblacion_aprox)
        .input('actividad_economica_principal', sql.VarChar, data.actividad_economica_principal)
        .input('festividad_representativa', sql.VarChar, data.festividad_representativa)
        .input('descripcion_general', sql.VarChar, data.descripcion_general)
        .input('imagen_fondo', sql.VarChar, data.imagen_fondo)
        .query(`
            INSERT INTO Provincias (
                nombre,
                capital,
                departamento_id,
                area_km2,
                poblacion_aprox,
                actividad_economica_principal,
                festividad_representativa,
                descripcion_general,
                imagen_fondo
            )
            OUTPUT INSERTED.*
            VALUES (
                @nombre,
                @capital,
                @departamento_id,
                @area_km2,
                @poblacion_aprox,
                @actividad_economica_principal,
                @festividad_representativa,
                @descripcion_general,
                @imagen_fondo
            )
        `);

    return result.recordset[0];
};

// Actualizar provincia
export const updateProvincia = async (id, data) => {
    const pool = await getConnection();

    const result = await pool.request()
        .input('id', sql.Int, id)
        .input('nombre', sql.VarChar, data.nombre)
        .input('capital', sql.VarChar, data.capital)
        .input('departamento_id', sql.Int, data.departamento_id)
        .input('area_km2', sql.Decimal(10, 2), data.area_km2)
        .input('poblacion_aprox', sql.Int, data.poblacion_aprox)
        .input('actividad_economica_principal', sql.VarChar, data.actividad_economica_principal)
        .input('festividad_representativa', sql.VarChar, data.festividad_representativa)
        .input('descripcion_general', sql.VarChar, data.descripcion_general)
        .input('imagen_fondo', sql.VarChar, data.imagen_fondo)
        .query(`
            UPDATE Provincias 
            SET 
                nombre = @nombre,
                capital = @capital,
                departamento_id = @departamento_id,
                area_km2 = @area_km2,
                poblacion_aprox = @poblacion_aprox,
                actividad_economica_principal = @actividad_economica_principal,
                festividad_representativa = @festividad_representativa,
                descripcion_general = @descripcion_general,
                imagen_fondo = @imagen_fondo
            OUTPUT INSERTED.*
            WHERE id = @id
        `);

    return result.recordset[0];
};

// Eliminar provincia
export const deleteProvincia = async (id) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query(
            `DELETE FROM Provincias
            OUTPUT DELETED.*
            WHERE id = @id`);

    return result.recordset[0];
};