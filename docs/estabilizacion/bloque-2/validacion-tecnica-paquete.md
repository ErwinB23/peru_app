# Validación técnica del paquete Bloque 2

## Comprobaciones realizadas antes de entregar

- Todos los archivos JavaScript del backend superaron `node --check`.
- No quedaron rutas GET funcionales sin `verifyToken` dentro de `backend/src/routes`.
- No quedaron referencias a `/api/test-db` ni `/api/debug-token` dentro de `backend/src`.
- El frontend superó `npm run lint`.
- El frontend superó `npm run build` con Vite.
- `package.json` y `package-lock.json` contienen `helmet` y `express-rate-limit`.

## Comprobaciones que deben ejecutarse en el equipo del proyecto

- Inicio real del backend con la instalación nativa de `bcrypt` de Windows.
- Conexión real a SQL Server.
- Casos 401, 403 y 200.
- Usuario eliminado y cambio de rol con token previo.
- Expiración y redirección del frontend.
- CORS desde el origen real.

El paquete está verificado estáticamente y compilado en frontend, pero el estado SDD correcto continúa siendo **implementado, pendiente de validación local**.
