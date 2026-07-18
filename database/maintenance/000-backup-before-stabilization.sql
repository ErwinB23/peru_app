/*
    Respaldo previo a estabilización - SQL Server Express compatible
    Base de datos: PeruDepartamentosDB
    Carpeta de destino: C:\SQLBackups

    Importante:
    - La carpeta C:\SQLBackups debe existir.
    - La cuenta del servicio de SQL Server debe tener permiso de escritura.
    - No usa WITH COMPRESSION porque SQL Server Express no lo admite.
*/

USE master;
GO

SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

DECLARE @BackupDirectory NVARCHAR(260) = N'C:\SQLBackups\';
DECLARE @Timestamp VARCHAR(32);
DECLARE @BackupFile NVARCHAR(520);

SET @Timestamp =
    CONVERT(CHAR(8), GETDATE(), 112) + '_' +
    REPLACE(CONVERT(CHAR(8), GETDATE(), 108), ':', '');

SET @BackupFile =
    @BackupDirectory +
    N'PeruDepartamentosDB_PRE_ESTABILIZACION_' +
    @Timestamp +
    N'.bak';

IF DB_ID(N'PeruDepartamentosDB') IS NULL
BEGIN
    THROW 50001, 'No existe la base de datos PeruDepartamentosDB.', 1;
END;

BEGIN TRY
    PRINT N'Creando respaldo en: ' + @BackupFile;

    BACKUP DATABASE [PeruDepartamentosDB]
    TO DISK = @BackupFile
    WITH
        COPY_ONLY,
        INIT,
        CHECKSUM,
        STATS = 10;

    PRINT N'Verificando el respaldo...';

    RESTORE VERIFYONLY
    FROM DISK = @BackupFile
    WITH CHECKSUM;

    PRINT N'RESPALDO CREADO Y VERIFICADO CORRECTAMENTE.';
    PRINT N'Archivo: ' + @BackupFile;
END TRY
BEGIN CATCH
    PRINT N'EL RESPALDO NO FUE CREADO O NO PUDO VERIFICARSE.';
    PRINT N'Número de error: ' + CAST(ERROR_NUMBER() AS NVARCHAR(20));
    PRINT N'Mensaje: ' + ERROR_MESSAGE();
    THROW;
END CATCH;
GO



USE PeruDepartamentosDB;
GO

UPDATE Usuarios
SET rol = 'admin'
WHERE email = 'brayam231000@gmail.com';
GO

SELECT id, nombres, apellidos, email, rol
FROM Usuarios;
GO



select * from Usuarios