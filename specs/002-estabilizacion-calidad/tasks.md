# Tareas de Estabilización — PERU APP

## 1. Identificación

- **Código:** TASKS-002
- **Especificación:** SPEC-002
- **Plan:** PLAN-002
- **Rama:** `002-estabilizacion-calidad`

## 2. Estados

- `[ ]` Pendiente
- `[~]` En progreso
- `[x]` Completada y validada
- `[!]` Bloqueada



## 2.1. Estado documentado al 14 de julio de 2026

- **Fases 1, 2 y 3:** documentación, configuración, auditorías, lint y build registrados.
- **Fase 0:** respaldo del código, hash, rama, línea base automática y evidencias visuales registrados.
- **Pendientes para cerrar totalmente la Fase 0:** ejecutar el respaldo `.bak`, conservar la salida de `RESTORE VERIFYONLY` y completar los casos manuales faltantes de registro, perfil y login inválido.
- **Regla de trazabilidad:** una tarea se marca `[x]` únicamente cuando existe archivo, commit o evidencia verificable. Las tareas `[~]` no deben presentarse como terminadas.

## 3. Fase 0 — Respaldo y línea base

- [x] **T-EST-001** Crear o cambiar a la rama `002-estabilizacion-calidad`.
- [x] **T-EST-002** Crear copia ZIP del código sin dependencias, builds, `.git` ni `.env`.
- [x] **T-EST-003** Calcular y guardar hash SHA-256 del respaldo.
- [~] **T-EST-004** Crear respaldo `.bak` de `PeruDepartamentosDB`.
- [~] **T-EST-005** Ejecutar `RESTORE VERIFYONLY` sobre el respaldo.
- [x] **T-EST-006** Ejecutar `scripts/phase0-baseline.ps1`.
- [~] **T-EST-007** Verificar manualmente backend, frontend, registro, login, perfil, roles y logout.
- [x] **T-EST-008** Registrar evidencia visual del diseño actual.
- [x] **T-EST-009** Documentar cualquier error existente sin corregirlo todavía.

## 4. Fase 1 — Especificación SDD

- [x] **T-EST-010** Reemplazar la Constitución por la versión 1.1.0.
- [x] **T-EST-011** Incorporar `specs/002-estabilizacion-calidad`.
- [x] **T-EST-012** Confirmar que solo registro y login serán públicos.
- [x] **T-EST-013** Revisar historias, requisitos, alcance y criterios de éxito de SPEC-002.
- [x] **T-EST-014** Aprobar PLAN-002 como orden oficial de corrección.
- [x] **T-EST-015** Guardar Fase 0 y 1 en un commit independiente.

## 4.1. Bloque 1 — Auditoría SDD y repositorio

- [x] **T-EST-016** Clasificar carpetas fuente, locales, generadas y duplicadas.
- [x] **T-EST-017** Crear la matriz de trazabilidad específica de `SPEC-002`.
- [x] **T-EST-018** Inventariar las rutas reales y clasificar su acceso actual y objetivo.
- [x] **T-EST-019** Actualizar estados SDD sin declarar como implementado lo que solo está documentado.

## 5. Configuración y dependencias

- [x] **T-EST-020** Corregir y unificar archivos `.env.example`.
- [x] **T-EST-021** Centralizar la URL de la API en el frontend.
- [x] **T-EST-022** Limpiar `.gitignore` duplicado.
- [x] **T-EST-023** Eliminar publicación duplicada de `/uploads`.
- [x] **T-EST-024** Completar README de instalación.
- [x] **T-EST-025** Revisar `npm outdated` del backend.
- [x] **T-EST-026** Revisar `npm audit` del backend.
- [x] **T-EST-027** Revisar `npm outdated` del frontend.
- [x] **T-EST-028** Revisar `npm audit` del frontend.
- [x] **T-EST-029** Actualizar dependencias en grupos controlados y validar regresión.

## 6. Autenticación, sesión y rutas

- [~] **T-EST-030** Modificar middleware JWT para consultar el usuario actual en SQL Server.
- [~] **T-EST-031** Usar el rol vigente de la base de datos.
- [~] **T-EST-032** Rechazar token asociado a usuario inexistente.
- [~] **T-EST-033** Diferenciar token ausente, inválido y expirado.
- [~] **T-EST-034** Validar sesión desde `AuthContext` al iniciar el frontend.
- [~] **T-EST-035** Crear interceptor Axios para HTTP 401.
- [~] **T-EST-036** Proteger todos los GET territoriales con autenticación.
- [~] **T-EST-037** Proteger todos los GET turísticos y gastronómicos con autenticación.
- [~] **T-EST-038** Verificar CRUD administrativo mediante `isAdmin`.
- [~] **T-EST-039** Agregar rate limit a login y registro.
- [ ] **T-EST-040** Automatizar matriz de acceso 401/403/200.

