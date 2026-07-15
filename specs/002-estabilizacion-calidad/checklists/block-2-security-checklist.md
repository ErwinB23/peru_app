# Checklist de Seguridad — Bloque 2

## Código

- [x] El JWT se verifica con la configuración centralizada.
- [x] El usuario se consulta en SQL Server en cada solicitud protegida.
- [x] El rol utilizado por `isAdmin` proviene de SQL Server.
- [x] Los ocho GET territoriales usan `verifyToken`.
- [x] Los GET turísticos y gastronómicos mantienen `verifyToken`.
- [x] Los CRUD administrativos mantienen `verifyToken` e `isAdmin`.
- [x] `AuthContext` valida `/api/auth/profile` al cargar.
- [x] Axios limpia la sesión ante 401 de una ruta protegida.
- [x] CORS usa una lista de orígenes autorizados.
- [x] Helmet está habilitado.
- [x] Login y registro tienen rate limit.
- [x] `/api/test-db` y `/api/debug-token` fueron retirados.
- [x] `/api/health` no expone nombres ni credenciales de SQL Server.
- [x] `app.js` se separó de `server.js` para pruebas posteriores.

## Verificación local pendiente

- [ ] `npm install` del backend finaliza correctamente.
- [ ] Backend inicia y `/api/health` responde 200.
- [ ] GET territorial sin token responde 401.
- [ ] Token inválido responde 401.
- [ ] Usuario normal puede consultar y recibe 403 al administrar.
- [ ] Administrador puede administrar.
- [ ] Un usuario eliminado pierde acceso con su token anterior.
- [ ] Un administrador degradado pierde permisos con su token anterior.
- [ ] Recargar el frontend conserva una sesión válida.
- [ ] Un token vencido limpia la sesión y redirige al login.
- [ ] Un origen no autorizado es rechazado.
- [ ] `/api/test-db` y `/api/debug-token` responden 404.
- [ ] `npm run lint` del frontend finaliza sin errores.
- [ ] `npm run build` del frontend finaliza sin errores.
