/*
    PERU APP — Respaldo previo a la estabilización

    1. Cree manualmente la carpeta C:\SQLBackups o cambie @BackupDirectory.
    2. La cuenta del servicio de SQL Server debe tener permiso de escritura.
    3. No suba el archivo .bak a un repositorio público.
*/

USE master;
GO

DECLARE @DatabaseName SYSNAME = N'PeruDepartamentosDB';
DECLARE @BackupDirectory NVARCHAR(260) = N'C:\SQLBackups\';
DECLARE @Timestamp CHAR(15) =
    CONVERT(CHAR(8), GETDATE(), 112) + N'_' +
    REPLACE(CONVERT(CHAR(8), GETDATE(), 108), N':', N'');
DECLARE @BackupPath NVARCHAR(4000) =
    @BackupDirectory + @DatabaseName + N'_PRE_ESTABILIZACION_' + @Timestamp + N'.bak';

IF DB_ID(@DatabaseName) IS NULL
BEGIN
    THROW 50001, 'La base de datos PeruDepartamentosDB no existe en esta instancia.', 1;
END;

PRINT N'Creando respaldo en: ' + @BackupPath;

BACKUP DATABASE [PeruDepartamentosDB]
TO DISK = @BackupPath
WITH
    COPY_ONLY,
    INIT,
    COMPRESSION,
    CHECKSUM,
    STATS = 10;

PRINT N'Verificando el respaldo...';

RESTORE VERIFYONLY
FROM DISK = @BackupPath
WITH CHECKSUM;

PRINT N'Respaldo creado y verificado correctamente.';
PRINT N'Archivo: ' + @BackupPath;
GO
