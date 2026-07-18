# Checklist — Fase 3 estable

- [x] Se restauraron las versiones conocidas de `package.json` y `package-lock.json`.
- [x] Se ejecutó `phase3-restore-stable.ps1`.
- [x] `npm install` del backend terminó con código 0.
- [x] `npm install` del frontend terminó con código 0.
- [x] La sintaxis del backend fue aprobada.
- [x] El lint del frontend fue aprobado.
- [x] El build del frontend fue aprobado.
- [x] Las auditorías quedaron guardadas como evidencia.
- [x] Se documentó la decisión de no utilizar `npm audit fix --force`.
- [ ] Reconfirmar que el backend inicia y conecta a SQL Server.
- [ ] Reconfirmar que el frontend inicia y conserva el diseño.
- [ ] Reconfirmar registro, login, perfil y cierre de sesión con las dependencias restauradas.
- [x] Se creó el commit `2af0b57`.

## Estado

**Aprobada técnicamente con riesgo aceptado temporal.** Las vulnerabilidades pendientes están registradas y se corregirán de manera individual después de estabilizar autenticación y rutas.
