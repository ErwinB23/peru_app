# Especificación de Estabilización, Calidad y Seguridad — PERU APP

## 1. Identificación

- **Código:** SPEC-002
- **Nombre:** Estabilización, calidad y seguridad de PERU APP
- **Proyecto:** PERU APP
- **Metodología:** Spec-Driven Development
- **Herramienta:** GitHub Spec Kit
- **Estado:** En implementación — Bloque documental y de repositorio validado
- **Responsable:** Erwin Brayam Inca Pauccara
- **Fecha:** 14 de julio de 2026
- **Especificación base:** `specs/001-peru-app/spec.md`

## 2. Propósito

Estabilizar PERU APP mediante correcciones incrementales de autenticación, autorización, validación, manejo de errores, integridad de datos, gestión de imágenes, contrato API, pruebas y rendimiento, conservando el diseño visual y el alcance turístico-educativo existente.

## 3. Contexto

PERU APP ya cuenta con frontend, backend, SQL Server, autenticación JWT, roles, gestión territorial, contenido turístico y documentación inicial con Spec Kit. El sistema funciona como línea base; sin embargo, debe reforzarse antes de ingresar información real y utilizarlo como producto final del curso de Pruebas y Aseguramiento de la Calidad de Software.

## 4. Decisiones obligatorias

### 4.1. Login obligatorio

Toda persona debe registrarse o iniciar sesión antes de acceder al contenido de la plataforma.

Las únicas operaciones funcionales públicas son:

- `POST /api/auth/register`
- `POST /api/auth/login`

Como excepción técnica de despliegue podrá existir `GET /api/health`, con una respuesta mínima que no revele datos de negocio ni detalles de infraestructura. Toda otra ruta debe exigir un token JWT válido.

### 4.2. Autorización por rol

- El rol `usuario` puede consultar información territorial, turística y gastronómica, y gestionar su propio perfil.
- El rol `admin` puede realizar lo anterior y además gestionar usuarios y contenido.
- El backend debe usar el rol vigente de la base de datos, no confiar únicamente en el rol incluido en un token antiguo.

### 4.3. Conservación del frontend

La estabilización no debe rediseñar la interfaz. Se conservarán la estructura visual, colores, componentes, sidebar, tarjetas y navegación actuales. Solo se añadirán estados de carga, validación, error o sesión expirada cuando sean necesarios.

### 4.4. Cambios incrementales

Cada corrección debe especificarse, implementarse, probarse y registrarse antes de iniciar la siguiente. No se permiten cambios masivos sin evidencia de regresión.

## 5. Estado real de implementación al inicio del Bloque 1

La auditoría del código estableció la siguiente línea base:

- 69 operaciones declaradas en routers Express.
- 41 operaciones usan JWT y rol administrador.
- 18 operaciones usan JWT para usuario autenticado.
- 10 operaciones de routers están públicas.
- Solo registro y login cumplen la política pública objetivo.
- Ocho GET territoriales constituyen una brecha de autenticación.
- `/api/test-db` y `/api/debug-token` deben eliminarse.
- El middleware JWT todavía no consulta el usuario ni el rol vigentes en SQL Server.
- El frontend todavía no revalida la sesión mediante `/api/auth/profile`.
- No existe todavía una suite automatizada activa.

Estos puntos representan el estado observado, no una funcionalidad ya corregida. El detalle se mantiene en `route-inventory.md` y `traceability-matrix.md`.

## 6. Actores

| Actor | Descripción |
|---|---|
| Visitante no autenticado | Solo puede registrarse o iniciar sesión. |
| Usuario autenticado | Puede consultar el contenido y gestionar su perfil. |
| Administrador autenticado | Puede consultar y gestionar usuarios, territorios y contenido. |
| Sistema | Valida sesión, permisos, datos, relaciones y archivos. |

## 7. Historias de usuario priorizadas

### US-EST-001 — Acceso obligatorio mediante login (P1)

Como visitante, necesito autenticarme antes de acceder al sistema, para que la plataforma controle quién utiliza sus funcionalidades.

**Escenarios de aceptación:**

1. Dado un visitante sin token, cuando intenta consultar cualquier ruta protegida, entonces recibe HTTP 401.
2. Dado un visitante sin sesión, cuando escribe una URL interna en el navegador, entonces es dirigido a la pantalla de autenticación.
3. Dado un usuario con credenciales válidas, cuando inicia sesión, entonces obtiene acceso según su rol.
4. Dado un usuario con token expirado o inválido, cuando solicita un recurso, entonces la sesión se elimina y vuelve al login.

