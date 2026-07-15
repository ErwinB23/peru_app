# BLOQUE 4 — INSTRUCCIONES DE APLICACIÓN

## 1. Copiar el paquete

Copie todas las carpetas del ZIP en la raíz de `PERU_APP_FINAL` y elija **Reemplazar los archivos en el destino**.

El paquete no incluye `.env`, `node_modules`, `.git`, `dist`, `.vite`, respaldos ni imágenes existentes.

## 2. Iniciar el backend

```powershell
cd C:\Users\ACER\OneDrive\Desktop\PERU_APP_FINAL\backend
npm run dev
```

## 3. Iniciar y comprobar el frontend

```powershell
cd C:\Users\ACER\OneDrive\Desktop\PERU_APP_FINAL\frontend
npm run lint
npm run build
npm run dev
```

## 4. Ejecutar la comprobación técnica

Desde la raíz:

```powershell
cd C:\Users\ACER\OneDrive\Desktop\PERU_APP_FINAL
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\block4-integrity-image-check.ps1 -RunFrontendChecks
```

## 5. Auditar y migrar SQL Server

En SQL Server Management Studio:

1. Ejecutar `database/maintenance/010-auditoria-integridad-bloque-4.sql`.
2. Confirmar que todos los conteos sean 0 y que no aparezcan duplicados.
3. Crear o verificar el respaldo `.bak`.
4. Ejecutar `database/migrations/005-integridad-basica.sql`.

Si la auditoría muestra valores distintos de cero, no ejecute todavía la migración. Conserve la salida para corregir esos registros.

## 6. Pruebas manuales mínimas

- Intentar eliminar un departamento con provincias: 409.
- Cargar un archivo renombrado como `.jpg` pero cuyo contenido sea texto: 415.
- Cargar una imagen mayor de 5 MB: 413.
- Reemplazar la imagen de un registro de prueba y comprobar que la anterior desaparece.
- Eliminar el registro de prueba y comprobar que su imagen desaparece.
- Confirmar que usuario normal no puede crear, editar ni eliminar.

## 7. Guardar en Git

```powershell
git status
git add -A
git commit -m "fix(integrity): implementar bloque 4 de base de datos e imagenes"
git push
```
