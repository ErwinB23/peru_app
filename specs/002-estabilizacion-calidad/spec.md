# Especificación de Estabilización, Calidad y Seguridad — PERU APP

## 1. Identificación

- **Código:** SPEC-002
- **Rama:** `002-estabilizacion-calidad`
- **Estado:** implementada y validada localmente; infraestructura pública pendiente
- **Fecha de cierre post-Cloudinary:** 18 de julio de 2026
- **Especificación base:** `specs/001-peru-app/spec.md`
- **Constitución:** `.specify/memory/constitution.md` v1.4.0

## 2. Propósito

Estabilizar PERU APP sin rediseñar su identidad visual, garantizando autenticación obligatoria, autorización por rol vigente, datos válidos, errores HTTP uniformes, integridad territorial, almacenamiento persistente de imágenes, pruebas repetibles y trazabilidad SDD antes del despliegue.

## 3. Alcance cerrado localmente

1. Autenticación JWT y sesión validada contra SQL Server.
2. Protección de todas las rutas funcionales.
3. Roles `usuario` y `admin` aplicados en backend y frontend.
4. Validaciones centralizadas y normalización de datos.
5. Respuestas 400, 401, 403, 404, 409, 413, 415 y 500.
6. Integridad SQL, duplicados, relaciones y restricciones básicas.
7. Validación de imágenes por tamaño, MIME y firma.
8. Ciclo de vida local y remoto de imágenes.
9. Cloudinary integrado como almacenamiento persistente.
10. Pruebas unitarias, integración HTTP, API y E2E.
11. OpenAPI sincronizado con 70 operaciones reales.
12. Auditoría de dependencias sin vulnerabilidades reportadas.
13. Optimización de imágenes estáticas y video.
14. Línea base de datos limpia con identidades reiniciadas.
15. Evidencia, trazabilidad y puerta de despliegue.

## 4. Actores

| Actor | Capacidades |
|---|---|
| Usuario no autenticado | Registro, login y health check técnico. |
| Usuario autenticado | Perfil y consulta territorial, turística y gastronómica. |
| Administrador | Capacidades de usuario más CRUD y administración de usuarios. |
| Equipo QA | Ejecución repetible con cuentas QA no personales. |

## 5. Requisitos funcionales y estado

| ID | Requisito | Estado |
|---|---|---|
| RF-EST-001 | Solo registro y login son públicos como funciones de negocio. | Validado |
| RF-EST-002 | Toda ruta funcional restante exige JWT válido. | Validado |
| RF-EST-003 | El middleware comprueba que el usuario del token aún existe. | Validado |
| RF-EST-004 | La autorización utiliza el rol actual de SQL Server. | Validado |
| RF-EST-005 | El frontend valida sesión mediante `GET /auth/profile`. | Validado mediante Playwright |
| RF-EST-006 | Una respuesta 401 limpia sesión y redirige al login. | Validado mediante Playwright |
| RF-EST-007 | El usuario normal recibe 403 al administrar. | Validado |
| RF-EST-008 | Login y registro tienen rate limit. | Implementado; prueba 429 específica pendiente |
| RF-EST-009 | Datos validados y normalizados antes de SQL Server. | Validado |
| RF-EST-010 | Los errores de validación identifican campos. | Validado |
| RF-EST-011 | Estados HTTP diferenciados y predecibles. | Validado |
| RF-EST-012 | Errores centralizados sin detalles internos. | Validado |
| RF-EST-013 | Cambios de integridad versionados mediante migraciones. | Implementado |
| RF-EST-014 | SQL Server rechaza áreas, poblaciones y coordenadas inválidas. | Implementado y probado |
| RF-EST-015 | Eliminaciones con relaciones producen conflicto controlado. | Validado |
| RF-EST-016 | Operaciones múltiples críticas usan transacciones. | Pendiente justificado; mejora posterior |
| RF-EST-017 | Imágenes validadas por tamaño, MIME y firma. | Validado |
| RF-EST-018 | Recursos nuevos se limpian cuando una operación falla. | Validado |
| RF-EST-019 | Imágenes sustituidas o asociadas se retiran tras confirmar SQL. | Validado |
| RF-EST-020 | Imágenes de producción se almacenan en Cloudinary y SQL guarda URL HTTPS. | Validado localmente; repetir en Render |
| RF-EST-021 | OpenAPI refleja rutas, parámetros, seguridad y respuestas. | Validado: 70/70 |
| RF-EST-022 | Requisitos, código, endpoints y pruebas están trazados. | Validado |
| RF-EST-023 | Backend con pruebas unitarias e integración repetibles. | Validado: 15 suites y 388 casos |
| RF-EST-024 | Colección Postman ejecutable mediante Newman. | Validado localmente: 11 solicitudes y 0 fallos |
| RF-EST-025 | Frontend con pruebas Playwright de flujos críticos. | Validado localmente: 4 flujos y 0 fallos |
| RF-EST-026 | Listas extensas soportan paginación donde fue priorizado. | Parcial: distritos y ciudades |
| RF-EST-027 | Multimedia optimizada sin cambio funcional. | Validado: reducción del conjunto crítico y build aprobado |
| RF-EST-028 | Endpoints de depuración eliminados; health mínimo. | Validado |

