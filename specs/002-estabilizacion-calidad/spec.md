# Especificación de Estabilización, Calidad, Seguridad y Despliegue — PERU APP

## 1. Identificación

- **Código:** SPEC-002
- **Rama:** `002-estabilizacion-calidad`
- **Estado:** implementada, desplegada y validada funcionalmente
- **Fecha de cierre:** 18 de julio de 2026
- **Especificación base:** `specs/001-peru-app/spec.md`
- **Constitución:** `.specify/memory/constitution.md` v1.4.0
- **Versión candidata:** 1.0.0

## 2. Propósito

Estabilizar y desplegar PERU APP sin alterar su identidad visual, garantizando autenticación obligatoria, autorización por rol vigente, datos válidos, errores HTTP uniformes, integridad territorial, almacenamiento persistente de imágenes, pruebas repetibles, despliegue cloud y trazabilidad SDD.

## 3. Alcance implementado

1. Autenticación JWT y validación de la sesión contra SQL Server.
2. Protección de todas las rutas funcionales.
3. Roles `usuario` y `admin` aplicados en backend y frontend.
4. Validaciones centralizadas y normalización de datos.
5. Respuestas HTTP 400, 401, 403, 404, 409, 413, 415 y 500.
6. Integridad SQL mediante claves, índices y restricciones.
7. Validación de imágenes por tamaño, MIME, extensión y firma binaria.
8. Ciclo de vida local y remoto de imágenes.
9. Cloudinary como almacenamiento persistente de producción.
10. Pruebas unitarias e integración HTTP con Jest y Supertest.
11. Artefactos Postman/Newman y Playwright conservados para trazabilidad.
12. OpenAPI sincronizado con 70 operaciones Express.
13. Auditoría de dependencias sin vulnerabilidades reportadas en el cierre.
14. Optimización de multimedia estática.
15. Migración de SQL Server local a AWS RDS for SQL Server Express.
16. Backend desplegado en Render.
17. Frontend desplegado en Vercel.
18. CORS definitivo y variable `VITE_API_URL` configurados.
19. Reescritura SPA de Vercel para recarga directa de rutas React.
20. Validación funcional manual de producción.
21. Evidencia y matriz de trazabilidad SDD.

## 4. Actores

| Actor | Capacidades |
|---|---|
| Usuario no autenticado | Registro, login y consulta del health técnico. |
| Usuario autenticado | Perfil y consulta territorial, turística y gastronómica. |
| Administrador | Capacidades de usuario más CRUD y administración de usuarios. |
| Responsable de pruebas | Ejecuta pruebas automatizadas locales y validación funcional controlada. |
| Plataformas cloud | Vercel sirve el frontend; Render ejecuta la API; AWS RDS persiste datos; Cloudinary persiste imágenes. |

## 5. Requisitos funcionales y estado

| ID | Requisito | Estado final |
|---|---|---|
| RF-EST-001 | Solo registro, login y health son públicos. | Validado |
| RF-EST-002 | Toda ruta funcional restante exige JWT válido. | Validado |
| RF-EST-003 | El middleware comprueba que el usuario del token aún existe. | Validado |
| RF-EST-004 | La autorización utiliza el rol vigente de SQL Server. | Validado |
| RF-EST-005 | El frontend valida sesión mediante `GET /auth/profile`. | Validado |
| RF-EST-006 | Una respuesta 401 limpia sesión y redirige al acceso. | Validado |
| RF-EST-007 | Un usuario normal recibe 403 al intentar administrar. | Validado |
| RF-EST-008 | Login y registro tienen rate limiting. | Implementado y cubierto por inspección/pruebas base |
| RF-EST-009 | Los datos se validan y normalizan antes de SQL Server. | Validado |
| RF-EST-010 | Los errores de validación identifican campos. | Validado |
| RF-EST-011 | Los estados HTTP son diferenciados y predecibles. | Validado |
| RF-EST-012 | Los errores se centralizan sin exponer detalles internos. | Validado |
| RF-EST-013 | Los cambios de integridad se versionan mediante SQL de migración. | Implementado |
| RF-EST-014 | SQL Server rechaza áreas, poblaciones y coordenadas inválidas. | Validado |
| RF-EST-015 | Las eliminaciones con relaciones producen conflicto controlado. | Validado |
| RF-EST-016 | Operaciones SQL múltiples críticas utilizan transacciones. | Parcial; deuda técnica controlada |
| RF-EST-017 | Las imágenes se validan por tamaño, MIME y firma. | Validado |
| RF-EST-018 | Los recursos nuevos se limpian cuando la operación falla. | Validado |
| RF-EST-019 | Las imágenes sustituidas o eliminadas se retiran tras confirmar SQL. | Validado |
| RF-EST-020 | Producción almacena imágenes en Cloudinary y SQL guarda URL HTTPS. | Validado en producción |
| RF-EST-021 | OpenAPI refleja rutas, parámetros, seguridad y respuestas. | Validado 70/70 |
| RF-EST-022 | Requisitos, diseño, código, pruebas y evidencias están trazados. | Validado |
| RF-EST-023 | El backend dispone de pruebas unitarias e integración repetibles. | Validado: 15 suites y 388 pruebas |
| RF-EST-024 | Existe una colección Postman/Newman para pruebas API. | Implementada; rerun final omitido por eliminación de cuentas QA |
| RF-EST-025 | Existen flujos Playwright para casos críticos. | Validado localmente: 4 flujos y 0 fallos archivados |
| RF-EST-026 | Listas extensas soportan paginación donde fue priorizado. | Parcial: distritos y ciudades |
| RF-EST-027 | La multimedia se optimiza sin cambiar funciones. | Validado |
| RF-EST-028 | Los endpoints de depuración se eliminan y existe health mínimo. | Validado |
| RF-EST-029 | El backend utiliza AWS RDS mediante endpoint y puerto configurables. | Validado |
| RF-EST-030 | Render ejecuta el backend y expone la API mediante HTTPS. | Validado |
| RF-EST-031 | Vercel sirve el frontend y consume la API de Render. | Validado |
| RF-EST-032 | CORS admite únicamente los orígenes expresamente configurados. | Validado |
| RF-EST-033 | Las rutas React se recargan sin 404 de Vercel. | Validado mediante reescritura SPA |
| RF-EST-034 | Un flujo CRUD temporal confirma persistencia en AWS RDS y Cloudinary. | Validado manualmente |

