/* =====================================================================
   BLOQUE 4 - AUDITORIA PREVIA DE INTEGRIDAD
   Ejecutar en SQL Server Management Studio antes de la migracion 005.
   Todos los conteos deben ser 0.
   ===================================================================== */
USE PeruDepartamentosDB;
GO
SET NOCOUNT ON;

SELECT 'Departamentos.area_km2_invalida' AS validacion, COUNT(*) AS cantidad
FROM dbo.Departamentos WHERE area_km2 IS NOT NULL AND area_km2 <= 0
UNION ALL
SELECT 'Departamentos.poblacion_invalida', COUNT(*)
FROM dbo.Departamentos WHERE poblacion_aprox IS NOT NULL AND poblacion_aprox < 0
UNION ALL
SELECT 'Provincias.area_km2_invalida', COUNT(*)
FROM dbo.Provincias WHERE area_km2 IS NOT NULL AND area_km2 <= 0
UNION ALL
SELECT 'Provincias.poblacion_invalida', COUNT(*)
FROM dbo.Provincias WHERE poblacion_aprox IS NOT NULL AND poblacion_aprox < 0
UNION ALL
SELECT 'Distritos.area_km2_invalida', COUNT(*)
FROM dbo.Distritos WHERE area_km2 IS NOT NULL AND area_km2 <= 0
UNION ALL
SELECT 'Distritos.poblacion_invalida', COUNT(*)
FROM dbo.Distritos WHERE poblacion_aprox IS NOT NULL AND poblacion_aprox < 0
UNION ALL
SELECT 'Ciudades.poblacion_invalida', COUNT(*)
FROM dbo.Ciudades WHERE poblacion IS NOT NULL AND poblacion < 0
UNION ALL
SELECT 'Ciudades.latitud_invalida', COUNT(*)
FROM dbo.Ciudades WHERE latitud IS NOT NULL AND (latitud < -90 OR latitud > 90)
UNION ALL
SELECT 'Ciudades.longitud_invalida', COUNT(*)
FROM dbo.Ciudades WHERE longitud IS NOT NULL AND (longitud < -180 OR longitud > 180)
UNION ALL
SELECT 'LugaresTuristicos.latitud_origen_invalida', COUNT(*)
FROM dbo.LugaresTuristicos WHERE latitud_origen IS NOT NULL AND (latitud_origen < -90 OR latitud_origen > 90)
UNION ALL
SELECT 'LugaresTuristicos.longitud_origen_invalida', COUNT(*)
FROM dbo.LugaresTuristicos WHERE longitud_origen IS NOT NULL AND (longitud_origen < -180 OR longitud_origen > 180)
UNION ALL
SELECT 'LugaresTuristicos.latitud_destino_invalida', COUNT(*)
FROM dbo.LugaresTuristicos WHERE latitud_destino IS NOT NULL AND (latitud_destino < -90 OR latitud_destino > 90)
UNION ALL
SELECT 'LugaresTuristicos.longitud_destino_invalida', COUNT(*)
FROM dbo.LugaresTuristicos WHERE longitud_destino IS NOT NULL AND (longitud_destino < -180 OR longitud_destino > 180);

SELECT 'LugaresTuristicos' AS tabla, departamento_id AS ambito_id, LOWER(LTRIM(RTRIM(nombre))) AS nombre_normalizado, COUNT(*) AS cantidad
FROM dbo.LugaresTuristicos
GROUP BY departamento_id, LOWER(LTRIM(RTRIM(nombre)))
HAVING COUNT(*) > 1
UNION ALL
SELECT 'ComidasTipicas', departamento_id, LOWER(LTRIM(RTRIM(nombre))), COUNT(*)
FROM dbo.ComidasTipicas
GROUP BY departamento_id, LOWER(LTRIM(RTRIM(nombre)))
HAVING COUNT(*) > 1
UNION ALL
SELECT 'LugaresTuristicosProvincias', provincia_id, LOWER(LTRIM(RTRIM(nombre))), COUNT(*)
FROM dbo.LugaresTuristicosProvincias
GROUP BY provincia_id, LOWER(LTRIM(RTRIM(nombre)))
HAVING COUNT(*) > 1
UNION ALL
SELECT 'ComidasTipicasProvincias', provincia_id, LOWER(LTRIM(RTRIM(nombre))), COUNT(*)
FROM dbo.ComidasTipicasProvincias
GROUP BY provincia_id, LOWER(LTRIM(RTRIM(nombre)))
HAVING COUNT(*) > 1
UNION ALL
SELECT 'LugaresTuristicosDistritos', distrito_id, LOWER(LTRIM(RTRIM(nombre))), COUNT(*)
FROM dbo.LugaresTuristicosDistritos
GROUP BY distrito_id, LOWER(LTRIM(RTRIM(nombre)))
HAVING COUNT(*) > 1
UNION ALL
SELECT 'ComidasTipicasDistritos', distrito_id, LOWER(LTRIM(RTRIM(nombre))), COUNT(*)
FROM dbo.ComidasTipicasDistritos
GROUP BY distrito_id, LOWER(LTRIM(RTRIM(nombre)))
HAVING COUNT(*) > 1
UNION ALL
SELECT 'LugaresTuristicosCiudades', ciudad_id, LOWER(LTRIM(RTRIM(nombre))), COUNT(*)
FROM dbo.LugaresTuristicosCiudades
GROUP BY ciudad_id, LOWER(LTRIM(RTRIM(nombre)))
HAVING COUNT(*) > 1
UNION ALL
SELECT 'ComidasTipicasCiudades', ciudad_id, LOWER(LTRIM(RTRIM(nombre))), COUNT(*)
FROM dbo.ComidasTipicasCiudades
GROUP BY ciudad_id, LOWER(LTRIM(RTRIM(nombre)))
HAVING COUNT(*) > 1;

SELECT 'Provincias_sin_departamento' AS validacion, COUNT(*) AS cantidad
FROM dbo.Provincias p LEFT JOIN dbo.Departamentos d ON d.id = p.departamento_id WHERE d.id IS NULL
UNION ALL
SELECT 'Distritos_sin_provincia', COUNT(*)
FROM dbo.Distritos d LEFT JOIN dbo.Provincias p ON p.id = d.provincia_id WHERE p.id IS NULL
UNION ALL
SELECT 'Ciudades_sin_distrito', COUNT(*)
FROM dbo.Ciudades c LEFT JOIN dbo.Distritos d ON d.id = c.distrito_id WHERE d.id IS NULL;
GO
