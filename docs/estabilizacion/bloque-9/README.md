# Bloque 9 — Seguridad de dependencias

## Objetivo

Eliminar vulnerabilidades conocidas del árbol instalado del backend y frontend antes del despliegue, sin utilizar actualizaciones forzadas ni romper las pruebas.

## Cambios aplicados

### Backend

- `bcrypt` actualizado de 5.1.1 a 6.0.0.
- `mssql` actualizado de 10.x a 12.7.0.
- Node.js mínimo documentado: 20.19.
- Newman y su reporter HTML fueron retirados de `devDependencies` para que herramientas QA vulnerables no formen parte del árbol instalado ni del artefacto de Render.
- `npm run test:api` conserva Newman como ejecución aislada mediante `npx newman@6.2.2` y genera HTML, JSON y JUnit. La colección y el environment deben ser propios y confiables.

### Frontend

- Axios resuelto en 1.18.1 o superior compatible.
- React Router DOM resuelto en 7.18.1 o superior compatible.
- Vite resuelto en 7.3.6 o superior compatible.
- Node.js mínimo documentado: 20.19.

### CI

- GitHub Actions utiliza `npm ci`.
- Ejecuta auditoría completa y de producción.
- Ejecuta cobertura, lint y build.

## Resultado validado en copia aislada

- Backend producción: 0 vulnerabilidades.
- Backend completo: 0 vulnerabilidades.
- Frontend producción: 0 vulnerabilidades.
- Frontend completo: 0 vulnerabilidades.
- 14 suites y 376 pruebas aprobadas.
- ESLint aprobado.
- Build aprobado.

## Consideración sobre Newman

Newman no se instala como dependencia persistente. Se descarga temporalmente al ejecutar la prueba de API y no forma parte del backend desplegado. Solo debe ejecutarse con colecciones y environments controlados por el proyecto.