### US-EST-002 — Permisos vigentes (P1)

Como administrador, necesito que el sistema compruebe usuarios y roles actuales, para evitar que cuentas eliminadas o degradadas conserven privilegios.

**Escenarios de aceptación:**

1. Un usuario eliminado no puede continuar usando un token emitido anteriormente.
2. Un administrador cambiado a `usuario` no puede continuar ejecutando operaciones administrativas.
3. Un usuario normal recibe HTTP 403 al intentar crear, modificar o eliminar contenido.

### US-EST-003 — Datos válidos y errores claros (P1)

Como usuario o administrador, necesito respuestas coherentes ante datos inválidos, para comprender y corregir el problema sin exponer información interna.

**Escenarios de aceptación:**

1. Datos inválidos producen HTTP 400 con detalle por campo.
2. Duplicados producen HTTP 409.
3. Recursos inexistentes producen HTTP 404.
4. Relaciones que impiden eliminación producen HTTP 409.
5. Los errores internos no revelan consultas, contraseñas, rutas del servidor ni detalles de SQL Server.

### US-EST-004 — Integridad de información e imágenes (P1)

Como administrador, necesito que los registros y archivos se mantengan sincronizados, para evitar información incompleta, imágenes huérfanas o eliminaciones accidentales.

**Escenarios de aceptación:**

1. Si falla la inserción en SQL Server, el archivo subido se elimina.
2. Al reemplazar una imagen, la anterior se elimina solo después de confirmar la actualización.
3. Al eliminar un contenido, se elimina su imagen asociada cuando corresponde.
4. No se puede eliminar un territorio que tenga datos hijos sin una operación explícita de reasignación o eliminación previa.

### US-EST-005 — Contrato y pruebas trazables (P2)

Como equipo del proyecto, necesito que especificación, OpenAPI, código y pruebas coincidan, para demostrar cumplimiento bajo SDD y aseguramiento de calidad.

**Escenarios de aceptación:**

1. Cada endpoint real está documentado en OpenAPI.
2. No existen endpoints documentados que no estén implementados, salvo que estén marcados como futuros.
3. Cada requisito crítico tiene al menos un caso de prueba y evidencia.
4. Lint, build y pruebas se ejecutan de forma repetible.

### US-EST-006 — Rendimiento sin alterar diseño (P3)

Como usuario, necesito que la plataforma cargue con mayor rapidez sin perder su apariencia, para usarla desde dispositivos y conexiones diferentes.

**Escenarios de aceptación:**

1. Las imágenes se sirven en tamaño y formato adecuados.
2. Las páginas pesadas se cargan de forma diferida.
3. La navegación y apariencia se mantienen equivalentes a la línea base aprobada.

## 8. Requisitos funcionales

### Autenticación y autorización

- **RF-EST-001:** El sistema debe mantener públicas únicamente las operaciones de registro e inicio de sesión.
- **RF-EST-002:** El backend debe exigir token válido en toda ruta distinta de registro e inicio de sesión.
- **RF-EST-003:** El middleware de autenticación debe comprobar que el usuario del token existe actualmente en `Usuarios`.
- **RF-EST-004:** El sistema debe utilizar el rol actual de SQL Server para autorizar operaciones.
- **RF-EST-005:** El frontend debe validar la sesión mediante el endpoint de perfil al iniciar o recargar la aplicación.
- **RF-EST-006:** El frontend debe cerrar la sesión ante HTTP 401 y redirigir al login.
- **RF-EST-007:** Las operaciones administrativas deben devolver HTTP 403 a usuarios con rol `usuario`.
- **RF-EST-008:** Login y registro deben aplicar un límite controlado de solicitudes.

### Validación y errores

- **RF-EST-009:** El backend debe validar y normalizar los datos antes de enviarlos a SQL Server.
- **RF-EST-010:** Las respuestas de validación deben identificar los campos incorrectos.
- **RF-EST-011:** El sistema debe diferenciar 400, 401, 403, 404, 409, 413, 415 y 500.
- **RF-EST-012:** El backend debe centralizar el manejo de errores y no exponer detalles internos.

### Base de datos

