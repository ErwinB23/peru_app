# Preparación de Despliegue — PERU APP

## Arquitectura objetivo

| Componente | Plataforma | Estado |
|---|---|---|
| Frontend React/Vite | Vercel Hobby | Pendiente |
| Backend Node/Express | Render Web Service | Pendiente |
| SQL Server | Azure SQL Database | Pendiente |
| Imágenes | Cloudinary | Pendiente |
| Repositorio/CI | GitHub + Actions | Implementado; validar workflow |

## Variables backend

```env
NODE_ENV=production
DB_SERVER=<servidor-azure-sql>
DB_DATABASE=PeruDepartamentosDB
DB_USER=<usuario>
DB_PASSWORD=<secreto>
DB_PORT=1433
DB_ENCRYPT=true
JWT_SECRET=<secreto-largo>
JWT_EXPIRE=1d
FRONTEND_URLS=https://<frontend>.vercel.app
CLOUDINARY_CLOUD_NAME=<valor>
CLOUDINARY_API_KEY=<valor>
CLOUDINARY_API_SECRET=<secreto>
```

## Variable frontend

```env
VITE_API_URL=https://<backend>.onrender.com/api
```

## Puerta antes de publicar

1. `node scripts/check-openapi-sync.mjs`.
2. `npm run test:coverage` en backend.
3. `npm run lint` y `npm run build` en frontend.
4. `npm audit --omit=dev` en ambos proyectos.
5. Respaldo SQL verificado.
6. Credenciales fuera de Git.

## Pruebas de humo en producción

- Health 200.
- Login de usuario y admin.
- Consulta territorial completa.
- Usuario normal administrando: 403.
- CRUD admin representativo.
- Duplicado: 409.
- Carga, reemplazo y borrado de imagen en Cloudinary.
- Logout y token inválido: 401.
- Navegación desde otro equipo y vista móvil básica.

## Optimizacion multimedia

- Implementacion preparada: imagenes Home y login convertidas a WebP.
- Implementacion preparada: video de autenticacion reducido a 720p H.264 sin audio.
- Reduccion medida del conjunto critico: 78.33 MB a 3.99 MB (94.90 %).
- Validacion local pendiente: ejecutar `scripts/block8-media-check.ps1 -Apply -RunBuild`.
