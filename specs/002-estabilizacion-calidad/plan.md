# Plan Técnico de Cierre y Despliegue — PERU APP

## 1. Identificación

- **Código:** PLAN-002
- **Especificación:** SPEC-002
- **Rama:** `002-estabilizacion-calidad`
- **Estado:** ejecutado y cerrado técnicamente
- **Fecha:** 18 de julio de 2026

## 2. Estrategia ejecutada

La estabilización se realizó por incrementos verificables. Cada bloque actualizó código, pruebas y artefactos SDD. Durante la ejecución se seleccionó AWS RDS como base de datos administrada definitiva, conservando el motor SQL Server y el modelo relacional.

## 3. Arquitectura definitiva

```text
Usuario
  |
  v
Vercel: React + Vite + CSS propio
  |
  v
Render: Node.js + Express
  |
  +--> AWS RDS: SQL Server Express
  |
  +--> Cloudinary: imágenes
```

- El frontend usa `VITE_API_URL=https://peru-app-backend.onrender.com/api`.
- El backend usa CORS por lista de orígenes configurados.
- La base se conecta por endpoint y puerto, sin instancia nombrada.
- Producción usa `IMAGE_STORAGE=cloudinary`.
- `frontend/vercel.json` reescribe las rutas SPA hacia `index.html`.

## 4. Bloques ejecutados

| Bloque | Resultado |
|---|---|
| 1 | Auditoría de estructura, SDD y trazabilidad. |
| 2 | JWT, rol vigente, rutas protegidas, CORS, Helmet y health. |
| 3 | Validación central y errores HTTP uniformes. |
| 4 | Integridad SQL y ciclo de imágenes. |
| 5 | Jest/Supertest, Postman/Newman, Playwright y CI. |
| 5.1 | Cobertura estratégica de componentes críticos. |
| 5.2 | Cobertura ampliada de módulos funcionales. |
| 6 | OpenAPI 70/70 y puerta de cierre SDD. |
| 7 | Limpieza de estructura del repositorio. |
| 8 | Optimización multimedia. |
| 9 | Actualización segura de dependencias y auditoría. |
| 10 | Preparación de almacenamiento y despliegue cloud. |
| 11 | Integración de Cloudinary. |
| 12 | Cierre documental previo al despliegue. |
| 13 | Migración a AWS RDS. |
| 14 | Despliegue del backend en Render. |
| 15 | Despliegue del frontend en Vercel. |
| 16 | CORS definitivo, reescritura SPA y validación funcional. |
| 17 | Actualización final del SDD. |

## 5. Puertas de calidad

### QG-01 — Coherencia SDD

SPEC-001 mantiene el comportamiento funcional y SPEC-002 registra estabilización, seguridad, calidad y despliegue real.

### QG-02 — Backend

- 15 suites aprobadas.
- 388 pruebas aprobadas.
- 363 unitarias y 25 de integración HTTP con persistencia simulada.
- Cobertura S89.98/B87.48/F96.18/L89.85.

### QG-03 — Frontend

- ESLint aprobado.
- Build Vite aprobado.
- Reporte Playwright local archivado: 4 flujos, 0 fallos.
- Rutas SPA validadas en Vercel con recarga directa.

### QG-04 — API

- 70 rutas reales.
- 70 operaciones OpenAPI.
- Health público disponible.
- Contrato de errores diferenciado.

### QG-05 — Dependencias

- Locks reproducibles.
- Auditorías sin vulnerabilidades reportadas en la evidencia de cierre.

### QG-06 — Datos e imágenes

- AWS RDS conectado.
- Cloudinary activo en producción.
- URL HTTPS persistida en SQL Server.
- Creación, edición y eliminación temporal comprobadas.

### QG-07 — Producción

- Vercel, Render, AWS RDS y Cloudinary integrados.
- CORS configurado con el dominio definitivo.
- Login, consulta, CRUD, roles, logout y recarga SPA aprobados manualmente.

## 6. Secuencia de despliegue ejecutada

1. Limpieza y respaldo de la base local.
2. Creación de AWS RDS for SQL Server Express.
3. Migración de estructura y datos necesarios.
4. Parametrización de cifrado, certificado, endpoint y puerto.
5. Autorización de conectividad desde el equipo local y Render.
6. Configuración de Cloudinary para producción.
7. Despliegue del backend en Render.
8. Validación de `/api/health`.
9. Despliegue del frontend en Vercel.
10. Configuración de `VITE_API_URL`.
11. Configuración de CORS definitivo.
12. Configuración de la rama de producción.
13. Adición de reescritura SPA mediante `frontend/vercel.json`.
14. Validación funcional manual.
15. Actualización del SDD.

## 7. Estrategia de rollback

- Conservar respaldos SQL privados fuera de Git.
- Mantener un commit estable en `002-estabilizacion-calidad`.
- Revertir el commit defectuoso y volver a desplegar Render/Vercel.
- Restaurar variables de entorno anteriores desde el proveedor.
- Restaurar una copia de AWS RDS según la política de respaldo configurada.
- Mantener el modo local de imágenes solo como contingencia de desarrollo.
- No eliminar recursos Cloudinary hasta confirmar la transacción SQL.

## 8. Riesgos residuales aceptados

| Riesgo | Tratamiento |
|---|---|
| Arranque en frío de Render | Health y reintento controlado; documentado como limitación de plataforma. |
| JWT en `localStorage` | Mantener protección XSS; migración a cookie HttpOnly queda como mejora futura. |
| `DB_TRUST_SERVER_CERTIFICATE=true` | Configuración funcional actual; revisar endurecimiento TLS en una versión posterior. |
| Bundle principal grande | No bloquea entrega; aplicar lazy loading como mejora de rendimiento. |
| Transacciones parciales | Priorizar operaciones múltiples críticas en una versión posterior. |
| Sin staging dedicado | Pruebas destructivas no se ejecutan contra producción; usar datos temporales controlados. |
| Newman final omitido | No crear cuentas QA en producción; sustentar aceptación con Jest/Supertest y prueba manual. |

## 9. Criterio de finalización

El plan se considera finalizado porque Vercel, Render, AWS RDS y Cloudinary funcionan de forma integrada; las pruebas técnicas principales están aprobadas; la validación funcional de producción fue completada; y el SDD refleja el estado real del sistema.