## 6. Requisitos no funcionales

- **RNF-EST-001 Seguridad:** denegación por defecto y secretos fuera de Git.
- **RNF-EST-002 Integridad:** claves, restricciones y conflictos preservan relaciones.
- **RNF-EST-003 Mantenibilidad:** arquitectura por capas y validadores reutilizables.
- **RNF-EST-004 Compatibilidad:** React/Vite y CSS propio en navegadores modernos.
- **RNF-EST-005 Usabilidad:** errores visibles y sesión expirada comprensible.
- **RNF-EST-006 Rendimiento:** multimedia optimizada y build válido.
- **RNF-EST-007 Persistencia:** Cloudinary evita depender del disco efímero de Render.
- **RNF-EST-008 Trazabilidad:** matriz y evidencias por bloque.
- **RNF-EST-009 Regresión:** Jest, Supertest, Newman, Playwright, lint y build.
- **RNF-EST-010 Dependencias:** auditoría productiva y completa sin vulnerabilidades reportadas.

## 7. Estado de la línea base de datos

La estructura de `PeruDepartamentosDB` se conserva. Los registros de prueba fueron eliminados y los campos `IDENTITY` fueron reiniciados para que la nueva carga comience desde ID 1. El procedimiento está versionado en:

```text
database/maintenance/012-limpiar-datos-y-reiniciar-identities.sql
```

La migración a Azure SQL permanece pendiente.

## 8. Criterios de aceptación previos a infraestructura cloud

1. `npm run test:coverage` supera S80/B70/F85/L80.
2. Los módulos principales forman parte de la medición global.
3. `npm run lint` y `npm run build` finalizan correctamente.
4. OpenAPI informa 70/70 operaciones.
5. Newman y Playwright no presentan fallos locales.
6. Auditorías npm productivas y completas reportan 0 vulnerabilidades.
7. Cloudinary acepta cargas y SQL Server conserva URL HTTPS.
8. `backend/uploads` no contiene imágenes reales.
9. No existen secretos, ZIP o respaldos en el commit.

## 9. Fuera de alcance

- Rediseño visual completo.
- Reservas, pagos o comercio electrónico.
- Cobertura del 100 % como requisito.
- Carga completa de información nacional antes de validar producción.
- Sustitución del stack React/Express/SQL Server.
- Transacciones avanzadas no requeridas por el flujo actual.

## 10. Resultado

SPEC-002 autoriza iniciar Azure SQL, Render y Vercel. La aplicación solo se declarará **aceptada en producción** después de validar URLs públicas, cifrado SQL, CORS definitivo, login, roles, CRUD, imágenes Cloudinary y pruebas de humo.
