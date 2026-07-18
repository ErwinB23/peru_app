# Checklist — Seguridad de dependencias

- [x] Dependencias de producción separadas de las herramientas de desarrollo.
- [x] Backend auditado con `npm audit --omit=dev`.
- [x] Frontend auditado con `npm audit --omit=dev`.
- [x] Auditoría completa ejecutada en ambos proyectos.
- [x] `bcrypt` actualizado de manera controlada.
- [x] `mssql` actualizado de manera controlada.
- [x] Axios, React Router DOM y Vite resueltos en versiones corregidas.
- [x] Newman retirado del árbol persistente e invocado como herramienta QA aislada.
- [x] No se utilizó `npm audit fix --force`.
- [x] Jest y Supertest aprobados después de actualizar.
- [x] ESLint aprobado después de actualizar.
- [x] Build de producción aprobado después de actualizar.
- [ ] Evidencia generada en la computadora del desarrollador mediante `block9-dependency-security.ps1`.
- [ ] GitHub Actions confirmado en verde después del push.
