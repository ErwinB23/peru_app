# Preparación de Despliegue — PERU APP

## Arquitectura objetivo

| Componente | Plataforma | Estado |
|---|---|---|
| Frontend React/Vite/CSS | Vercel Hobby | Pendiente |
| Backend Node/Express | Render Web Service | Pendiente |
| SQL Server | Azure SQL Database | Pendiente |
| Imágenes | Cloudinary | Implementado y validado localmente |
| Repositorio/CI | GitHub + Actions | Implementado; confirmar ejecución verde |

## Estado previo a Azure

- SDD cerrado localmente.
- OpenAPI 70/70.
- 388 pruebas backend aprobadas.
- Newman y Playwright sin fallos locales.
- Auditoría npm en 0.
- Multimedia optimizada.
- Cloudinary integrado.
- Base local limpia y preparada.
- `backend/uploads` sin imágenes reales.

## Ajuste obligatorio antes de Azure

El código actual debe permitir configurar:

```env
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=false
```

Ese soporte debe añadirse y probarse antes de conectar Azure SQL. No se debe documentar como implementado mientras `database.js` mantenga valores fijos locales.

## Variables previstas para Render

```env
NODE_ENV=production
PORT=10000
REQUEST_BODY_LIMIT=1mb

DB_SERVER=<servidor>.database.windows.net
DB_DATABASE=PeruDepartamentosDB
DB_USER=<usuario>
DB_PASSWORD=<secreto>
DB_PORT=1433
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=false

JWT_SECRET=<secreto-largo>
JWT_EXPIRE=1d
FRONTEND_URLS=https://<frontend>.vercel.app

IMAGE_STORAGE=cloudinary
CLOUDINARY_CLOUD_NAME=<valor>
CLOUDINARY_API_KEY=<valor>
CLOUDINARY_API_SECRET=<secreto>
CLOUDINARY_FOLDER=peru-app/production
```

## Variable prevista para Vercel

```env
VITE_API_URL=https://<backend>.onrender.com/api
```

## Orden de despliegue

1. Adaptar configuración SQL.
2. Crear respaldo/BACPAC.
3. Crear Azure SQL.
4. Importar estructura y datos limpios.
5. Probar el backend local contra Azure.
6. Desplegar Render.
7. Probar `/api/health`.
8. Desplegar Vercel.
9. Ajustar CORS definitivo.
10. Ejecutar pruebas públicas.
11. Archivar evidencias.

## Pruebas de humo

- Health 200.
- Login usuario y admin.
- Consulta territorial.
- Usuario normal administrando: 403.
- CRUD admin representativo.
- Duplicado: 409.
- Carga, reemplazo y borrado en Cloudinary.
- Logout y token inválido: 401.
- Navegación desde otro dispositivo.

## Rollback

- Conservar base local.
- Conservar BACPAC.
- Mantener rama pre-despliegue.
- Revertir commit de Render.
- Restaurar variables anteriores.
- Mantener carpeta Cloudinary de pruebas separada de producción.
