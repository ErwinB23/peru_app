# Matriz de Trazabilidad - PERU APP

## 1. Identificación del documento

**Código:** TRACE-001  
**Proyecto:** PERU APP  
**Especificación asociada:** SPEC-001  
**Plan asociado:** PLAN-001  
**Metodología:** Spec-Driven Development  
**Herramienta:** GitHub Spec Kit  
**Responsable:** Erwin Brayam Inca Pauccara  
**Año:** 2026  

---

## 2. Propósito

La matriz de trazabilidad permite relacionar los requerimientos funcionales de PERU APP con los módulos del sistema, tareas de desarrollo, entidades de base de datos, endpoints de la API REST y casos de prueba que serán definidos en el TDD.

Este documento evidencia que el sistema fue desarrollado de forma ordenada bajo el enfoque Spec-Driven Development, manteniendo relación entre lo especificado, lo diseñado, lo implementado y lo validado.

---

## 3. Criterios de trazabilidad

La matriz utiliza los siguientes elementos:

| Elemento | Descripción |
|---|---|
| RF | Requerimiento funcional definido en `spec.md`. |
| Módulo | Módulo funcional del sistema. |
| Tarea | Tarea registrada en `tasks.md`. |
| Entidad | Tabla o entidad del modelo de datos. |
| Endpoint | Ruta principal documentada en `openapi.yaml`. |
| Caso TDD | Caso de prueba futuro que será documentado en el TDD. |
| Estado | Estado de avance del requerimiento. |

---

## 4. Matriz principal de trazabilidad

| RF | Requerimiento | Módulo | Tareas | Entidades | Endpoint principal | Caso TDD | Estado |
|---|---|---|---|---|---|---|---|
| RF-001 | Registro de usuario | M-001 Autenticación | T-001, T-002 | Usuarios | POST `/auth/register` | CP-001 | Implementado |
| RF-002 | Inicio de sesión | M-001 Autenticación | T-003 | Usuarios | POST `/auth/login` | CP-002 | Implementado |
| RF-003 | Cierre de sesión | M-001 Autenticación | T-004 | Usuarios | Frontend local | CP-003 | Implementado |
| RF-004 | Control de acceso por rol | M-001, M-009 | T-005, T-020 | Usuarios | Middlewares JWT/Admin | CP-004 | Implementado |
| RF-005 | Visualización del home | Interfaz general | T-027, T-029 | No aplica | Frontend | CP-005 | Implementado |
| RF-006 | Exploración de departamentos | M-003 Departamentos | T-006 | Departamentos | GET `/departamentos` | CP-006 | Implementado |
| RF-007 | Detalle de departamento | M-003 Departamentos | T-006, T-007, T-008 | Departamentos, LugaresTuristicos, ComidasTipicas | GET `/departamentos/{id}` | CP-007 | Implementado |
| RF-008 | Exploración de provincias | M-004 Provincias | T-009 | Provincias | GET `/provincias` | CP-008 | Implementado |
| RF-009 | Exploración de distritos | M-005 Distritos | T-010 | Distritos | GET `/distritos` | CP-009 | Implementado |
| RF-010 | Exploración de ciudades | M-006 Ciudades | T-011 | Ciudades | GET `/ciudades` | CP-010 | Implementado |
| RF-011 | Visualización de lugares turísticos | M-007 Lugares turísticos | T-012, T-014, T-015, T-016 | LugaresTuristicos y variantes territoriales | GET `/lugares-turisticos/departamento/{departamentoId}` | CP-011 | Implementado |
| RF-012 | Detalle de lugar turístico | M-007 Lugares turísticos | T-021, T-022, T-023 | LugaresTuristicos | GET `/lugares-turisticos/{id}` | CP-012 | Implementado |
| RF-013 | Visualización de comidas típicas | M-008 Comidas típicas | T-013, T-014, T-015, T-016 | ComidasTipicas y variantes territoriales | GET `/comidas-tipicas/departamento/{departamentoId}` | CP-013 | Implementado |
| RF-014 | Gestión de usuarios | M-002 Usuarios | T-019 | Usuarios | GET `/users` | CP-014 | Implementado |
| RF-015 | Gestión de departamentos | M-003, M-009 | T-006, T-007, T-017 | Departamentos | POST/PUT/DELETE `/departamentos` | CP-015 | Implementado |
| RF-016 | Gestión de provincias | M-004, M-009 | T-009, T-014 | Provincias, LugaresTuristicosProvincias, ComidasTipicasProvincias | POST/PUT/DELETE `/provincias` | CP-016 | Implementado |
| RF-017 | Gestión de distritos | M-005, M-009 | T-010, T-015 | Distritos, LugaresTuristicosDistritos, ComidasTipicasDistritos | POST/PUT/DELETE `/distritos` | CP-017 | Implementado |
| RF-018 | Gestión de ciudades | M-006, M-009 | T-011, T-016 | Ciudades, LugaresTuristicosCiudades, ComidasTipicasCiudades | POST/PUT/DELETE `/ciudades` | CP-018 | Implementado |
| RF-019 | Gestión de lugares turísticos | M-007, M-009 | T-012, T-021, T-022, T-023 | LugaresTuristicos | POST/PUT/DELETE `/lugares-turisticos` | CP-019 | Implementado |
| RF-020 | Gestión de comidas típicas | M-008, M-009 | T-013 | ComidasTipicas | POST/PUT/DELETE `/comidas-tipicas` | CP-020 | Implementado |
| RF-021 | Mapa de departamento | M-010 Mapas y rutas | T-008 | Departamentos | Frontend Leaflet | CP-021 | Implementado |
| RF-022 | Ruta referencial hacia lugar turístico | M-010 Mapas y rutas | T-024, T-026 | LugaresTuristicos | Nominatim/OSRM desde frontend | CP-022 | Implementado |
| RF-023 | Ruta personalizada del usuario | M-010 Mapas y rutas | T-025, T-026 | LugaresTuristicos | Nominatim/OSRM desde frontend | CP-023 | Implementado |
| RF-024 | Consistencia visual mediante iconos | Interfaz general | T-027, T-028, T-029 | No aplica | Frontend Lucide React | CP-024 | Implementado |
| RF-025 | Documentación SDD | Documentación SDD | T-030 a T-038 | Todos los artefactos | Archivos SDD | CP-025 | En desarrollo |

