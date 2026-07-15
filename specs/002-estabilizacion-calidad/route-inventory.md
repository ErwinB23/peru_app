# Inventario Real de Rutas del Backend — SPEC-002

## 1. Identificación

- **Artefacto:** ROUTES-002
- **Fuente examinada:** `backend/src/server.js` y `backend/src/routes/*.js`
- **Fecha de corte:** 14 de julio de 2026
- **Objetivo:** establecer el contrato implementado antes de modificar autenticación, OpenAPI o pruebas.

## 2. Resumen verificable

| Concepto | Cantidad |
|---|---:|
| Operaciones declaradas en routers Express | 69 |
| GET | 28 |
| POST | 14 |
| PUT | 14 |
| DELETE | 13 |
| Operaciones con JWT y rol administrador | 41 |
| Operaciones con JWT para usuario autenticado | 18 |
| Operaciones actualmente públicas en routers | 10 |
| Operaciones públicas funcionales permitidas por SPEC-002 | 2 |
| Brechas de autenticación en routers | 8 |

Además, `server.js` expone actualmente tres GET directos: `/`, `/api/test-db` y `/api/debug-token`. Los dos últimos deben eliminarse. La ruta raíz debe sustituirse por un `GET /api/health` técnico, sin datos sensibles, para el despliegue.

## 3. Regla objetivo

- Públicas: `POST /api/auth/register`, `POST /api/auth/login`.
- Excepción técnica prevista: `GET /api/health`, sin datos de negocio, credenciales, conteos internos ni detalles de SQL Server.
- Usuario autenticado: perfil y todas las consultas territoriales, turísticas y gastronómicas.
- Administrador autenticado: usuarios y operaciones de creación, actualización y eliminación.
- Prohibidas en producción: `/api/test-db` y `/api/debug-token`.

## 4. Brechas críticas detectadas

| Método | Endpoint | Estado actual | Estado objetivo |
|---|---|---|---|
| GET | `/api/departamentos` | Pública | JWT requerido |
| GET | `/api/departamentos/:id` | Pública | JWT requerido |
| GET | `/api/provincias` | Pública | JWT requerido |
| GET | `/api/provincias/:id` | Pública | JWT requerido |
| GET | `/api/distritos` | Pública | JWT requerido |
| GET | `/api/distritos/:id` | Pública | JWT requerido |
| GET | `/api/ciudades` | Pública | JWT requerido |
| GET | `/api/ciudades/:id` | Pública | JWT requerido |

## 5. Inventario completo