## 7. Seguridad, validación y errores

- [~] **T-EST-050** Configurar cabeceras HTTP seguras.
- [~] **T-EST-051** Restringir CORS al origen autorizado.
- [~] **T-EST-052** Limitar tamaño de JSON y formularios.
- [~] **T-EST-053** Retirar o restringir endpoints de depuración.
- [~] **T-EST-054** Crear middleware global de errores.
- [~] **T-EST-055** Mapear errores SQL a HTTP 409/400/404 según el caso.
- [~] **T-EST-056** Mapear errores de Multer a HTTP 413/415.
- [~] **T-EST-057** Implementar validación centralizada de usuarios.
- [~] **T-EST-058** Implementar validación centralizada territorial.
- [~] **T-EST-059** Implementar validación centralizada turística y gastronómica.

## 8. Base de datos e imágenes

- [~] **T-EST-060** Crear migraciones SQL numeradas; migración 005 creada, pendiente de ejecución en SQL Server.
- [~] **T-EST-061** Agregar restricciones para área, población y coordenadas; implementadas en script base y migración 005, pendientes de evidencia SSMS.
- [~] **T-EST-062** Definir y aplicar política de eliminación con relaciones; política sin cascada y respuesta 409 implementadas, pendiente de prueba manual.
- [ ] **T-EST-063** Incorporar transacciones en operaciones múltiples.
- [ ] **T-EST-064** Diseñar campos de fuente, licencia y auditoría.
- [~] **T-EST-065** Validar extensión, MIME, tamaño máximo y firma binaria real de imágenes; implementado, pendiente de prueba 413/415.
- [~] **T-EST-066** Eliminar archivo nuevo si falla validación, relación, duplicado o SQL Server.
- [~] **T-EST-067** Eliminar imagen anterior después de una actualización confirmada; implementado en 12 controladores, pendiente de prueba manual.
- [~] **T-EST-068** Eliminar imagen asociada al borrar un contenido; implementado en 12 controladores, pendiente de prueba manual.

## 9. Revisión de módulos

- [ ] **T-EST-070** Cerrar pruebas de autenticación.
- [ ] **T-EST-071** Cerrar pruebas de usuarios.
- [ ] **T-EST-072** Cerrar pruebas de departamentos.
- [ ] **T-EST-073** Cerrar pruebas de provincias.
- [ ] **T-EST-074** Cerrar pruebas de distritos.
- [ ] **T-EST-075** Cerrar pruebas de ciudades.
- [ ] **T-EST-076** Cerrar pruebas de contenido de departamentos.
- [ ] **T-EST-077** Cerrar pruebas de contenido de provincias.
- [ ] **T-EST-078** Cerrar pruebas de contenido de distritos.
- [ ] **T-EST-079** Cerrar pruebas de contenido de ciudades.

## 10. Contrato, automatización y rendimiento

- [x] **T-EST-080** Inventariar rutas reales del backend.
- [ ] **T-EST-081** Sincronizar `openapi.yaml`.
- [x] **T-EST-082** Actualizar matriz de trazabilidad.
- [x] **T-EST-083** Actualizar checklist SDD con estados reales.
- [ ] **T-EST-084** Configurar pruebas del backend.
- [ ] **T-EST-085** Crear colección Postman y ejecución Newman.
- [ ] **T-EST-086** Configurar pruebas del frontend.
- [ ] **T-EST-087** Configurar pruebas E2E.
- [ ] **T-EST-088** Configurar GitHub Actions.
- [ ] **T-EST-089** Optimizar imágenes y video.
- [ ] **T-EST-090** Implementar carga diferida y división de código.
- [ ] **T-EST-091** Comparar diseño final con evidencia de Fase 0.

## 11. Datos reales y cierre

- [ ] **T-EST-100** Cargar y validar datos reales de Ayacucho.
- [ ] **T-EST-101** Cargar y validar datos reales de Cusco.
- [ ] **T-EST-102** Revisar fuentes y licencias.
- [ ] **T-EST-103** Ejecutar suite completa de calidad.
- [ ] **T-EST-104** Cerrar documentación SDD y evidencias.


