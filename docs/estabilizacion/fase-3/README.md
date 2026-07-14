# Fase 3 — Dependencias estables

## Decisión técnica

Se descarta la actualización masiva de dependencias porque produjo errores en el entorno local. Se restaura la combinación de versiones conocida por funcionar y se registra `npm audit` como control informativo.

## Alcance

- Restauración de `package.json` y `package-lock.json`.
- Instalación no destructiva mediante `npm install`.
- Verificación de sintaxis del backend.
- Verificación de lint y build del frontend.
- Registro de auditorías sin detener el flujo.

## Riesgo aceptado temporalmente

Pueden permanecer advertencias o vulnerabilidades de dependencias. No se ignoran: quedan registradas y serán tratadas individualmente después de estabilizar autenticación, rutas y datos.

## Prohibiciones

- No ejecutar `npm audit fix --force`.
- No actualizar todas las dependencias simultáneamente.
- No borrar código funcional para satisfacer una actualización.
