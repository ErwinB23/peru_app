# Despliegue y Preparación Operativa — PERU APP

## Arquitectura desplegada

| Componente | Plataforma | Estado |
|---|---|---|
| Frontend React/Vite/CSS | Vercel | Desplegado y validado |
| Backend Node/Express | Render Web Service | Desplegado y operativo |
| SQL Server | AWS RDS for SQL Server Express | Migrado y conectado |
| Imágenes | Cloudinary | Activo en producción |
| Repositorio | GitHub | Conectado a despliegues |
| Rama | `002-estabilizacion-calidad` | Rama usada para estabilización y producción |

## URLs

- Frontend: `https://peru-app-frontend.vercel.app`
- Backend: `https://peru-app-backend.onrender.com`
- API base: `https://peru-app-backend.onrender.com/api`
- Health: `https://peru-app-backend.onrender.com/api/health`

## Configuración de Render

- Root Directory: `backend`.
- Build Command: `npm install`.
- Start Command: `npm start`.
- Variables privadas administradas en Render.
- Conectividad de salida autorizada en el grupo de seguridad de AWS RDS.

Variables esperadas, sin valores reales:

```env
NODE_ENV=production
PORT=<asignado-por-render>
REQUEST_BODY_LIMIT=1mb

DB_SERVER=<endpoint-rds>
DB_DATABASE=PeruDepartamentosDB
DB_USER=<usuario-aplicacion>
DB_PASSWORD=<secreto>
DB_PORT=1433
DB_INSTANCE=
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=true

JWT_SECRET=<secreto-largo>
JWT_EXPIRE=1d
FRONTEND_URLS=https://peru-app-frontend.vercel.app

IMAGE_STORAGE=cloudinary
CLOUDINARY_CLOUD_NAME=<valor>
CLOUDINARY_API_KEY=<valor>
CLOUDINARY_API_SECRET=<secreto>
CLOUDINARY_FOLDER=peru-app/production
```

## Configuración de Vercel

- Root Directory: `frontend`.
- Framework preset: Vite.
- Rama de producción: `002-estabilizacion-calidad`.
- Variable:

```env
VITE_API_URL=https://peru-app-backend.onrender.com/api
```

La reescritura SPA se define en `frontend/vercel.json` para que las rutas React carguen `index.html` al abrirse directamente o presionar `F5`.

## Configuración de AWS RDS

- Motor SQL Server Express.
- Base `PeruDepartamentosDB`.
- Puerto 1433.
- Acceso limitado por grupo de seguridad.
- No se utiliza `0.0.0.0/0`.
- Se autoriza la IP local vigente y los rangos de salida necesarios de Render.

## Validaciones completadas

| Validación | Resultado |
|---|---|
| Health del backend | Operativo durante la validación final |
| Conexión Render → AWS RDS | Aprobada |
| Frontend → API Render | Aprobada |
| CORS | Aprobado con dominio definitivo |
| Login administrativo | Aprobado |
| Lectura de datos e imágenes | Aprobada |
| CRUD temporal | Aprobado |
| Carga y eliminación de imagen | Aprobada |
| Restricción de usuario no admin | Aprobada |
| Logout y ruta protegida | Aprobados |
| Recarga SPA | Aprobada |

## Decisión sobre pruebas QA

No se crearán nuevas cuentas QA en producción. Newman queda como herramienta disponible y evidencia histórica, pero no como puerta final de despliegue. La aceptación se apoya en Jest/Supertest, Playwright local archivado y prueba funcional manual.

## Rollback

1. Identificar el último commit estable.
2. Revertir o restaurar ese commit en `002-estabilizacion-calidad`.
3. Confirmar el redeploy automático de Render y Vercel.
4. Restaurar variables anteriores cuando el problema sea de configuración.
5. Restaurar la base desde backup si existe corrupción o pérdida.
6. Verificar `/api/health`, login y CRUD después del rollback.

## Estado final

La infraestructura está lista para entrega académica. El único pendiente documental es adjuntar las capturas finales sin exponer secretos.