## 12. Evidencias de cierre de las fases 0–3

| Fase | Evidencia principal | Estado |
|---|---|---|
| 0 | `docs/estabilizacion/evidencias/fase-0/20260714-173307/` | Parcial: falta respaldo SQL Server verificado y casos manuales faltantes |
| 1 | Constitución 1.1.0, `SPEC-002`, `PLAN-002` y commit `8fa02d5` | Completada |
| 2 | `docs/estabilizacion/evidencias/fase-2/20260714-181127/` y commit `2691f75` | Completada técnicamente; pendiente reconfirmación manual después de cambios |
| 3 | `docs/estabilizacion/evidencias/fase-3-estable/20260714-185954/` y commit `2af0b57` | Completada técnicamente; dependencias vulnerables registradas como riesgo aceptado temporal |

## 13. Próxima puerta de calidad

El Bloque 2 fue implementado en código y queda pendiente de validación manual y automatizada. Para cerrarlo deberán existir:

1. Middleware JWT que consulte usuario y rol vigentes en SQL Server.
2. Ocho GET territoriales protegidos.
3. Validación de sesión desde el frontend.
4. Interceptor global de 401.
5. CORS restringido.
6. Eliminación de `/api/test-db` y `/api/debug-token`.
7. `GET /api/health` seguro.
8. Evidencia de 401, 403 y 200.
9. Backend sin errores de sintaxis; frontend con lint y build aprobados.

Los pendientes de respaldo SQL Server permanecen obligatorios antes del despliegue final, pero no bloquean la preparación documental del Bloque 1.


## 14. Estado del Bloque 2 — Implementado, pendiente de validación

Se incorporaron los siguientes cambios:

- JWT validado con `env.jwt.secret`.
- Usuario y rol vigente consultados en SQL Server en cada ruta protegida.
- Ocho GET territoriales protegidos con `verifyToken`.
- GET turísticos y gastronómicos confirmados como protegidos.
- CRUD administrativo confirmado con `isAdmin`.
- Validación de sesión al cargar React mediante `GET /api/auth/profile`.
- Interceptor Axios para limpiar sesión ante HTTP 401.
- Helmet, CORS restringido, límites de cuerpo y rate limit de autenticación.
- Eliminación de `/api/test-db` y `/api/debug-token`.
- Incorporación de `GET /api/health`.
- Separación `app.js` / `server.js` para facilitar pruebas de integración posteriores.

Las tareas permanecen `[~]` hasta ejecutar los casos 401, 403, 200, expiración, usuario eliminado, cambio de rol, lint y build.


## 15. Estado del Bloque 3 — Implementado, pendiente de validación

Se incorporaron los siguientes cambios:

- Validación central de usuarios, territorios y contenido.
- Conversión y normalización de formularios multipart.
- Comprobación de IDs, fechas, correo, contraseña, números y coordenadas.
- Comprobación de relaciones territoriales.
- Detección de nombres duplicados por ámbito.
- Mapeo de SQL Server a HTTP 400/409.
- Mapeo de Multer a HTTP 413/415.
- Eliminación de archivos nuevos cuando una solicitud falla.
- Mensajes detallados de validación visibles desde el frontend.

Las tareas se mantienen `[~]` hasta ejecutar los casos CP-EST-ERR e IMG, guardar evidencias y configurar la suite automatizada.


## 16. Estado del Bloque 4 — Implementado, pendiente de validación

Se incorporaron los siguientes cambios:

- Auditoría SQL de valores inválidos, duplicados y relaciones huérfanas.
- Migración `005-integridad-basica.sql` transaccional e idempotente.
- Restricciones CHECK para áreas, poblaciones y coordenadas.
- Índices únicos de contenido por ámbito territorial.
- Política de eliminación sin `ON DELETE CASCADE`; los conflictos se devuelven como HTTP 409.
- Verificación de firma binaria real para JPEG, PNG y WEBP.
- Eliminación segura de imágenes sustituidas después de confirmar la actualización.
- Eliminación de imágenes asociadas después de confirmar el borrado.
- Protección para no eliminar URLs externas ni rutas fuera de `/uploads`.
- Script `block4-integrity-image-check.ps1` y checklist funcional.

Las tareas permanecen `[~]` hasta ejecutar la auditoría y migración en SQL Server, completar las pruebas manuales por módulo y guardar evidencias.
