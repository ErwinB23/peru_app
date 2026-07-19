# PERU APP

Plataforma web turístico-educativa para consultar y administrar información territorial, turística y gastronómica del Perú. El proyecto fue desarrollado mediante **Spec-Driven Development (SDD)** con **GitHub Spec Kit**.

## Estado del proyecto

**Versión de cierre:** 1.0.0 candidata a entrega académica  
**Rama de estabilización y producción:** `002-estabilizacion-calidad`  
**Fecha de actualización:** 18 de julio de 2026

| Área | Estado verificado |
|---|---|
| Frontend React + Vite + CSS propio | Desplegado en Vercel y validado manualmente |
| Backend Node.js + Express | Desplegado en Render y operativo |
| Base de datos SQL Server | Migrada a AWS RDS y conectada |
| Imágenes | Cloudinary activo en producción |
| Autenticación JWT y roles | Implementados y probados |
| Validaciones e integridad | Implementadas y probadas |
| OpenAPI | 70 de 70 operaciones sincronizadas |
| Pruebas backend | 15 suites y 388 pruebas aprobadas |
| Cobertura | S 89.98 % · B 87.48 % · F 96.18 % · L 89.85 % |
| ESLint y build Vite | Aprobados |
| Auditoría npm | 0 vulnerabilidades reportadas en la evidencia de cierre |
| Rutas SPA de Vercel | Configuradas mediante `frontend/vercel.json` |
| Validación funcional en producción | Aprobada con cuentas existentes autorizadas |
| SDD | Actualizado con arquitectura, pruebas, despliegue y trazabilidad reales |

El sistema está **implementado, desplegado y validado funcionalmente en producción**. Para la entrega académica solo debe completarse el anexo visual con capturas que no expongan secretos.

## URLs de producción

- Frontend: `https://peru-app-frontend.vercel.app`
- Backend: `https://peru-app-backend.onrender.com`
- API base: `https://peru-app-backend.onrender.com/api`
- Health: `https://peru-app-backend.onrender.com/api/health`

## Arquitectura de producción

```text
Usuario / navegador
        |
        | HTTPS
        v
React 19 + Vite + CSS propio
Vercel
        |
        | HTTPS / JSON / JWT
        v
Node.js + Express
Render
        |
        +------------------------+
        |                        |
        v                        v
AWS RDS                    Cloudinary
SQL Server                 Imágenes
```

## Stack tecnológico real

### Frontend

- React 19.
- Vite.
- JavaScript.
- HTML5.
- **CSS propio**; el proyecto no utiliza Tailwind CSS.
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

### Infraestructura y calidad

- Vercel.
- Render.
- AWS RDS for SQL Server Express.
- GitHub.
- Jest y Supertest.
- Postman/Newman como recurso de pruebas API.
- Playwright como recurso E2E.
- ESLint.
- GitHub Actions.
- OpenAPI 3.0.3.
- GitHub Spec Kit.

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

Las carpetas `backend/uploads/**` se conservan vacías mediante archivos `.gitkeep`. Las imágenes de producción se almacenan en Cloudinary y sus URL HTTPS se guardan en SQL Server.

## Configuración local

### Requisitos

- Node.js `>=20.19.0`.
- npm.
- Acceso autorizado a SQL Server local o AWS RDS.
- Variables privadas configuradas en archivos `.env` no versionados.

### Backend

```powershell
cd C:\Users\ACER\OneDrive\Desktop\PERU_APP_FINAL\backend
Copy-Item .env.example .env
npm ci
npm run db:config:check
npm run dev
```

Variables principales, sin valores secretos:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URLS=http://localhost:5173

DB_SERVER=<servidor>
DB_DATABASE=PeruDepartamentosDB
DB_USER=<usuario>
DB_PASSWORD=<secreto>
DB_PORT=1433
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=true

JWT_SECRET=<secreto-largo>
JWT_EXPIRE=1d

IMAGE_STORAGE=cloudinary
CLOUDINARY_CLOUD_NAME=<valor>
CLOUDINARY_API_KEY=<valor>
CLOUDINARY_API_SECRET=<secreto>
CLOUDINARY_FOLDER=peru-app/production
```

### Frontend

```powershell
cd C:\Users\ACER\OneDrive\Desktop\PERU_APP_FINAL\frontend
Copy-Item .env.example .env
npm ci
npm run dev
```

Variable local:

```env
VITE_API_URL=http://localhost:5000/api
```

Variable de producción en Vercel:

```env
VITE_API_URL=https://peru-app-backend.onrender.com/api
```

## Validación técnica

Backend:

```powershell
cd backend
npm test
npm run test:coverage
```

Resultado de referencia archivado:

- 15 suites aprobadas.
- 388 pruebas aprobadas.
- 363 pruebas unitarias.
- 25 pruebas de integración HTTP con persistencia simulada.
- Cobertura S 89.98 %, B 87.48 %, F 96.18 %, L 89.85 %.

Frontend:

```powershell
cd frontend
npm run lint
npm run build
```

OpenAPI:

```powershell
node scripts/check-openapi-sync.mjs
```

Resultado esperado: `Rutas reales: 70`, `Operaciones OpenAPI: 70` y sincronización `70/70`.

## Criterio sobre Newman y cuentas QA

La colección Postman/Newman se conserva como artefacto de pruebas. La última ejecución incluida en la copia auditada no se considera evidencia final porque las cuentas QA temporales habían sido eliminadas. Para evitar crear usuarios temporales en producción, la aceptación final se realizó mediante:

1. las pruebas Jest/Supertest aprobadas;
2. el reporte Playwright local archivado;
3. una validación funcional manual en producción con cuentas existentes autorizadas.

No se deben publicar credenciales reales ni volver a ejecutar `npm run qa:seed` contra producción.

## Validación funcional de producción

Se comprobó manualmente:

- apertura del frontend;
- login administrativo;
- carga de datos e imágenes desde AWS RDS y Cloudinary;
- recarga con `F5` en rutas internas;
- creación, edición y eliminación de un registro temporal;
- control de acceso administrativo;
- cierre de sesión y protección de rutas;
- ausencia de errores CORS durante el flujo validado.

El registro SDD se encuentra en `specs/002-estabilizacion-calidad/production-validation.md`.

## Documentación SDD

- Especificación funcional base: `specs/001-peru-app/`.
- Estabilización, calidad, seguridad y despliegue: `specs/002-estabilizacion-calidad/`.
- Matriz de trazabilidad: `specs/002-estabilizacion-calidad/traceability-matrix.md`.
- Revisión final: `specs/002-estabilizacion-calidad/final-review.md`.
- Índice de evidencias: `specs/002-estabilizacion-calidad/evidence-index.md`.

## Seguridad del repositorio y de la entrega

No versionar ni incluir en el ZIP entregable:

- `.env`.
- Credenciales QA locales.
- `.git`.
- `node_modules`.
- `dist` o `.vite`.
- Coberturas y reportes regenerables, salvo resúmenes académicos necesarios.
- Imágenes reales de `backend/uploads`.
- ZIP, BAK, scripts con datos personales o respaldos privados.

## Autor

**Erwin Brayam Inca Pauccara — 2026**
