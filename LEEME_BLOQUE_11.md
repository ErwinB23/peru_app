# BLOQUE 11 - CLOUDINARY

## Objetivo

Guardar las imagenes nuevas en Cloudinary y migrar las rutas locales existentes antes de desplegar el backend en Render.

## Regla de seguridad

- Nunca copie `CLOUDINARY_API_SECRET` al frontend.
- No suba `backend/.env` a GitHub.
- No elimine `backend/uploads` antes de validar la migracion y el CRUD remoto.

## Aplicacion

1. Copie el contenido del paquete en la raiz de `PERU_APP_FINAL`.
2. Ejecute desde la raiz:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\scripts\block11-cloudinary-setup.ps1 -Install
```

El comando instala `cloudinary@2.10.0` desde `registry.npmjs.org` y actualiza `package-lock.json`.

## Variables locales

Abra `backend/.env` y agregue:

```env
IMAGE_STORAGE=cloudinary
CLOUDINARY_CLOUD_NAME=SU_CLOUD_NAME
CLOUDINARY_API_KEY=SU_API_KEY
CLOUDINARY_API_SECRET=SU_API_SECRET
CLOUDINARY_FOLDER=peru-app/development
```

## Verificacion

```powershell
.\scripts\block11-cloudinary-setup.ps1 -CheckConnection -RunTests -OpenReport
```

## Simulacion de migracion

Con SQL Server encendido:

```powershell
.\scripts\block11-cloudinary-setup.ps1 -DryRunMigration -OpenReport
```

Revise el JSON generado en `backend/reports/cloudinary`. No debe haber archivos faltantes.

## Migracion real

1. Cree un respaldo de SQL Server.
2. Ejecute desde `backend`:

```powershell
npm run cloudinary:migrate
```

3. No borre los archivos locales.
4. Inicie backend y frontend.
5. Pruebe crear, reemplazar y eliminar una imagen con el administrador QA.
6. Compruebe en SQL Server que la columna contiene `https://res.cloudinary.com/...`.
7. Compruebe en Cloudinary que el recurso anterior se elimina al reemplazar o borrar.

## Git

Cuando todo funcione:

```powershell
git status
git add -A
git commit -m "feat(storage): integrar Cloudinary y migrar imagenes"
git push
```

El archivo `backend/package-lock.json` actualizado por npm debe guardarse en Git.