## 6. Requisitos no funcionales

- **RNF-EST-001 Seguridad:** denegación por defecto, secretos fuera de Git y variables privadas en proveedores.
- **RNF-EST-002 Integridad:** claves, restricciones y conflictos preservan relaciones.
- **RNF-EST-003 Mantenibilidad:** arquitectura por capas, validadores y servicios reutilizables.
- **RNF-EST-004 Compatibilidad:** React/Vite con CSS propio en navegadores modernos.
- **RNF-EST-005 Usabilidad:** errores visibles y sesión expirada comprensible.
- **RNF-EST-006 Rendimiento:** multimedia optimizada y build Vite aprobado; la división futura del bundle es una mejora no bloqueante.
- **RNF-EST-007 Persistencia:** AWS RDS evita dependencia de una base local y Cloudinary evita el disco efímero de Render.
- **RNF-EST-008 Trazabilidad:** matriz y evidencias vinculan requisito, implementación, prueba y resultado.
- **RNF-EST-009 Regresión:** Jest, Supertest, lint, build, OpenAPI y validación funcional.
- **RNF-EST-010 Dependencias:** instalación reproducible mediante `package-lock.json` y auditorías registradas.
- **RNF-EST-011 Disponibilidad:** health técnico permite verificar API, base de datos y almacenamiento activo.
- **RNF-EST-012 Despliegue:** los pushes a `002-estabilizacion-calidad` activan despliegues de producción configurados.

## 7. Arquitectura de producción

```text
React + Vite + CSS propio
Vercel
        |
        | HTTPS / JSON / JWT
        v
Node.js + Express
Render
        |
        +--> AWS RDS for SQL Server Express
        |
        +--> Cloudinary
```

URLs públicas:

- `https://peru-app-frontend.vercel.app`
- `https://peru-app-backend.onrender.com`
- `https://peru-app-backend.onrender.com/api/health`

## 8. Estado de la base de datos

La estructura `PeruDepartamentosDB`, compuesta por 13 tablas en la línea base revisada, fue migrada desde SQL Server local hacia AWS RDS. Se conservaron claves, relaciones, restricciones, índices y datos necesarios para la operación. Los respaldos con información privada permanecen fuera del repositorio.

La conexión se parametriza mediante `DB_SERVER`, `DB_DATABASE`, `DB_USER`, `DB_PASSWORD`, `DB_PORT`, `DB_ENCRYPT`, `DB_TRUST_SERVER_CERTIFICATE` y `DB_INSTANCE`. En AWS RDS, `DB_INSTANCE` permanece vacío porque la conexión utiliza endpoint y puerto.

## 9. Criterios de aceptación final

1. `npm test` aprueba 15 suites y 388 pruebas.
2. La cobertura supera S80/B70/F85/L80.
3. `npm run lint` y `npm run build` finalizan con código de salida 0.
4. OpenAPI informa 70 rutas reales y 70 operaciones documentadas.
5. El health público devuelve servicio operativo y base conectada.
6. El frontend consume la API pública sin errores CORS.
7. La recarga directa de rutas internas no produce 404.
8. Login, consulta, CRUD, rol y cierre de sesión funcionan en producción.
9. Cloudinary almacena y elimina la imagen del registro temporal.
10. Los secretos no se versionan ni se incluyen en el ZIP académico.
11. El SDD refleja la arquitectura realmente implementada.

Los criterios anteriores se consideran satisfechos con la evidencia técnica archivada y la validación manual reportada el 18 de julio de 2026.

## 10. Decisión sobre cuentas QA

No se crearán nuevas cuentas QA en producción. La última ejecución Newman de la copia auditada falló porque las cuentas QA anteriores habían sido eliminadas; ese reporte no se utiliza como evidencia de aprobación. La calidad final se sustenta en las 388 pruebas Jest/Supertest, el reporte Playwright local archivado y la validación funcional manual con cuentas existentes autorizadas.

## 11. Fuera de alcance del cierre

- Rediseño visual completo.
- Reservas, pagos o comercio electrónico.
- Cobertura del 100 %.
- Implementación de un entorno staging dedicado.
- Migración inmediata de JWT desde `localStorage` a cookies HttpOnly.
- Paginación uniforme de todos los listados.
- División avanzada del bundle mediante lazy loading.
- Creación de usuarios QA permanentes o temporales en producción.

## 12. Resultado

SPEC-002 se declara **implementada, desplegada y aceptada funcionalmente**. El cierre académico requiere adjuntar las capturas señaladas en el índice de evidencias, sin mostrar credenciales, tokens, IP privadas ni secretos.
