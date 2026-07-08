/*
    ================================================================
    SCRIPT DE BASE DE DATOS - PERU APP
    Proyecto: PERU APP - Plataforma web turístico-educativa
    Motor: SQL Server
    Base de datos usada por el backend: PeruDepartamentosDB
    Autor: Erwin Brayam Inca Pauccara
    Año: 2026
    ================================================================

    Objetivo:
    Crear la estructura completa de base de datos utilizada por el
    backend Node.js/Express del proyecto PERU APP.

    Tablas incluidas:
    - Usuarios
    - Departamentos
    - Provincias
    - Distritos
    - Ciudades
    - LugaresTuristicos
    - ComidasTipicas
    - LugaresTuristicosProvincias
    - ComidasTipicasProvincias
    - LugaresTuristicosDistritos
    - ComidasTipicasDistritos
    - LugaresTuristicosCiudades
    - ComidasTipicasCiudades

    Nota importante:
    Este script crea la estructura. Para crear un administrador de forma
    segura, primero registra un usuario desde la aplicación y luego ejecuta:

        UPDATE Usuarios
        SET rol = 'admin'
        WHERE email = 'correo_del_usuario_registrado@gmail.com';

    De esta manera la contraseña queda cifrada por el backend con bcrypt.
*/

USE master;
GO

IF DB_ID('PeruDepartamentosDB') IS NULL
BEGIN
    CREATE DATABASE PeruDepartamentosDB;
END;
GO

USE PeruDepartamentosDB;
GO

/* ================================================================
   1. TABLA: Usuarios
   ================================================================ */
