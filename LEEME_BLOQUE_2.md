# BLOQUE 2 — Autenticación, rutas y seguridad HTTP

## Aplicación

Copia todo el contenido de este ZIP en la raíz de `PERU_APP_FINAL` y acepta **Reemplazar los archivos en el destino**.

Este paquete no incluye `.env` reales ni modifica la base de datos.

## Después de copiar

### Backend

```powershell
cd backend
npm install
npm run dev
```

La instalación agregará `helmet` y `express-rate-limit` usando el `package-lock.json` incluido.

### Frontend, en otra terminal

```powershell
cd frontend
npm install
npm run lint
npm run build
npm run dev
```

El frontend local oficial queda en `http://localhost:5173`.

## Verificación rápida

Desde la raíz del proyecto, con backend activo:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\block2-security-check.ps1
```

Debe comprobar:

- `/api/health` → 200.
- `/api/departamentos` sin token → 401.
- `/api/test-db` → 404.
- `/api/debug-token` → 404.

Después realiza manualmente login con usuario y administrador, consulta, CRUD y recarga de página.

## Variables de entorno

En desarrollo, confirma en `backend/.env`:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URLS=http://localhost:5173
REQUEST_BODY_LIMIT=1mb
```

No reemplaces tu contraseña de SQL Server por los valores de `.env.example`.

## Git

```powershell
git status
git add -A
git commit -m "fix(auth): implementar bloque 2 de sesion y rutas protegidas"
git push
```

No marques las tareas como validadas todavía. El paquete las deja en `[~]` hasta obtener evidencias locales.