| Método | Endpoint real | Acceso actual | Acceso objetivo | Controlador | Archivo | Dictamen |
|---|---|---|---|---|---|---|
| `POST` | `/api/auth/login` | Pública | Pública | `login` | `authRoutes.js` | Correcta |
| `GET` | `/api/auth/profile` | JWT | JWT | `getProfile` | `authRoutes.js` | Correcta |
| `PUT` | `/api/auth/profile` | JWT | JWT | `updateProfile` | `authRoutes.js` | Correcta |
| `POST` | `/api/auth/register` | Pública | Pública | `register` | `authRoutes.js` | Correcta |
| `GET` | `/api/ciudades` | Pública | JWT requerido | `getCiudades` | `ciudadRoutes.js` | Brecha |
| `POST` | `/api/ciudades` | JWT + admin | JWT + admin | `createCiudad` | `ciudadRoutes.js` | Correcta |
| `DELETE` | `/api/ciudades/:id` | JWT + admin | JWT + admin | `deleteCiudad` | `ciudadRoutes.js` | Correcta |
| `GET` | `/api/ciudades/:id` | Pública | JWT requerido | `getCiudadById` | `ciudadRoutes.js` | Brecha |
| `PUT` | `/api/ciudades/:id` | JWT + admin | JWT + admin | `updateCiudad` | `ciudadRoutes.js` | Correcta |
| `POST` | `/api/comidas-tipicas` | JWT + admin | JWT + admin | `createComidaTipica` | `comidaTipicaRoutes.js` | Correcta |
| `POST` | `/api/comidas-tipicas-ciudades` | JWT + admin | JWT + admin | `createComida` | `comidaTipicaCiudadRoutes.js` | Correcta |
| `DELETE` | `/api/comidas-tipicas-ciudades/:id` | JWT + admin | JWT + admin | `deleteComida` | `comidaTipicaCiudadRoutes.js` | Correcta |
| `GET` | `/api/comidas-tipicas-ciudades/:id` | JWT | JWT | `getComidaById` | `comidaTipicaCiudadRoutes.js` | Correcta |
| `PUT` | `/api/comidas-tipicas-ciudades/:id` | JWT + admin | JWT + admin | `updateComida` | `comidaTipicaCiudadRoutes.js` | Correcta |
| `GET` | `/api/comidas-tipicas-ciudades/ciudad/:ciudadId` | JWT | JWT | `getComidasByCiudadId` | `comidaTipicaCiudadRoutes.js` | Correcta |
| `POST` | `/api/comidas-tipicas-distritos` | JWT + admin | JWT + admin | `createComida` | `comidaTipicaDistritoRoutes.js` | Correcta |
| `DELETE` | `/api/comidas-tipicas-distritos/:id` | JWT + admin | JWT + admin | `deleteComida` | `comidaTipicaDistritoRoutes.js` | Correcta |
| `GET` | `/api/comidas-tipicas-distritos/:id` | JWT | JWT | `getComidaById` | `comidaTipicaDistritoRoutes.js` | Correcta |
| `PUT` | `/api/comidas-tipicas-distritos/:id` | JWT + admin | JWT + admin | `updateComida` | `comidaTipicaDistritoRoutes.js` | Correcta |
| `GET` | `/api/comidas-tipicas-distritos/distrito/:distritoId` | JWT | JWT | `getComidasByDistritoId` | `comidaTipicaDistritoRoutes.js` | Correcta |
| `POST` | `/api/comidas-tipicas-provincias` | JWT + admin | JWT + admin | `createComida` | `comidaTipicaProvinciaRoutes.js` | Correcta |
| `DELETE` | `/api/comidas-tipicas-provincias/:id` | JWT + admin | JWT + admin | `deleteComida` | `comidaTipicaProvinciaRoutes.js` | Correcta |
| `GET` | `/api/comidas-tipicas-provincias/:id` | JWT | JWT | `getComidaById` | `comidaTipicaProvinciaRoutes.js` | Correcta |
| `PUT` | `/api/comidas-tipicas-provincias/:id` | JWT + admin | JWT + admin | `updateComida` | `comidaTipicaProvinciaRoutes.js` | Correcta |
| `GET` | `/api/comidas-tipicas-provincias/provincia/:provinciaId` | JWT | JWT | `getComidasByProvinciaId` | `comidaTipicaProvinciaRoutes.js` | Correcta |
| `DELETE` | `/api/comidas-tipicas/:id` | JWT + admin | JWT + admin | `deleteComidaTipica` | `comidaTipicaRoutes.js` | Correcta |
| `GET` | `/api/comidas-tipicas/:id` | JWT | JWT | `getComidaById` | `comidaTipicaRoutes.js` | Correcta |
| `PUT` | `/api/comidas-tipicas/:id` | JWT + admin | JWT + admin | `updateComidaTipica` | `comidaTipicaRoutes.js` | Correcta |
| `GET` | `/api/comidas-tipicas/departamento/:departamentoId` | JWT | JWT | `getComidasByDepartamentoId` | `comidaTipicaRoutes.js` | Correcta |
| `GET` | `/api/departamentos` | Pública | JWT requerido | `getDepartamentos` | `departamentoRoutes.js` | Brecha |
| `POST` | `/api/departamentos` | JWT + admin | JWT + admin | `createDepartamento` | `departamentoRoutes.js` | Correcta |
| `DELETE` | `/api/departamentos/:id` | JWT + admin | JWT + admin | `deleteDepartamento` | `departamentoRoutes.js` | Correcta |
| `GET` | `/api/departamentos/:id` | Pública | JWT requerido | `getDepartamentoById` | `departamentoRoutes.js` | Brecha |
| `PUT` | `/api/departamentos/:id` | JWT + admin | JWT + admin | `updateDepartamento` | `departamentoRoutes.js` | Correcta |
| `GET` | `/api/distritos` | Pública | JWT requerido | `getDistritos` | `distritoRoutes.js` | Brecha |
| `POST` | `/api/distritos` | JWT + admin | JWT + admin | `createDistrito` | `distritoRoutes.js` | Correcta |
| `DELETE` | `/api/distritos/:id` | JWT + admin | JWT + admin | `deleteDistrito` | `distritoRoutes.js` | Correcta |
| `GET` | `/api/distritos/:id` | Pública | JWT requerido | `getDistritoById` | `distritoRoutes.js` | Brecha |
| `PUT` | `/api/distritos/:id` | JWT + admin | JWT + admin | `updateDistrito` | `distritoRoutes.js` | Correcta |
| `POST` | `/api/lugares-turisticos` | JWT + admin | JWT + admin | `createLugarTuristico` | `lugarTuristicoRoutes.js` | Correcta |
| `POST` | `/api/lugares-turisticos-ciudades` | JWT + admin | JWT + admin | `createLugar` | `lugarTuristicoCiudadRoutes.js` | Correcta |
| `DELETE` | `/api/lugares-turisticos-ciudades/:id` | JWT + admin | JWT + admin | `deleteLugar` | `lugarTuristicoCiudadRoutes.js` | Correcta |
| `GET` | `/api/lugares-turisticos-ciudades/:id` | JWT | JWT | `getLugarById` | `lugarTuristicoCiudadRoutes.js` | Correcta |
| `PUT` | `/api/lugares-turisticos-ciudades/:id` | JWT + admin | JWT + admin | `updateLugar` | `lugarTuristicoCiudadRoutes.js` | Correcta |
| `GET` | `/api/lugares-turisticos-ciudades/ciudad/:ciudadId` | JWT | JWT | `getLugaresByCiudadId` | `lugarTuristicoCiudadRoutes.js` | Correcta |
| `POST` | `/api/lugares-turisticos-distritos` | JWT + admin | JWT + admin | `createLugar` | `lugarTuristicoDistritoRoutes.js` | Correcta |
| `DELETE` | `/api/lugares-turisticos-distritos/:id` | JWT + admin | JWT + admin | `deleteLugar` | `lugarTuristicoDistritoRoutes.js` | Correcta |
| `GET` | `/api/lugares-turisticos-distritos/:id` | JWT | JWT | `getLugarById` | `lugarTuristicoDistritoRoutes.js` | Correcta |
| `PUT` | `/api/lugares-turisticos-distritos/:id` | JWT + admin | JWT + admin | `updateLugar` | `lugarTuristicoDistritoRoutes.js` | Correcta |
| `GET` | `/api/lugares-turisticos-distritos/distrito/:distritoId` | JWT | JWT | `getLugaresByDistritoId` | `lugarTuristicoDistritoRoutes.js` | Correcta |
| `POST` | `/api/lugares-turisticos-provincias` | JWT + admin | JWT + admin | `createLugar` | `lugarTuristicoProvinciaRoutes.js` | Correcta |
| `DELETE` | `/api/lugares-turisticos-provincias/:id` | JWT + admin | JWT + admin | `deleteLugar` | `lugarTuristicoProvinciaRoutes.js` | Correcta |
| `GET` | `/api/lugares-turisticos-provincias/:id` | JWT | JWT | `getLugarById` | `lugarTuristicoProvinciaRoutes.js` | Correcta |
| `PUT` | `/api/lugares-turisticos-provincias/:id` | JWT + admin | JWT + admin | `updateLugar` | `lugarTuristicoProvinciaRoutes.js` | Correcta |
| `GET` | `/api/lugares-turisticos-provincias/provincia/:provinciaId` | JWT | JWT | `getLugaresByProvinciaId` | `lugarTuristicoProvinciaRoutes.js` | Correcta |
| `DELETE` | `/api/lugares-turisticos/:id` | JWT + admin | JWT + admin | `deleteLugarTuristico` | `lugarTuristicoRoutes.js` | Correcta |
| `GET` | `/api/lugares-turisticos/:id` | JWT | JWT | `getLugarById` | `lugarTuristicoRoutes.js` | Correcta |
| `PUT` | `/api/lugares-turisticos/:id` | JWT + admin | JWT + admin | `updateLugarTuristico` | `lugarTuristicoRoutes.js` | Correcta |
| `GET` | `/api/lugares-turisticos/departamento/:departamentoId` | JWT | JWT | `getLugaresByDepartamentoId` | `lugarTuristicoRoutes.js` | Correcta |
| `GET` | `/api/provincias` | Pública | JWT requerido | `getProvincias` | `provinciaRoutes.js` | Brecha |
| `POST` | `/api/provincias` | JWT + admin | JWT + admin | `createProvincia` | `provinciaRoutes.js` | Correcta |
| `DELETE` | `/api/provincias/:id` | JWT + admin | JWT + admin | `deleteProvincia` | `provinciaRoutes.js` | Correcta |
| `GET` | `/api/provincias/:id` | Pública | JWT requerido | `getProvinciaById` | `provinciaRoutes.js` | Brecha |
| `PUT` | `/api/provincias/:id` | JWT + admin | JWT + admin | `updateProvincia` | `provinciaRoutes.js` | Correcta |
| `GET` | `/api/users` | JWT + admin | JWT + admin | `getUsers` | `userRoutes.js` | Correcta |
| `DELETE` | `/api/users/:id` | JWT + admin | JWT + admin | `deleteUserAdmin` | `userRoutes.js` | Correcta |
| `GET` | `/api/users/:id` | JWT + admin | JWT + admin | `getUserById` | `userRoutes.js` | Correcta |
| `PUT` | `/api/users/:id` | JWT + admin | JWT + admin | `updateUserAdmin` | `userRoutes.js` | Correcta |
| `GET` | `/api/users/search` | JWT + admin | JWT + admin | `searchUsersController` | `userRoutes.js` | Correcta |

## 6. Rutas directas definidas en `server.js`

| Método | Endpoint | Estado actual | Decisión SDD |
|---|---|---|---|
| GET | `/` | Pública | Sustituir por `/api/health` técnico y mínimo. |
| GET | `/api/test-db` | Pública y sensible | Eliminar antes del despliegue. |
| GET | `/api/debug-token` | Pública y sensible | Eliminar antes del despliegue. |
| STATIC | `/uploads/*` | Pública | Mantener únicamente para archivos publicados; revisar persistencia en despliegue. |

## 7. Uso de este inventario

Este archivo es la línea base para:

1. `T-EST-036` y `T-EST-037`: protección de consultas.
2. `T-EST-053`: eliminación de rutas de depuración.
3. `T-EST-081`: sincronización de `openapi.yaml`.
4. `T-EST-040`, Postman/Newman y Supertest: generación de pruebas 401/403/200.
5. La matriz de trazabilidad de `SPEC-002`.

El inventario describe el código observado; no implica que las brechas ya estén corregidas.
