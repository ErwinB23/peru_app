/* =====================================================================
   BLOQUE 4 - MIGRACION 005: INTEGRIDAD BASICA
   Requisitos:
   1) Ejecutar primero maintenance/010-auditoria-integridad-bloque-4.sql.
   2) Respaldar la base de datos.
   3) Ejecutar este archivo una sola vez; es idempotente.
   No se usa ON DELETE CASCADE: las relaciones se protegen por defecto.
   ===================================================================== */
USE PeruDepartamentosDB;
GO
SET XACT_ABORT ON;
SET NOCOUNT ON;

BEGIN TRY
    BEGIN TRANSACTION;

    IF EXISTS (SELECT 1 FROM dbo.Departamentos WHERE area_km2 IS NOT NULL AND area_km2 <= 0)
        THROW 51001, 'Existen departamentos con area_km2 menor o igual a 0.', 1;
    IF EXISTS (SELECT 1 FROM dbo.Departamentos WHERE poblacion_aprox IS NOT NULL AND poblacion_aprox < 0)
        THROW 51002, 'Existen departamentos con poblacion negativa.', 1;
    IF EXISTS (SELECT 1 FROM dbo.Provincias WHERE area_km2 IS NOT NULL AND area_km2 <= 0)
        THROW 51003, 'Existen provincias con area_km2 menor o igual a 0.', 1;
    IF EXISTS (SELECT 1 FROM dbo.Provincias WHERE poblacion_aprox IS NOT NULL AND poblacion_aprox < 0)
        THROW 51004, 'Existen provincias con poblacion negativa.', 1;
    IF EXISTS (SELECT 1 FROM dbo.Distritos WHERE area_km2 IS NOT NULL AND area_km2 <= 0)
        THROW 51005, 'Existen distritos con area_km2 menor o igual a 0.', 1;
    IF EXISTS (SELECT 1 FROM dbo.Distritos WHERE poblacion_aprox IS NOT NULL AND poblacion_aprox < 0)
        THROW 51006, 'Existen distritos con poblacion negativa.', 1;
    IF EXISTS (SELECT 1 FROM dbo.Ciudades WHERE poblacion IS NOT NULL AND poblacion < 0)
        THROW 51007, 'Existen ciudades con poblacion negativa.', 1;
    IF EXISTS (SELECT 1 FROM dbo.Ciudades WHERE latitud IS NOT NULL AND (latitud < -90 OR latitud > 90))
        THROW 51008, 'Existen ciudades con latitud fuera de rango.', 1;
    IF EXISTS (SELECT 1 FROM dbo.Ciudades WHERE longitud IS NOT NULL AND (longitud < -180 OR longitud > 180))
        THROW 51009, 'Existen ciudades con longitud fuera de rango.', 1;
    IF EXISTS (
        SELECT 1 FROM dbo.LugaresTuristicos
        WHERE (latitud_origen IS NOT NULL AND (latitud_origen < -90 OR latitud_origen > 90))
           OR (latitud_destino IS NOT NULL AND (latitud_destino < -90 OR latitud_destino > 90))
           OR (longitud_origen IS NOT NULL AND (longitud_origen < -180 OR longitud_origen > 180))
           OR (longitud_destino IS NOT NULL AND (longitud_destino < -180 OR longitud_destino > 180))
    )
        THROW 51010, 'Existen lugares turisticos con coordenadas fuera de rango.', 1;

    IF EXISTS (
        SELECT 1 FROM dbo.LugaresTuristicos GROUP BY departamento_id, LOWER(LTRIM(RTRIM(nombre))) HAVING COUNT(*) > 1
    ) THROW 51011, 'Existen lugares turisticos departamentales duplicados.', 1;
    IF EXISTS (
        SELECT 1 FROM dbo.ComidasTipicas GROUP BY departamento_id, LOWER(LTRIM(RTRIM(nombre))) HAVING COUNT(*) > 1
    ) THROW 51012, 'Existen comidas tipicas departamentales duplicadas.', 1;
    IF EXISTS (
        SELECT 1 FROM dbo.LugaresTuristicosProvincias GROUP BY provincia_id, LOWER(LTRIM(RTRIM(nombre))) HAVING COUNT(*) > 1
    ) THROW 51013, 'Existen lugares turisticos provinciales duplicados.', 1;
    IF EXISTS (
        SELECT 1 FROM dbo.ComidasTipicasProvincias GROUP BY provincia_id, LOWER(LTRIM(RTRIM(nombre))) HAVING COUNT(*) > 1
    ) THROW 51014, 'Existen comidas tipicas provinciales duplicadas.', 1;
    IF EXISTS (
        SELECT 1 FROM dbo.LugaresTuristicosDistritos GROUP BY distrito_id, LOWER(LTRIM(RTRIM(nombre))) HAVING COUNT(*) > 1
    ) THROW 51015, 'Existen lugares turisticos distritales duplicados.', 1;
    IF EXISTS (
        SELECT 1 FROM dbo.ComidasTipicasDistritos GROUP BY distrito_id, LOWER(LTRIM(RTRIM(nombre))) HAVING COUNT(*) > 1
    ) THROW 51016, 'Existen comidas tipicas distritales duplicadas.', 1;
    IF EXISTS (
        SELECT 1 FROM dbo.LugaresTuristicosCiudades GROUP BY ciudad_id, LOWER(LTRIM(RTRIM(nombre))) HAVING COUNT(*) > 1
    ) THROW 51017, 'Existen lugares turisticos de ciudad duplicados.', 1;
    IF EXISTS (
        SELECT 1 FROM dbo.ComidasTipicasCiudades GROUP BY ciudad_id, LOWER(LTRIM(RTRIM(nombre))) HAVING COUNT(*) > 1
    ) THROW 51018, 'Existen comidas tipicas de ciudad duplicadas.', 1;

    IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Departamentos_area_km2')
        ALTER TABLE dbo.Departamentos WITH CHECK ADD CONSTRAINT CK_Departamentos_area_km2 CHECK (area_km2 IS NULL OR area_km2 > 0);
    IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Departamentos_poblacion')
        ALTER TABLE dbo.Departamentos WITH CHECK ADD CONSTRAINT CK_Departamentos_poblacion CHECK (poblacion_aprox IS NULL OR poblacion_aprox >= 0);

    IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Provincias_area_km2')
        ALTER TABLE dbo.Provincias WITH CHECK ADD CONSTRAINT CK_Provincias_area_km2 CHECK (area_km2 IS NULL OR area_km2 > 0);
    IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Provincias_poblacion')
        ALTER TABLE dbo.Provincias WITH CHECK ADD CONSTRAINT CK_Provincias_poblacion CHECK (poblacion_aprox IS NULL OR poblacion_aprox >= 0);

    IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Distritos_area_km2')
        ALTER TABLE dbo.Distritos WITH CHECK ADD CONSTRAINT CK_Distritos_area_km2 CHECK (area_km2 IS NULL OR area_km2 > 0);
    IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Distritos_poblacion')
        ALTER TABLE dbo.Distritos WITH CHECK ADD CONSTRAINT CK_Distritos_poblacion CHECK (poblacion_aprox IS NULL OR poblacion_aprox >= 0);

    IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Ciudades_poblacion')
        ALTER TABLE dbo.Ciudades WITH CHECK ADD CONSTRAINT CK_Ciudades_poblacion CHECK (poblacion IS NULL OR poblacion >= 0);
    IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Ciudades_latitud')
        ALTER TABLE dbo.Ciudades WITH CHECK ADD CONSTRAINT CK_Ciudades_latitud CHECK (latitud IS NULL OR latitud BETWEEN -90 AND 90);
    IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Ciudades_longitud')
        ALTER TABLE dbo.Ciudades WITH CHECK ADD CONSTRAINT CK_Ciudades_longitud CHECK (longitud IS NULL OR longitud BETWEEN -180 AND 180);

    IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_LugaresTuristicos_latitud_origen')
        ALTER TABLE dbo.LugaresTuristicos WITH CHECK ADD CONSTRAINT CK_LugaresTuristicos_latitud_origen CHECK (latitud_origen IS NULL OR latitud_origen BETWEEN -90 AND 90);
    IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_LugaresTuristicos_longitud_origen')
        ALTER TABLE dbo.LugaresTuristicos WITH CHECK ADD CONSTRAINT CK_LugaresTuristicos_longitud_origen CHECK (longitud_origen IS NULL OR longitud_origen BETWEEN -180 AND 180);
    IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_LugaresTuristicos_latitud_destino')
        ALTER TABLE dbo.LugaresTuristicos WITH CHECK ADD CONSTRAINT CK_LugaresTuristicos_latitud_destino CHECK (latitud_destino IS NULL OR latitud_destino BETWEEN -90 AND 90);
    IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_LugaresTuristicos_longitud_destino')
        ALTER TABLE dbo.LugaresTuristicos WITH CHECK ADD CONSTRAINT CK_LugaresTuristicos_longitud_destino CHECK (longitud_destino IS NULL OR longitud_destino BETWEEN -180 AND 180);

    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID('dbo.LugaresTuristicos') AND name IN ('UX_LugaresTuristicos_departamento_nombre', 'UQ_LugaresTuristicos_departamento_nombre'))
        CREATE UNIQUE INDEX UX_LugaresTuristicos_departamento_nombre ON dbo.LugaresTuristicos(departamento_id, nombre);
    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID('dbo.ComidasTipicas') AND name IN ('UX_ComidasTipicas_departamento_nombre', 'UQ_ComidasTipicas_departamento_nombre'))
        CREATE UNIQUE INDEX UX_ComidasTipicas_departamento_nombre ON dbo.ComidasTipicas(departamento_id, nombre);
    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID('dbo.LugaresTuristicosProvincias') AND name IN ('UX_LugaresTuristicosProvincias_provincia_nombre', 'UQ_LugaresTuristicosProvincias_provincia_nombre'))
        CREATE UNIQUE INDEX UX_LugaresTuristicosProvincias_provincia_nombre ON dbo.LugaresTuristicosProvincias(provincia_id, nombre);
    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID('dbo.ComidasTipicasProvincias') AND name IN ('UX_ComidasTipicasProvincias_provincia_nombre', 'UQ_ComidasTipicasProvincias_provincia_nombre'))
        CREATE UNIQUE INDEX UX_ComidasTipicasProvincias_provincia_nombre ON dbo.ComidasTipicasProvincias(provincia_id, nombre);
    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID('dbo.LugaresTuristicosDistritos') AND name IN ('UX_LugaresTuristicosDistritos_distrito_nombre', 'UQ_LugaresTuristicosDistritos_distrito_nombre'))
        CREATE UNIQUE INDEX UX_LugaresTuristicosDistritos_distrito_nombre ON dbo.LugaresTuristicosDistritos(distrito_id, nombre);
    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID('dbo.ComidasTipicasDistritos') AND name IN ('UX_ComidasTipicasDistritos_distrito_nombre', 'UQ_ComidasTipicasDistritos_distrito_nombre'))
        CREATE UNIQUE INDEX UX_ComidasTipicasDistritos_distrito_nombre ON dbo.ComidasTipicasDistritos(distrito_id, nombre);
    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID('dbo.LugaresTuristicosCiudades') AND name IN ('UX_LugaresTuristicosCiudades_ciudad_nombre', 'UQ_LugaresTuristicosCiudades_ciudad_nombre'))
        CREATE UNIQUE INDEX UX_LugaresTuristicosCiudades_ciudad_nombre ON dbo.LugaresTuristicosCiudades(ciudad_id, nombre);
    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID('dbo.ComidasTipicasCiudades') AND name IN ('UX_ComidasTipicasCiudades_ciudad_nombre', 'UQ_ComidasTipicasCiudades_ciudad_nombre'))
        CREATE UNIQUE INDEX UX_ComidasTipicasCiudades_ciudad_nombre ON dbo.ComidasTipicasCiudades(ciudad_id, nombre);

    COMMIT TRANSACTION;
    PRINT 'Migracion 005 aplicada correctamente.';
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;
GO