- **RF-EST-013:** Las modificaciones estructurales deben almacenarse como migraciones SQL numeradas.
- **RF-EST-014:** La base de datos debe rechazar áreas, poblaciones o coordenadas fuera de rangos permitidos.
- **RF-EST-015:** El sistema debe impedir eliminaciones territoriales que rompan relaciones existentes.
- **RF-EST-016:** Las operaciones múltiples críticas deben ejecutarse mediante transacciones.

### Archivos e imágenes

- **RF-EST-017:** El servidor debe validar tamaño, extensión, MIME y contenido permitido de las imágenes.
- **RF-EST-018:** El sistema debe eliminar archivos temporales cuando falle una operación de base de datos.
- **RF-EST-019:** El sistema debe retirar imágenes anteriores después de una actualización confirmada.
- **RF-EST-020:** El backend debe publicar la carpeta de imágenes mediante una sola configuración controlada.

### Contrato y pruebas

- **RF-EST-021:** `openapi.yaml` debe reflejar rutas, parámetros, seguridad, cuerpos y respuestas reales.
- **RF-EST-022:** La matriz de trazabilidad debe relacionar requisitos, código, endpoints y pruebas.
- **RF-EST-023:** El backend debe disponer de pruebas unitarias o de integración repetibles.
- **RF-EST-024:** La API debe contar con una colección ejecutable mediante Newman.
- **RF-EST-025:** El frontend debe contar con pruebas de rutas y flujos críticos.

### Rendimiento y mantenimiento

- **RF-EST-026:** Las listas de usuarios y contenidos extensos deben soportar paginación.
- **RF-EST-027:** Los recursos multimedia deben optimizarse sin cambiar la composición visual.
- **RF-EST-028:** El código de depuración y los endpoints técnicos deben eliminarse o restringirse al entorno de desarrollo.

## 9. Requisitos no funcionales

- **RNF-EST-001 Seguridad:** ninguna información funcional debe ser accesible sin autenticación válida.
- **RNF-EST-002 Integridad:** el sistema no debe dejar actualizaciones parciales en operaciones críticas.
- **RNF-EST-003 Mantenibilidad:** los cambios deben conservar la arquitectura por capas existente.
- **RNF-EST-004 Compatibilidad:** el frontend debe continuar funcionando en navegadores modernos de escritorio y móvil.
- **RNF-EST-005 Usabilidad:** los mensajes deben indicar claramente el problema y la acción posible.
- **RNF-EST-006 Rendimiento:** la optimización no debe degradar la calidad visual perceptible.
- **RNF-EST-007 Trazabilidad:** cada requisito P1 debe tener código, prueba y evidencia asociada.
- **RNF-EST-008 Regresión:** después de cada bloque deben ejecutarse sintaxis, lint, build y pruebas del módulo afectado.

## 10. Fuera de alcance

Esta especificación no incluye:

- rediseño completo del frontend;
- cambio de React, Express o SQL Server por otras tecnologías;
- eliminación de módulos turísticos existentes;
- reservas, pagos o comercio electrónico;
- acceso público al contenido sin login;
- migración inmediata a una arquitectura distinta;
- carga masiva de todos los datos reales antes de estabilizar.

## 11. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Una actualización rompe una función existente | Cambios pequeños, rama separada y pruebas de regresión. |
| Cambios de autenticación bloquean usuarios válidos | Casos positivos y negativos antes de proteger todos los módulos. |
| Migraciones afectan datos | Respaldo `.bak`, scripts versionados y prueba previa. |
| Archivos quedan huérfanos | Flujo transaccional y limpieza ante error. |
| Documentación se desvía del código | Revisión de OpenAPI y trazabilidad al cerrar cada módulo. |
| Optimización cambia el diseño | Comparación con evidencia visual de Fase 0. |

## 12. Criterios de éxito

La estabilización será aceptada cuando:

1. Sin token, toda ruta funcional distinta de registro y login responde 401; `/api/health` solo entrega estado técnico mínimo.
2. Un usuario autenticado consulta contenido, pero no administra.
3. Un administrador puede gestionar contenido con su rol vigente.
4. Un usuario eliminado o degradado pierde acceso con su token anterior.
5. Los errores HTTP son consistentes y no exponen información interna.
6. Las relaciones de SQL Server protegen los datos reales.
7. No quedan imágenes huérfanas en los flujos probados.
8. OpenAPI coincide con las rutas implementadas.
9. Las pruebas críticas son repetibles.
10. El frontend conserva el diseño aprobado en la línea base.