---

## 5. Trazabilidad por módulo

### 5.1. Módulo de autenticación

| Módulo | Requerimientos | Tareas | Casos TDD |
|---|---|---|---|
| M-001 Autenticación | RF-001, RF-002, RF-003, RF-004 | T-001 a T-005 | CP-001 a CP-004 |

### 5.2. Módulo territorial

| Módulo | Requerimientos | Tareas | Casos TDD |
|---|---|---|---|
| M-003 Departamentos | RF-006, RF-007, RF-015, RF-021 | T-006, T-007, T-008, T-017 | CP-006, CP-007, CP-015, CP-021 |
| M-004 Provincias | RF-008, RF-016 | T-009, T-014 | CP-008, CP-016 |
| M-005 Distritos | RF-009, RF-017 | T-010, T-015 | CP-009, CP-017 |
| M-006 Ciudades | RF-010, RF-018 | T-011, T-016 | CP-010, CP-018 |

### 5.3. Módulo turístico y gastronómico

| Módulo | Requerimientos | Tareas | Casos TDD |
|---|---|---|---|
| M-007 Lugares turísticos | RF-011, RF-012, RF-019 | T-012, T-021, T-022, T-023 | CP-011, CP-012, CP-019 |
| M-008 Comidas típicas | RF-013, RF-020 | T-013 | CP-013, CP-020 |

### 5.4. Módulo de mapas y rutas

| Módulo | Requerimientos | Tareas | Casos TDD |
|---|---|---|---|
| M-010 Mapas y rutas | RF-021, RF-022, RF-023 | T-008, T-024, T-025, T-026 | CP-021, CP-022, CP-023 |

### 5.5. Documentación SDD

| Módulo | Requerimientos | Tareas | Casos TDD |
|---|---|---|---|
| M-011 Documentación SDD | RF-025 | T-030 a T-038 | CP-025 |

---

## 6. Trazabilidad hacia el TDD

Los casos de prueba del TDD deberán generarse a partir de esta matriz. La relación mínima esperada será:

| Caso TDD | Requerimiento base | Objetivo de prueba |
|---|---|---|
| CP-001 | RF-001 | Verificar registro de usuario válido e inválido. |
| CP-002 | RF-002 | Verificar inicio de sesión con credenciales válidas e inválidas. |
| CP-003 | RF-003 | Verificar cierre de sesión y bloqueo posterior de rutas privadas. |
| CP-004 | RF-004 | Verificar control de acceso por rol. |
| CP-005 | RF-005 | Verificar visualización del home y navegación principal. |
| CP-006 | RF-006 | Verificar listado y acceso a departamentos. |
| CP-007 | RF-007 | Verificar detalle completo de departamento. |
| CP-008 | RF-008 | Verificar consulta de provincias. |
| CP-009 | RF-009 | Verificar consulta de distritos. |
| CP-010 | RF-010 | Verificar consulta de ciudades. |
| CP-011 | RF-011 | Verificar visualización de lugares turísticos. |
| CP-012 | RF-012 | Verificar detalle de lugar turístico. |
| CP-013 | RF-013 | Verificar visualización de comidas típicas. |
| CP-014 | RF-014 | Verificar gestión de usuarios por administrador. |
| CP-015 | RF-015 | Verificar gestión de departamentos. |
| CP-016 | RF-016 | Verificar gestión de provincias. |
| CP-017 | RF-017 | Verificar gestión de distritos. |
| CP-018 | RF-018 | Verificar gestión de ciudades. |
| CP-019 | RF-019 | Verificar gestión de lugares turísticos. |
| CP-020 | RF-020 | Verificar gestión de comidas típicas. |
| CP-021 | RF-021 | Verificar mapa de departamento. |
| CP-022 | RF-022 | Verificar ruta referencial hacia lugar turístico. |
| CP-023 | RF-023 | Verificar ruta personalizada del usuario. |
| CP-024 | RF-024 | Verificar iconos y consistencia visual. |
| CP-025 | RF-025 | Verificar existencia y coherencia de artefactos SDD. |

---

## 7. Criterios de aceptación de trazabilidad

La matriz será considerada válida si cumple con los siguientes criterios:

1. Cada requerimiento funcional tiene un módulo relacionado.
2. Cada requerimiento funcional tiene al menos una tarea asociada.
3. Cada requerimiento funcional principal tiene una entidad o componente asociado.
4. Cada requerimiento funcional tiene un caso de prueba futuro para el TDD.
5. La matriz permite justificar la relación entre especificación, diseño, implementación y pruebas.
6. La matriz está alineada con `spec.md`, `plan.md`, `tasks.md`, `data-model.md` y `openapi.yaml`.

---

## 8. Consideraciones finales

La matriz de trazabilidad es un artefacto central del SDD porque permite comprobar que PERU APP no fue desarrollado de manera aislada, sino siguiendo una relación entre requerimientos, diseño técnico, tareas, datos, API y pruebas.

Este documento será la base directa para elaborar el TDD de PERU APP.
