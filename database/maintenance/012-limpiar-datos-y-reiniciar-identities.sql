/*
PERU APP - LIMPIEZA DE DATOS Y REINICIO DE IDENTITIES
Conserva tablas, claves, restricciones e indices.
Ejecutar solo despues de crear un respaldo.
*/

USE PeruDepartamentosDB;
GO

SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

DECLARE @EliminarUsuarios BIT = 1;

BEGIN TRY
    BEGIN TRANSACTION;

    DELETE FROM dbo.ComidasTipicasCiudades;
    DELETE FROM dbo.LugaresTuristicosCiudades;
    DELETE FROM dbo.ComidasTipicasDistritos;
    DELETE FROM dbo.LugaresTuristicosDistritos;
    DELETE FROM dbo.ComidasTipicasProvincias;
    DELETE FROM dbo.LugaresTuristicosProvincias;
    DELETE FROM dbo.ComidasTipicas;
    DELETE FROM dbo.LugaresTuristicos;
    DELETE FROM dbo.Ciudades;
    DELETE FROM dbo.Distritos;
    DELETE FROM dbo.Provincias;
    DELETE FROM dbo.Departamentos;

    IF @EliminarUsuarios = 1
        DELETE FROM dbo.Usuarios;

    DBCC CHECKIDENT ('dbo.ComidasTipicasCiudades', RESEED, 0);
    DBCC CHECKIDENT ('dbo.LugaresTuristicosCiudades', RESEED, 0);
    DBCC CHECKIDENT ('dbo.ComidasTipicasDistritos', RESEED, 0);
    DBCC CHECKIDENT ('dbo.LugaresTuristicosDistritos', RESEED, 0);
    DBCC CHECKIDENT ('dbo.ComidasTipicasProvincias', RESEED, 0);
    DBCC CHECKIDENT ('dbo.LugaresTuristicosProvincias', RESEED, 0);
    DBCC CHECKIDENT ('dbo.ComidasTipicas', RESEED, 0);
    DBCC CHECKIDENT ('dbo.LugaresTuristicos', RESEED, 0);
    DBCC CHECKIDENT ('dbo.Ciudades', RESEED, 0);
    DBCC CHECKIDENT ('dbo.Distritos', RESEED, 0);
    DBCC CHECKIDENT ('dbo.Provincias', RESEED, 0);
    DBCC CHECKIDENT ('dbo.Departamentos', RESEED, 0);

    IF @EliminarUsuarios = 1
        DBCC CHECKIDENT ('dbo.Usuarios', RESEED, 0);

    COMMIT TRANSACTION;
    PRINT 'Limpieza completada. El siguiente IDENTITY sera 1.';
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;
GO
