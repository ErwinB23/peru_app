# Especificación de Estabilización, Calidad y Seguridad — PERU APP

## 1. Identificación

- **Código:** SPEC-002
- **Rama:** `002-estabilizacion-calidad`
- **Estado:** implementada y aprobada para puerta de despliegue; aceptación en producción pendiente
- **Fecha de cierre documental:** 15 de julio de 2026
- **Especificación base:** `specs/001-peru-app/spec.md`
- **Constitución:** `.specify/memory/constitution.md` v1.3.0

## 2. Propósito

Estabilizar PERU APP sin rediseñar su identidad visual, garantizando autenticación obligatoria, autorización por rol vigente, datos válidos, errores HTTP uniformes, integridad territorial, manejo seguro de imágenes, pruebas repetibles y trazabilidad SDD antes del despliegue.

## 3. Alcance cerrado

1. Autenticación JWT y sesión validada contra SQL Server.
2. Protección de todas las rutas funcionales.
3. Roles `usuario` y `admin` aplicados en backend y frontend.
4. Validaciones centralizadas y normalización de datos.
5. Respuestas 400, 401, 403, 404, 409, 413, 415 y 500.
6. Integridad SQL, duplicados, relaciones y restricciones básicas.
7. Ciclo de vida local de imágenes y validación de firma.
8. Pruebas unitarias, integración HTTP, API y E2E.
9. OpenAPI sincronizado con 70 operaciones reales.
10. Evidencia, trazabilidad y puerta de despliegue.

## 4. Actores

| Actor | Capacidades |
|---|---|
| Usuario no autenticado | Registro, login y health check técnico. |
| Usuario autenticado | Perfil y consulta territorial, turística y gastronómica. |
| Administrador | Capacidades de usuario más CRUD y administración de usuarios. |
| Equipo QA | Ejecución repetible con cuentas QA no personales. |

## 5. Requisitos funcionales y estado

| ID | Requisito | Estado pre-despliegue |
|---|---|---|
| RF-EST-001 | Solo registro y login son públicos como funciones de negocio. | Validado |
| RF-EST-002 | Toda ruta funcional restante exige JWT válido. | Validado |
| RF-EST-003 | El middleware comprueba que el usuario del token aún existe. | Validado |
| RF-EST-004 | La autorización utiliza el rol actual de SQL Server. | Validado |
| RF-EST-005 | El frontend valida sesión mediante `GET /auth/profile`. | Implementado; evidencia E2E debe archivarse |
| RF-EST-006 | Una respuesta 401 limpia sesión y redirige al login. | Implementado; evidencia E2E debe archivarse |
| RF-EST-007 | El usuario normal recibe 403 al administrar. | Validado |
| RF-EST-008 | Login y registro tienen rate limit. | Implementado; prueba 429 pendiente |
| RF-EST-009 | Datos validados y normalizados antes de SQL Server. | Validado |
| RF-EST-010 | Los errores de validación identifican campos. | Validado |
| RF-EST-011 | Estados HTTP diferenciados y predecibles. | Validado |
| RF-EST-012 | Errores centralizados sin detalles internos. | Validado |
| RF-EST-013 | Cambios de integridad versionados mediante migraciones. | Implementado; conservar evidencia SSMS |
| RF-EST-014 | SQL Server rechaza áreas, poblaciones y coordenadas inválidas. | Implementado; conservar evidencia SSMS |
| RF-EST-015 | Eliminaciones con relaciones producen conflicto controlado. | Validado en código/pruebas; evidencia SQL recomendada |
| RF-EST-016 | Operaciones múltiples críticas usan transacciones. | Pendiente justificado; mejora posterior |
| RF-EST-017 | Imágenes validadas por tamaño, MIME y firma. | Validado |
| RF-EST-018 | Archivos nuevos se limpian cuando una operación falla. | Validado |
| RF-EST-019 | Imágenes sustituidas o asociadas se retiran tras confirmar SQL. | Validado |
| RF-EST-020 | Publicación local de imágenes centralizada. | Validado local; Cloudinary pendiente para producción |
| RF-EST-021 | OpenAPI refleja rutas, parámetros, seguridad y respuestas. | Validado: 70/70 operaciones |
| RF-EST-022 | Requisitos, código, endpoints y pruebas están trazados. | Validado documentalmente |
| RF-EST-023 | Backend con pruebas unitarias e integración repetibles. | Validado: 14 suites, 376 casos en validación de referencia |
| RF-EST-024 | Colección Postman ejecutable mediante Newman. | Implementado; archivar reporte local/producción |
| RF-EST-025 | Frontend con pruebas Playwright de flujos críticos. | Implementado; archivar reporte local/producción |
| RF-EST-026 | Listas extensas soportan paginación donde fue priorizado. | Parcial: distritos y ciudades |
| RF-EST-027 | Multimedia optimizada sin cambio visual. | Pendiente antes del despliegue final |
| RF-EST-028 | Endpoints de depuración eliminados; health restringido. | Validado |

## 6. Requisitos no funcionales

- **RNF-EST-001 Seguridad:** denegación por defecto y secretos fuera de Git.
- **RNF-EST-002 Integridad:** claves, restricciones y conflictos preservan relaciones.
- **RNF-EST-003 Mantenibilidad:** arquitectura por capas y validadores reutilizables.
- **RNF-EST-004 Compatibilidad:** React/Vite en navegadores modernos.
- **RNF-EST-005 Usabilidad:** errores visibles y sesión expirada comprensible.
- **RNF-EST-006 Rendimiento:** build válido; optimización multimedia pendiente.
- **RNF-EST-007 Trazabilidad:** matriz final y evidencias por bloque.
- **RNF-EST-008 Regresión:** Jest, Supertest, Newman, Playwright, lint y build.

## 7. Criterios de aceptación pre-despliegue

1. `npm run test:coverage` supera S80/B70/F85/L80.
2. Los módulos principales forman parte de la medición global.
3. `npm run lint` y `npm run build` finalizan correctamente.
4. `node scripts/check-openapi-sync.mjs` informa 70/70 operaciones.
5. No existen `.env`, respaldos o credenciales QA en el commit.
6. Los pendientes de Cloudinary, Azure SQL, Render y Vercel están declarados.

## 8. Fuera de alcance del cierre

- Rediseño visual completo.
- Reservas, pagos o comercio electrónico.
- Cobertura del 100% como requisito.
- Carga de los 25 ámbitos departamentales antes de validar producción.
- Sustitución del stack React/Express/SQL Server.

## 9. Resultado esperado

El cierre de SPEC-002 autoriza iniciar el despliegue controlado. El proyecto solo se declarará **aceptado en producción** después de validar Azure SQL, Cloudinary, Render y Vercel con pruebas de humo y evidencias públicas.
