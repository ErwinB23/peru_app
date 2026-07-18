# PERU APP

Plataforma web turístico-educativa para consultar y administrar información territorial, turística y gastronómica del Perú. El proyecto fue desarrollado mediante **Spec-Driven Development (SDD)** con **GitHub Spec Kit**.

## Estado del proyecto

| Área | Estado |
|---|---|
| Aplicación local | Funcional |
| Autenticación JWT y roles | Implementados y probados |
| Validaciones e integridad | Implementadas y probadas |
| OpenAPI | 70 operaciones sincronizadas |
| Pruebas backend | 15 suites y 388 casos aprobados |
| Newman | 11 solicitudes, 17 aserciones y 0 fallos |
| Playwright | 4 flujos y 0 fallos |
| Cobertura | S89.98 · B87.48 · F96.18 · L89.85 |
| Auditoría npm | 0 vulnerabilidades en backend y frontend |
| Optimización multimedia | Completada |
| Cloudinary | Integrado y validado localmente |
| Base local | Estructura conservada, datos reiniciados para producción |
| Azure SQL | Pendiente |
| Render | Pendiente |
| Vercel | Pendiente |
| Aceptación pública | Pendiente |

El estado correcto es **listo para iniciar la infraestructura cloud**, no “aceptado en producción”.

## Stack tecnológico real

### Frontend

- React 19.
- Vite.
- JavaScript.
- HTML5.
- **CSS propio**.
- Axios.
- React Router.
- Leaflet y OpenStreetMap.
- Lucide React.

### Backend

- Node.js.
- Express.
- SQL Server mediante `mssql`.
- JWT y bcrypt.
- Helmet, CORS y rate limiting.
- Multer para recepción y validación de imágenes.
- Cloudinary para almacenamiento persistente de imágenes.

### Calidad y documentación

- Jest.
- Supertest.
- Postman/Newman.
- Playwright.
- ESLint.
- GitHub Actions.
- GitHub Spec Kit.
- OpenAPI.

> El proyecto no utiliza Tailwind CSS.

## Arquitectura

```text
React + Vite + CSS propio
          |
          | HTTPS / JSON / JWT
          v
Node.js + Express
          |
          +--> SQL Server local / Azure SQL pendiente
          |
          +--> Cloudinary
```

El backend conserva un modo local de imágenes para desarrollo, pero la producción utiliza:

```env
IMAGE_STORAGE=cloudinary
```

## Módulos

- Registro, login, perfil y cierre de sesión.
- Roles `usuario` y `admin`.
- Gestión de usuarios.
- Departamentos.
- Provincias.
- Distritos.
- Ciudades.
- Lugares turísticos por ámbito territorial.
- Comidas típicas por ámbito territorial.
- Mapas y rutas.
- Carga, reemplazo y eliminación de imágenes.

## Estructura del repositorio

```text
PERU_APP_FINAL/
├── .github/
├── .specify/
├── .speckit/
├── backend/
├── database/
├── docs/
├── frontend/
├── scripts/
├── specs/
├── tests/
├── .gitignore
└── README.md
```

Las carpetas `backend/uploads/**` se conservan vacías mediante archivos `.gitkeep`. Las imágenes reales no se versionan.

## Requisitos locales

- Node.js `>=20.19.0`; entorno verificado con Node.js 24 LTS.
- npm.
- SQL Server.
- SQL Server Management Studio.
- Cuenta de Cloudinary para probar almacenamiento remoto.

## Configuración del backend

```powershell
cd backend
Copy-Item .env.example .env
npm ci
npm run dev
```

Variables principales:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URLS=http://localhost:5173

DB_SERVER=localhost
DB_DATABASE=PeruDepartamentosDB
DB_USER=sa
DB_PASSWORD=TU_PASSWORD
DB_PORT=1433

JWT_SECRET=CLAVE_LARGA_Y_SEGURA
JWT_EXPIRE=1d

IMAGE_STORAGE=cloudinary
CLOUDINARY_CLOUD_NAME=TU_CLOUD_NAME
CLOUDINARY_API_KEY=TU_API_KEY
CLOUDINARY_API_SECRET=TU_API_SECRET
CLOUDINARY_FOLDER=peru-app/pruebas
```

Nunca se debe colocar `CLOUDINARY_API_SECRET` en el frontend ni subir `.env` a GitHub.

## Configuración del frontend

```powershell
cd frontend
Copy-Item .env.example .env
npm ci
npm run dev
```

Variable local:

```env
VITE_API_URL=http://localhost:5000/api
```

URLs locales:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Health: `http://localhost:5000/api/health`

## Calidad

Backend:

```powershell
cd backend
npm run test:coverage
npm audit --omit=dev
```

Frontend:

```powershell
cd frontend
npm run lint
npm run build
npm audit --omit=dev
```

Cierre documental posterior a Cloudinary:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\scripts\block12-post-cloudinary-sdd.ps1 -RunQualityChecks -OpenReports
```

## Evidencias principales

```text
docs/evidencias/pruebas-finales/
docs/estabilizacion/evidencias/bloque-6/
docs/estabilizacion/evidencias/bloque-9/
docs/estabilizacion/evidencias/bloque-11/
```

## Datos de producción

La base local conserva su estructura, restricciones e índices. Los registros de prueba fueron retirados y los campos `IDENTITY` se reiniciaron para comenzar desde ID 1. El procedimiento versionado se encuentra en:

```text
database/maintenance/012-limpiar-datos-y-reiniciar-identities.sql
```

La base de Azure se preparará a partir de esta estructura limpia, conservando al menos un administrador definitivo.

## Despliegue objetivo

```text
Vercel
  -> Render
      -> Azure SQL
      -> Cloudinary
```

Antes de Azure SQL se debe adaptar la configuración de conexión para usar cifrado y certificado según variables de entorno. Actualmente esa adecuación pertenece al siguiente bloque de despliegue.

## Seguridad del repositorio

No versionar:

- `.env`.
- Credenciales QA locales.
- `node_modules`.
- `dist` o `.vite`.
- Imágenes reales de `backend/uploads`.
- Reportes regenerables.
- ZIP, BAK o respaldos.

## Autor

**Erwin Brayam Inca Pauccara — 2026**
