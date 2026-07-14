# Fase 2 — Configuración y entorno unificados

## Objetivo

Centralizar y validar la configuración del backend y del frontend sin modificar el diseño visual ni la lógica funcional del sistema.

## Cambios aplicados

- Se agregó `backend/src/config/env.js` como fuente central de variables de entorno.
- Se corrigió el nombre de la base de datos en `backend/.env.example`.
- Se incorporaron `JWT_EXPIRE`, `FRONTEND_URL`, `DB_INSTANCE` y `DB_PORT` documentados.
- Se eliminó la impresión del usuario de base de datos en la consola.
- Se eliminó la publicación duplicada de `/uploads`.
- `authService.js` reutiliza la instancia central de Axios.
- Se corrigió y simplificó el `.gitignore` raíz.
- Se agregó un script de validación reproducible para la fase.

## Criterios de aceptación

- El backend conserva su sintaxis válida.
- El frontend supera ESLint.
- El frontend genera el build de producción.
- Registro, login y perfil continúan funcionando.
- El diseño visual no cambia.
