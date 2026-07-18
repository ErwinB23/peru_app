# Bloque 12 — Cierre documental posterior a Cloudinary

## Propósito

Sincronizar el README, la Constitución, SPEC-001 y SPEC-002 con el estado real posterior a:

- optimización multimedia;
- auditoría de dependencias;
- integración de Cloudinary;
- limpieza de SQL Server;
- reinicio de identidades;
- limpieza de `backend/uploads`.

## Estado confirmado

- Frontend: React + Vite + CSS propio.
- Backend: Node.js + Express.
- Datos: SQL Server.
- Imágenes: Cloudinary.
- OpenAPI: 70/70.
- Jest/Supertest: 388/388.
- Newman: 0 fallos.
- Playwright: 0 fallos.
- Auditoría npm: 0 vulnerabilidades.
- Azure SQL, Render y Vercel: pendientes.

## Regla de honestidad

Cloudinary se considera validado localmente. No se considera validado en producción hasta repetir carga, reemplazo y eliminación desde Render.

## Próximo bloque

Adaptación de conexión cifrada y migración a Azure SQL.