IF OBJECT_ID('dbo.Usuarios', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Usuarios (
        id INT IDENTITY(1,1) NOT NULL,
        nombres VARCHAR(100) NOT NULL,
        apellidos VARCHAR(100) NOT NULL,
        fecha_nacimiento DATE NOT NULL,
        email VARCHAR(150) NOT NULL,
        password VARCHAR(255) NOT NULL,
        rol VARCHAR(20) NOT NULL CONSTRAINT DF_Usuarios_rol DEFAULT ('usuario'),
        fecha_registro DATETIME NOT NULL CONSTRAINT DF_Usuarios_fecha_registro DEFAULT (GETDATE()),

        CONSTRAINT PK_Usuarios PRIMARY KEY (id),
        CONSTRAINT UQ_Usuarios_email UNIQUE (email),
        CONSTRAINT CK_Usuarios_rol CHECK (rol IN ('usuario', 'admin'))
    );
END;
GO

/* ================================================================
   2. TABLA: Departamentos
   ================================================================ */
IF OBJECT_ID('dbo.Departamentos', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Departamentos (
        id INT IDENTITY(1,1) NOT NULL,
        nombre VARCHAR(120) NOT NULL,
        capital VARCHAR(120) NULL,
        region_natural VARCHAR(100) NULL,
        area_km2 DECIMAL(10,2) NULL,
        poblacion_aprox INT NULL,
        clima_predominante VARCHAR(180) NULL,
        principales_actividades VARCHAR(255) NULL,
        atractivo_turistico_principal VARCHAR(255) NULL,
        descripcion VARCHAR(MAX) NULL,
        imagen_fondo VARCHAR(255) NULL,
        introduccion VARCHAR(MAX) NULL,
        fecha_creacion DATETIME NOT NULL CONSTRAINT DF_Departamentos_fecha_creacion DEFAULT (GETDATE()),

        CONSTRAINT PK_Departamentos PRIMARY KEY (id),
        CONSTRAINT UQ_Departamentos_nombre UNIQUE (nombre)
    );
END;
GO

/* ================================================================
   3. TABLA: Provincias
   ================================================================ */
IF OBJECT_ID('dbo.Provincias', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Provincias (
        id INT IDENTITY(1,1) NOT NULL,
        nombre VARCHAR(120) NOT NULL,
        capital VARCHAR(120) NULL,
        departamento_id INT NOT NULL,
        area_km2 DECIMAL(10,2) NULL,
        poblacion_aprox INT NULL,
        actividad_economica_principal VARCHAR(255) NULL,
        festividad_representativa VARCHAR(255) NULL,
        descripcion_general VARCHAR(MAX) NULL,
        imagen_fondo VARCHAR(255) NULL,
        fecha_creacion DATETIME NOT NULL CONSTRAINT DF_Provincias_fecha_creacion DEFAULT (GETDATE()),

        CONSTRAINT PK_Provincias PRIMARY KEY (id),
        CONSTRAINT FK_Provincias_Departamentos FOREIGN KEY (departamento_id)
            REFERENCES dbo.Departamentos(id),
        CONSTRAINT UQ_Provincias_departamento_nombre UNIQUE (departamento_id, nombre)
    );
END;
GO

/* ================================================================
   4. TABLA: Distritos
   ================================================================ */
IF OBJECT_ID('dbo.Distritos', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Distritos (
        id INT IDENTITY(1,1) NOT NULL,
        nombre VARCHAR(120) NOT NULL,
        provincia_id INT NOT NULL,
        area_km2 DECIMAL(10,2) NULL,
        poblacion_aprox INT NULL,
        altitud_msnm INT NULL,
        tipo_zona VARCHAR(120) NULL,
        servicios_basicos VARCHAR(255) NULL,
        nivel_desarrollo VARCHAR(120) NULL,
        descripcion VARCHAR(MAX) NULL,
        imagen_fondo VARCHAR(255) NULL,
        fecha_creacion DATETIME NOT NULL CONSTRAINT DF_Distritos_fecha_creacion DEFAULT (GETDATE()),

        CONSTRAINT PK_Distritos PRIMARY KEY (id),
        CONSTRAINT FK_Distritos_Provincias FOREIGN KEY (provincia_id)
            REFERENCES dbo.Provincias(id),
        CONSTRAINT UQ_Distritos_provincia_nombre UNIQUE (provincia_id, nombre)
    );
END;
GO

/* ================================================================
   5. TABLA: Ciudades
   La aplicación actual asocia ciudades a distritos.
   ================================================================ */
IF OBJECT_ID('dbo.Ciudades', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Ciudades (
        id INT IDENTITY(1,1) NOT NULL,
        nombre VARCHAR(120) NOT NULL,
        distrito_id INT NOT NULL,
        tipo_ciudad VARCHAR(120) NULL,
        poblacion INT NULL,
        latitud DECIMAL(10,8) NULL,
        longitud DECIMAL(11,8) NULL,
        clima VARCHAR(150) NULL,
        principal_actividad VARCHAR(255) NULL,
        atractivo_turistico VARCHAR(255) NULL,
        descripcion_cultural VARCHAR(MAX) NULL,
        imagen_fondo VARCHAR(255) NULL,
        fecha_creacion DATETIME NOT NULL CONSTRAINT DF_Ciudades_fecha_creacion DEFAULT (GETDATE()),

        CONSTRAINT PK_Ciudades PRIMARY KEY (id),
        CONSTRAINT FK_Ciudades_Distritos FOREIGN KEY (distrito_id)
            REFERENCES dbo.Distritos(id),
        CONSTRAINT UQ_Ciudades_distrito_nombre UNIQUE (distrito_id, nombre)
    );
END;
GO

/* ================================================================
   6. TABLA: LugaresTuristicos
   Lugares turísticos asociados a departamentos.
   ================================================================ */
IF OBJECT_ID('dbo.LugaresTuristicos', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.LugaresTuristicos (
        id INT IDENTITY(1,1) NOT NULL,
        departamento_id INT NOT NULL,
        nombre VARCHAR(160) NOT NULL,
        descripcion VARCHAR(MAX) NULL,
        imagen VARCHAR(255) NULL,
        ubicacion_referencial VARCHAR(255) NULL,
        acerca VARCHAR(MAX) NULL,
        recomendaciones_antes VARCHAR(MAX) NULL,
        recomendaciones_durante VARCHAR(MAX) NULL,
        clima VARCHAR(120) NULL,
        altura VARCHAR(120) NULL,
        provincia VARCHAR(120) NULL,
        distrito VARCHAR(120) NULL,
        origen_nombre VARCHAR(160) NULL,
        latitud_origen DECIMAL(10,7) NULL,
        longitud_origen DECIMAL(10,7) NULL,
        latitud_destino DECIMAL(10,7) NULL,
        longitud_destino DECIMAL(10,7) NULL,
        imagen_2 VARCHAR(255) NULL,
        imagen_3 VARCHAR(255) NULL,
        imagen_4 VARCHAR(255) NULL,
        origen_busqueda VARCHAR(255) NULL,
        destino_nombre VARCHAR(180) NULL,
        destino_busqueda VARCHAR(255) NULL,
        fecha_creacion DATETIME NOT NULL CONSTRAINT DF_LugaresTuristicos_fecha_creacion DEFAULT (GETDATE()),

        CONSTRAINT PK_LugaresTuristicos PRIMARY KEY (id),
        CONSTRAINT FK_LugaresTuristicos_Departamentos FOREIGN KEY (departamento_id)
            REFERENCES dbo.Departamentos(id)
    );
END;
GO

/* ================================================================
   7. TABLA: ComidasTipicas
   Comidas típicas asociadas a departamentos.
   ================================================================ */
IF OBJECT_ID('dbo.ComidasTipicas', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.ComidasTipicas (
        id INT IDENTITY(1,1) NOT NULL,
        departamento_id INT NOT NULL,
        nombre VARCHAR(160) NOT NULL,
        descripcion VARCHAR(MAX) NULL,
        imagen VARCHAR(255) NULL,
        origen_descripcion VARCHAR(MAX) NULL,
        fecha_creacion DATETIME NOT NULL CONSTRAINT DF_ComidasTipicas_fecha_creacion DEFAULT (GETDATE()),

        CONSTRAINT PK_ComidasTipicas PRIMARY KEY (id),
        CONSTRAINT FK_ComidasTipicas_Departamentos FOREIGN KEY (departamento_id)
            REFERENCES dbo.Departamentos(id)
    );
END;
GO

/* ================================================================
   8. TABLA: LugaresTuristicosProvincias
   ================================================================ */
IF OBJECT_ID('dbo.LugaresTuristicosProvincias', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.LugaresTuristicosProvincias (
        id INT IDENTITY(1,1) NOT NULL,
        provincia_id INT NOT NULL,
        nombre VARCHAR(160) NOT NULL,
        descripcion VARCHAR(MAX) NULL,
        imagen VARCHAR(255) NULL,
        ubicacion_referencial VARCHAR(255) NULL,
        fecha_creacion DATETIME NOT NULL CONSTRAINT DF_LugaresTuristicosProvincias_fecha_creacion DEFAULT (GETDATE()),

        CONSTRAINT PK_LugaresTuristicosProvincias PRIMARY KEY (id),
        CONSTRAINT FK_LugaresTuristicosProvincias_Provincias FOREIGN KEY (provincia_id)
            REFERENCES dbo.Provincias(id)
    );
END;
GO

/* ================================================================
   9. TABLA: ComidasTipicasProvincias
   ================================================================ */
IF OBJECT_ID('dbo.ComidasTipicasProvincias', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.ComidasTipicasProvincias (
        id INT IDENTITY(1,1) NOT NULL,
        provincia_id INT NOT NULL,
        nombre VARCHAR(160) NOT NULL,
        descripcion VARCHAR(MAX) NULL,
        imagen VARCHAR(255) NULL,
        origen_descripcion VARCHAR(MAX) NULL,
        fecha_creacion DATETIME NOT NULL CONSTRAINT DF_ComidasTipicasProvincias_fecha_creacion DEFAULT (GETDATE()),

        CONSTRAINT PK_ComidasTipicasProvincias PRIMARY KEY (id),
        CONSTRAINT FK_ComidasTipicasProvincias_Provincias FOREIGN KEY (provincia_id)
            REFERENCES dbo.Provincias(id)
    );
END;
GO

/* ================================================================
   10. TABLA: LugaresTuristicosDistritos
   ================================================================ */
IF OBJECT_ID('dbo.LugaresTuristicosDistritos', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.LugaresTuristicosDistritos (
        id INT IDENTITY(1,1) NOT NULL,
        distrito_id INT NOT NULL,
        nombre VARCHAR(160) NOT NULL,
        descripcion VARCHAR(MAX) NULL,
        imagen VARCHAR(255) NULL,
        ubicacion_referencial VARCHAR(255) NULL,
        fecha_creacion DATETIME NOT NULL CONSTRAINT DF_LugaresTuristicosDistritos_fecha_creacion DEFAULT (GETDATE()),

        CONSTRAINT PK_LugaresTuristicosDistritos PRIMARY KEY (id),
        CONSTRAINT FK_LugaresTuristicosDistritos_Distritos FOREIGN KEY (distrito_id)
            REFERENCES dbo.Distritos(id)
    );
END;
GO

/* ================================================================
   11. TABLA: ComidasTipicasDistritos
   ================================================================ */
IF OBJECT_ID('dbo.ComidasTipicasDistritos', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.ComidasTipicasDistritos (
        id INT IDENTITY(1,1) NOT NULL,
        distrito_id INT NOT NULL,
        nombre VARCHAR(160) NOT NULL,
        descripcion VARCHAR(MAX) NULL,
        imagen VARCHAR(255) NULL,
        origen_descripcion VARCHAR(MAX) NULL,
        fecha_creacion DATETIME NOT NULL CONSTRAINT DF_ComidasTipicasDistritos_fecha_creacion DEFAULT (GETDATE()),

        CONSTRAINT PK_ComidasTipicasDistritos PRIMARY KEY (id),
        CONSTRAINT FK_ComidasTipicasDistritos_Distritos FOREIGN KEY (distrito_id)
            REFERENCES dbo.Distritos(id)
    );
END;
GO

/* ================================================================
   12. TABLA: LugaresTuristicosCiudades
   ================================================================ */
IF OBJECT_ID('dbo.LugaresTuristicosCiudades', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.LugaresTuristicosCiudades (
        id INT IDENTITY(1,1) NOT NULL,
        ciudad_id INT NOT NULL,
        nombre VARCHAR(160) NOT NULL,
        descripcion VARCHAR(MAX) NULL,
        imagen VARCHAR(255) NULL,
        ubicacion_referencial VARCHAR(255) NULL,
        fecha_creacion DATETIME NOT NULL CONSTRAINT DF_LugaresTuristicosCiudades_fecha_creacion DEFAULT (GETDATE()),

        CONSTRAINT PK_LugaresTuristicosCiudades PRIMARY KEY (id),
        CONSTRAINT FK_LugaresTuristicosCiudades_Ciudades FOREIGN KEY (ciudad_id)
            REFERENCES dbo.Ciudades(id)
    );
END;
GO

/* ================================================================
   13. TABLA: ComidasTipicasCiudades
   ================================================================ */
IF OBJECT_ID('dbo.ComidasTipicasCiudades', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.ComidasTipicasCiudades (
        id INT IDENTITY(1,1) NOT NULL,
        ciudad_id INT NOT NULL,
        nombre VARCHAR(160) NOT NULL,
        descripcion VARCHAR(MAX) NULL,
        imagen VARCHAR(255) NULL,
        origen_descripcion VARCHAR(MAX) NULL,
        fecha_creacion DATETIME NOT NULL CONSTRAINT DF_ComidasTipicasCiudades_fecha_creacion DEFAULT (GETDATE()),

        CONSTRAINT PK_ComidasTipicasCiudades PRIMARY KEY (id),
        CONSTRAINT FK_ComidasTipicasCiudades_Ciudades FOREIGN KEY (ciudad_id)
            REFERENCES dbo.Ciudades(id)
    );
END;
GO

/* ================================================================
   14. ÍNDICES PARA CLAVES FORÁNEAS Y CONSULTAS FRECUENTES
   ================================================================ */
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Provincias_departamento_id' AND object_id = OBJECT_ID('dbo.Provincias'))
    CREATE INDEX IX_Provincias_departamento_id ON dbo.Provincias(departamento_id);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Distritos_provincia_id' AND object_id = OBJECT_ID('dbo.Distritos'))
    CREATE INDEX IX_Distritos_provincia_id ON dbo.Distritos(provincia_id);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Ciudades_distrito_id' AND object_id = OBJECT_ID('dbo.Ciudades'))
    CREATE INDEX IX_Ciudades_distrito_id ON dbo.Ciudades(distrito_id);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_LugaresTuristicos_departamento_id' AND object_id = OBJECT_ID('dbo.LugaresTuristicos'))
    CREATE INDEX IX_LugaresTuristicos_departamento_id ON dbo.LugaresTuristicos(departamento_id);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ComidasTipicas_departamento_id' AND object_id = OBJECT_ID('dbo.ComidasTipicas'))
    CREATE INDEX IX_ComidasTipicas_departamento_id ON dbo.ComidasTipicas(departamento_id);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_LugaresTuristicosProvincias_provincia_id' AND object_id = OBJECT_ID('dbo.LugaresTuristicosProvincias'))
    CREATE INDEX IX_LugaresTuristicosProvincias_provincia_id ON dbo.LugaresTuristicosProvincias(provincia_id);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ComidasTipicasProvincias_provincia_id' AND object_id = OBJECT_ID('dbo.ComidasTipicasProvincias'))
    CREATE INDEX IX_ComidasTipicasProvincias_provincia_id ON dbo.ComidasTipicasProvincias(provincia_id);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_LugaresTuristicosDistritos_distrito_id' AND object_id = OBJECT_ID('dbo.LugaresTuristicosDistritos'))
    CREATE INDEX IX_LugaresTuristicosDistritos_distrito_id ON dbo.LugaresTuristicosDistritos(distrito_id);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ComidasTipicasDistritos_distrito_id' AND object_id = OBJECT_ID('dbo.ComidasTipicasDistritos'))
    CREATE INDEX IX_ComidasTipicasDistritos_distrito_id ON dbo.ComidasTipicasDistritos(distrito_id);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_LugaresTuristicosCiudades_ciudad_id' AND object_id = OBJECT_ID('dbo.LugaresTuristicosCiudades'))
    CREATE INDEX IX_LugaresTuristicosCiudades_ciudad_id ON dbo.LugaresTuristicosCiudades(ciudad_id);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ComidasTipicasCiudades_ciudad_id' AND object_id = OBJECT_ID('dbo.ComidasTipicasCiudades'))
    CREATE INDEX IX_ComidasTipicasCiudades_ciudad_id ON dbo.ComidasTipicasCiudades(ciudad_id);
GO

/* ================================================================
   15. COMPATIBILIDAD: AGREGAR COLUMNAS SI LA BD YA EXISTÍA
   Esta sección ayuda si ya tenías una base creada y luego agregaste
   nuevos campos como introducción o datos de rutas.
   ================================================================ */
IF OBJECT_ID('dbo.Departamentos', 'U') IS NOT NULL AND COL_LENGTH('dbo.Departamentos', 'introduccion') IS NULL
    ALTER TABLE dbo.Departamentos ADD introduccion VARCHAR(MAX) NULL;
GO

IF OBJECT_ID('dbo.LugaresTuristicos', 'U') IS NOT NULL AND COL_LENGTH('dbo.LugaresTuristicos', 'acerca') IS NULL
    ALTER TABLE dbo.LugaresTuristicos ADD acerca VARCHAR(MAX) NULL;
GO

IF OBJECT_ID('dbo.LugaresTuristicos', 'U') IS NOT NULL AND COL_LENGTH('dbo.LugaresTuristicos', 'recomendaciones_antes') IS NULL
    ALTER TABLE dbo.LugaresTuristicos ADD recomendaciones_antes VARCHAR(MAX) NULL;
GO

IF OBJECT_ID('dbo.LugaresTuristicos', 'U') IS NOT NULL AND COL_LENGTH('dbo.LugaresTuristicos', 'recomendaciones_durante') IS NULL
    ALTER TABLE dbo.LugaresTuristicos ADD recomendaciones_durante VARCHAR(MAX) NULL;
GO

IF OBJECT_ID('dbo.LugaresTuristicos', 'U') IS NOT NULL AND COL_LENGTH('dbo.LugaresTuristicos', 'clima') IS NULL
    ALTER TABLE dbo.LugaresTuristicos ADD clima VARCHAR(120) NULL;
GO

IF OBJECT_ID('dbo.LugaresTuristicos', 'U') IS NOT NULL AND COL_LENGTH('dbo.LugaresTuristicos', 'altura') IS NULL
    ALTER TABLE dbo.LugaresTuristicos ADD altura VARCHAR(120) NULL;
GO

IF OBJECT_ID('dbo.LugaresTuristicos', 'U') IS NOT NULL AND COL_LENGTH('dbo.LugaresTuristicos', 'provincia') IS NULL
    ALTER TABLE dbo.LugaresTuristicos ADD provincia VARCHAR(120) NULL;
GO

IF OBJECT_ID('dbo.LugaresTuristicos', 'U') IS NOT NULL AND COL_LENGTH('dbo.LugaresTuristicos', 'distrito') IS NULL
    ALTER TABLE dbo.LugaresTuristicos ADD distrito VARCHAR(120) NULL;
GO

IF OBJECT_ID('dbo.LugaresTuristicos', 'U') IS NOT NULL AND COL_LENGTH('dbo.LugaresTuristicos', 'origen_nombre') IS NULL
    ALTER TABLE dbo.LugaresTuristicos ADD origen_nombre VARCHAR(160) NULL;
GO

IF OBJECT_ID('dbo.LugaresTuristicos', 'U') IS NOT NULL AND COL_LENGTH('dbo.LugaresTuristicos', 'latitud_origen') IS NULL
    ALTER TABLE dbo.LugaresTuristicos ADD latitud_origen DECIMAL(10,7) NULL;
GO

IF OBJECT_ID('dbo.LugaresTuristicos', 'U') IS NOT NULL AND COL_LENGTH('dbo.LugaresTuristicos', 'longitud_origen') IS NULL
    ALTER TABLE dbo.LugaresTuristicos ADD longitud_origen DECIMAL(10,7) NULL;
GO

IF OBJECT_ID('dbo.LugaresTuristicos', 'U') IS NOT NULL AND COL_LENGTH('dbo.LugaresTuristicos', 'latitud_destino') IS NULL
    ALTER TABLE dbo.LugaresTuristicos ADD latitud_destino DECIMAL(10,7) NULL;
GO

IF OBJECT_ID('dbo.LugaresTuristicos', 'U') IS NOT NULL AND COL_LENGTH('dbo.LugaresTuristicos', 'longitud_destino') IS NULL
    ALTER TABLE dbo.LugaresTuristicos ADD longitud_destino DECIMAL(10,7) NULL;
GO

IF OBJECT_ID('dbo.LugaresTuristicos', 'U') IS NOT NULL AND COL_LENGTH('dbo.LugaresTuristicos', 'imagen_2') IS NULL
    ALTER TABLE dbo.LugaresTuristicos ADD imagen_2 VARCHAR(255) NULL;
GO

IF OBJECT_ID('dbo.LugaresTuristicos', 'U') IS NOT NULL AND COL_LENGTH('dbo.LugaresTuristicos', 'imagen_3') IS NULL
    ALTER TABLE dbo.LugaresTuristicos ADD imagen_3 VARCHAR(255) NULL;
GO

IF OBJECT_ID('dbo.LugaresTuristicos', 'U') IS NOT NULL AND COL_LENGTH('dbo.LugaresTuristicos', 'imagen_4') IS NULL
    ALTER TABLE dbo.LugaresTuristicos ADD imagen_4 VARCHAR(255) NULL;
GO

IF OBJECT_ID('dbo.LugaresTuristicos', 'U') IS NOT NULL AND COL_LENGTH('dbo.LugaresTuristicos', 'origen_busqueda') IS NULL
    ALTER TABLE dbo.LugaresTuristicos ADD origen_busqueda VARCHAR(255) NULL;
GO

IF OBJECT_ID('dbo.LugaresTuristicos', 'U') IS NOT NULL AND COL_LENGTH('dbo.LugaresTuristicos', 'destino_nombre') IS NULL
    ALTER TABLE dbo.LugaresTuristicos ADD destino_nombre VARCHAR(180) NULL;
GO

IF OBJECT_ID('dbo.LugaresTuristicos', 'U') IS NOT NULL AND COL_LENGTH('dbo.LugaresTuristicos', 'destino_busqueda') IS NULL
    ALTER TABLE dbo.LugaresTuristicos ADD destino_busqueda VARCHAR(255) NULL;
GO

/* ================================================================
   16. CONSULTA DE VERIFICACIÓN
   ================================================================ */
SELECT
    t.name AS tabla,
    SUM(p.rows) AS total_filas
FROM sys.tables t
INNER JOIN sys.partitions p ON t.object_id = p.object_id
WHERE p.index_id IN (0,1)
  AND t.name IN (
    'Usuarios', 'Departamentos', 'Provincias', 'Distritos', 'Ciudades',
    'LugaresTuristicos', 'ComidasTipicas',
    'LugaresTuristicosProvincias', 'ComidasTipicasProvincias',
    'LugaresTuristicosDistritos', 'ComidasTipicasDistritos',
    'LugaresTuristicosCiudades', 'ComidasTipicasCiudades'
  )
GROUP BY t.name
ORDER BY t.name;
GO

PRINT 'Script de base de datos PERU APP ejecutado correctamente.';
GO
