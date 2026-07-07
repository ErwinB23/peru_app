import { getConnection, sql } from '../config/database.js';



// Obtener todos los departamentos
export const getAllDepartamentos = async () => {
    const pool = await getConnection();
    const result = await pool.request().query(`
    SELECT d.*,(SELECT COUNT(*) FROM Provincias WHERE departamento_id = d.id) as total_provincias,
    CAST(poblacion_aprox AS FLOAT) / NULLIF(area_km2, 0) as densidad_poblacional
    FROM Departamentos d
    ORDER BY nombre`);
    return result.recordset;
};

// Obtener departamento por ID
export const getDepartamentoById = async (id) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
    SELECT d.*,(SELECT COUNT(*) FROM Provincias WHERE departamento_id = d.id) as total_provincias,
    CAST(poblacion_aprox AS FLOAT) / NULLIF(area_km2, 0) as densidad_poblacional FROM Departamentos d
    WHERE d.id = @id`);
    return result.recordset[0];
};

// Crear departamento
export const createDepartamento = async (data) => {
    const pool = await getConnection();

    const result = await pool
        .request()
        .input("nombre", sql.VarChar, data.nombre)
        .input("capital", sql.VarChar, data.capital)
        .input("region_natural", sql.VarChar, data.region_natural)
        .input("area_km2", sql.Decimal(10, 2), data.area_km2)
        .input("poblacion_aprox", sql.Int, data.poblacion_aprox)
        .input("clima_predominante", sql.VarChar, data.clima_predominante)
        .input("principales_actividades", sql.VarChar, data.principales_actividades)
        .input(
            "atractivo_turistico_principal",
            sql.VarChar,
            data.atractivo_turistico_principal,
        )
        .input("descripcion", sql.VarChar, data.descripcion)
        .input("imagen_fondo", sql.VarChar, data.imagen_fondo).query(`
            INSERT INTO Departamentos (
                nombre,
                capital,
                region_natural,
                area_km2,
                poblacion_aprox,
                clima_predominante,
                principales_actividades,
                atractivo_turistico_principal,
                descripcion,
                imagen_fondo
            )
            OUTPUT INSERTED.*
            VALUES (
                @nombre,
                @capital,
                @region_natural,
                @area_km2,
                @poblacion_aprox,
                @clima_predominante,
                @principales_actividades,
                @atractivo_turistico_principal,
                @descripcion,
                @imagen_fondo
            )
        `);

    return result.recordset[0];
};

// Actualizar departamento
export const updateDepartamento = async (id, data) => {
    const pool = await getConnection();

    const result = await pool
        .request()
        .input("id", sql.Int, id)
        .input("nombre", sql.VarChar, data.nombre)
        .input("capital", sql.VarChar, data.capital)
        .input("region_natural", sql.VarChar, data.region_natural)
        .input("area_km2", sql.Decimal(10, 2), data.area_km2)
        .input("poblacion_aprox", sql.Int, data.poblacion_aprox)
        .input("clima_predominante", sql.VarChar, data.clima_predominante)
        .input("principales_actividades", sql.VarChar, data.principales_actividades)
        .input(
            "atractivo_turistico_principal",
            sql.VarChar,
            data.atractivo_turistico_principal,
        )
        .input("descripcion", sql.VarChar, data.descripcion)
        .input("imagen_fondo", sql.VarChar, data.imagen_fondo).query(`
            UPDATE Departamentos
            SET
                nombre = @nombre,
                capital = @capital,
                region_natural = @region_natural,
                area_km2 = @area_km2,
                poblacion_aprox = @poblacion_aprox,
                clima_predominante = @clima_predominante,
                principales_actividades = @principales_actividades,
                atractivo_turistico_principal = @atractivo_turistico_principal,
                descripcion = @descripcion,
                imagen_fondo = @imagen_fondo
            OUTPUT INSERTED.*
            WHERE id = @id`);

    return result.recordset[0];
};

// Eliminar departamento
export const deleteDepartamento = async (id) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query(
            `DELETE FROM Departamentos
            OUTPUT DELETED.*
            WHERE id = @id`);

    return result.recordset[0];
};