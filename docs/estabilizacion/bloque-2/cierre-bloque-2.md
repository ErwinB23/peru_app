# Cierre técnico del Bloque 2

## Objetivo

Implementar la autenticación obligatoria, revocación efectiva de sesión, autorización administrativa y seguridad HTTP esencial definida por `SPEC-002`.

## Cambios incluidos

1. El middleware JWT consulta el usuario actual en SQL Server.
2. El rol usado para autorizar se obtiene de la base de datos.
3. Los ocho GET de departamentos, provincias, distritos y ciudades requieren token.
4. Las rutas de contenido ya protegidas se conservaron sin volverlas públicas.
5. React valida la sesión guardada mediante `/api/auth/profile`.
6. Axios elimina token y usuario ante una respuesta 401 protegida.
7. Se añadió CORS por lista blanca, Helmet, límite de cuerpo y rate limit.
8. Se retiraron `/api/test-db` y `/api/debug-token`.
9. Se añadió `/api/health` con información técnica mínima.
10. Express se separó en `app.js` y `server.js` para facilitar Supertest.

## Estado SDD

El código está **implementado, pendiente de validación**. No debe marcarse como validado hasta completar el checklist y guardar evidencias de 401, 403, 200, expiración, usuario eliminado, cambio de rol, lint y build.

## Fuera de este bloque

- Validaciones centralizadas de campos.
- Mapeo completo de SQL y Multer.
- Integridad avanzada e imágenes.
- Pruebas Jest/Supertest, Newman y Playwright.
- Despliegue.
