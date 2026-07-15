# Inventario definitivo de rutas — PERU APP

**Código:** ROUTES-002  
**Fecha de corte:** 15 de julio de 2026  
**Fuente:** `backend/src/app.js` y `backend/src/routes/*.js`  
**Operaciones reales:** **70** (69 declaradas en routers + 1 health check en `app.js`)  
**Contrato asociado:** `specs/001-peru-app/openapi.yaml` versión 2.0.0

## Convención de acceso

- **Público:** registro e inicio de sesión.
- **Público técnico:** health check sin datos de negocio.
- **Autenticado:** JWT válido y usuario vigente en SQL Server.
- **Admin:** JWT válido, usuario vigente y rol actual `admin`.

## Inventario

| Método | Ruta | Acceso | Definición / controlador | Validación e integridad |
|---|---|---|---|---|
| POST | `/api/auth/login` | Público | `authRoutes.js` → `login` | loginLimiter, validateLoginBody |
| GET | `/api/auth/profile` | Autenticado | `authRoutes.js` → `getProfile` | — |
| PUT | `/api/auth/profile` | Autenticado | `authRoutes.js` → `updateProfile` | validateProfileBody |
| POST | `/api/auth/register` | Público | `authRoutes.js` → `register` | registerLimiter, validateRegisterBody |
| GET | `/api/ciudades` | Autenticado | `ciudadRoutes.js` → `getCiudades` | validateCiudadQuery |
| POST | `/api/ciudades` | Admin | `ciudadRoutes.js` → `createCiudad` | uploadCiudadImage.single('imagen_fondo'), verifyUploadedImageSignatures, validateCiudadBody, distritoExists, uniqueCiudad |
| DELETE | `/api/ciudades/:id` | Admin | `ciudadRoutes.js` → `deleteCiudad` | validateIdParam, ciudadResourceExists |
| GET | `/api/ciudades/:id` | Autenticado | `ciudadRoutes.js` → `getCiudadById` | validateIdParam |
| PUT | `/api/ciudades/:id` | Admin | `ciudadRoutes.js` → `updateCiudad` | validateIdParam, ciudadResourceExists, uploadCiudadImage.single('imagen_fondo'), verifyUploadedImageSignatures, validateCiudadBody, distritoExists, uniqueCiudad |
| POST | `/api/comidas-tipicas` | Admin | `comidaTipicaRoutes.js` → `createComidaTipica` | uploadComidaTipicaImage.single('imagen'), verifyUploadedImageSignatures, validateComidaDepartamentoBody, departamentoExists, uniqueComida |
| POST | `/api/comidas-tipicas-ciudades` | Admin | `comidaTipicaCiudadRoutes.js` → `createComida` | uploadComidaTipicaCiudadImage.single('imagen'), verifyUploadedImageSignatures, validateComidaCiudadBody, ciudadExists, uniqueComida |
| DELETE | `/api/comidas-tipicas-ciudades/:id` | Admin | `comidaTipicaCiudadRoutes.js` → `deleteComida` | validateIdParam, comidaExists |
| GET | `/api/comidas-tipicas-ciudades/:id` | Autenticado | `comidaTipicaCiudadRoutes.js` → `getComidaById` | validateIdParam |
| PUT | `/api/comidas-tipicas-ciudades/:id` | Admin | `comidaTipicaCiudadRoutes.js` → `updateComida` | validateIdParam, comidaExists, uploadComidaTipicaCiudadImage.single('imagen'), verifyUploadedImageSignatures, validateComidaCiudadBody, ciudadExists, uniqueComida |
| GET | `/api/comidas-tipicas-ciudades/ciudad/:ciudadId` | Autenticado | `comidaTipicaCiudadRoutes.js` → `getComidasByCiudadId` | validateCiudadIdParam |
| POST | `/api/comidas-tipicas-distritos` | Admin | `comidaTipicaDistritoRoutes.js` → `createComida` | uploadComidaTipicaDistritoImage.single('imagen'), verifyUploadedImageSignatures, validateComidaDistritoBody, distritoExists, uniqueComida |
| DELETE | `/api/comidas-tipicas-distritos/:id` | Admin | `comidaTipicaDistritoRoutes.js` → `deleteComida` | validateIdParam, comidaExists |
| GET | `/api/comidas-tipicas-distritos/:id` | Autenticado | `comidaTipicaDistritoRoutes.js` → `getComidaById` | validateIdParam |
| PUT | `/api/comidas-tipicas-distritos/:id` | Admin | `comidaTipicaDistritoRoutes.js` → `updateComida` | validateIdParam, comidaExists, uploadComidaTipicaDistritoImage.single('imagen'), verifyUploadedImageSignatures, validateComidaDistritoBody, distritoExists, uniqueComida |
| GET | `/api/comidas-tipicas-distritos/distrito/:distritoId` | Autenticado | `comidaTipicaDistritoRoutes.js` → `getComidasByDistritoId` | validateDistritoIdParam |
| POST | `/api/comidas-tipicas-provincias` | Admin | `comidaTipicaProvinciaRoutes.js` → `createComida` | uploadComidaTipicaProvinciaImage.single('imagen'), verifyUploadedImageSignatures, validateComidaProvinciaBody, provinciaExists, uniqueComida |
| DELETE | `/api/comidas-tipicas-provincias/:id` | Admin | `comidaTipicaProvinciaRoutes.js` → `deleteComida` | validateIdParam, comidaExists |
| GET | `/api/comidas-tipicas-provincias/:id` | Autenticado | `comidaTipicaProvinciaRoutes.js` → `getComidaById` | validateIdParam |
| PUT | `/api/comidas-tipicas-provincias/:id` | Admin | `comidaTipicaProvinciaRoutes.js` → `updateComida` | validateIdParam, comidaExists, uploadComidaTipicaProvinciaImage.single('imagen'), verifyUploadedImageSignatures, validateComidaProvinciaBody, provinciaExists, uniqueComida |
| GET | `/api/comidas-tipicas-provincias/provincia/:provinciaId` | Autenticado | `comidaTipicaProvinciaRoutes.js` → `getComidasByProvinciaId` | validateProvinciaIdParam |
| DELETE | `/api/comidas-tipicas/:id` | Admin | `comidaTipicaRoutes.js` → `deleteComidaTipica` | validateIdParam, comidaExists |
| GET | `/api/comidas-tipicas/:id` | Autenticado | `comidaTipicaRoutes.js` → `getComidaById` | validateIdParam |
| PUT | `/api/comidas-tipicas/:id` | Admin | `comidaTipicaRoutes.js` → `updateComidaTipica` | validateIdParam, comidaExists, uploadComidaTipicaImage.single('imagen'), verifyUploadedImageSignatures, validateComidaDepartamentoBody, departamentoExists, uniqueComida |
| GET | `/api/comidas-tipicas/departamento/:departamentoId` | Autenticado | `comidaTipicaRoutes.js` → `getComidasByDepartamentoId` | validateDepartamentoIdParam |
| GET | `/api/departamentos` | Autenticado | `departamentoRoutes.js` → `getDepartamentos` | — |
| POST | `/api/departamentos` | Admin | `departamentoRoutes.js` → `createDepartamento` | uploadDepartamentoImage.single('imagen_fondo'), verifyUploadedImageSignatures, validateDepartamentoBody, uniqueDepartamento |
| DELETE | `/api/departamentos/:id` | Admin | `departamentoRoutes.js` → `deleteDepartamento` | validateIdParam, departamentoExists |
| GET | `/api/departamentos/:id` | Autenticado | `departamentoRoutes.js` → `getDepartamentoById` | validateIdParam |
| PUT | `/api/departamentos/:id` | Admin | `departamentoRoutes.js` → `updateDepartamento` | validateIdParam, departamentoExists, uploadDepartamentoImage.single('imagen_fondo'), verifyUploadedImageSignatures, validateDepartamentoBody, uniqueDepartamento |
| GET | `/api/distritos` | Autenticado | `distritoRoutes.js` → `getDistritos` | validateDistritoQuery |
| POST | `/api/distritos` | Admin | `distritoRoutes.js` → `createDistrito` | uploadDistritoImage.single('imagen_fondo'), verifyUploadedImageSignatures, validateDistritoBody, provinciaExists, uniqueDistrito |
| DELETE | `/api/distritos/:id` | Admin | `distritoRoutes.js` → `deleteDistrito` | validateIdParam, distritoResourceExists |
| GET | `/api/distritos/:id` | Autenticado | `distritoRoutes.js` → `getDistritoById` | validateIdParam |
| PUT | `/api/distritos/:id` | Admin | `distritoRoutes.js` → `updateDistrito` | validateIdParam, distritoResourceExists, uploadDistritoImage.single('imagen_fondo'), verifyUploadedImageSignatures, validateDistritoBody, provinciaExists, uniqueDistrito |
| GET | `/api/health` | Público técnico | `app.js` → `healthCheck` | — |
| POST | `/api/lugares-turisticos` | Admin | `lugarTuristicoRoutes.js` → `createLugarTuristico` | uploadImages, verifyUploadedImageSignatures, validateLugarDepartamentoBody, departamentoExists, uniqueLugar |
| POST | `/api/lugares-turisticos-ciudades` | Admin | `lugarTuristicoCiudadRoutes.js` → `createLugar` | uploadLugarTuristicoCiudadImage.single('imagen'), verifyUploadedImageSignatures, validateLugarCiudadBody, ciudadExists, uniqueLugar |
| DELETE | `/api/lugares-turisticos-ciudades/:id` | Admin | `lugarTuristicoCiudadRoutes.js` → `deleteLugar` | validateIdParam, lugarExists |
| GET | `/api/lugares-turisticos-ciudades/:id` | Autenticado | `lugarTuristicoCiudadRoutes.js` → `getLugarById` | validateIdParam |
| PUT | `/api/lugares-turisticos-ciudades/:id` | Admin | `lugarTuristicoCiudadRoutes.js` → `updateLugar` | validateIdParam, lugarExists, uploadLugarTuristicoCiudadImage.single('imagen'), verifyUploadedImageSignatures, validateLugarCiudadBody, ciudadExists, uniqueLugar |
| GET | `/api/lugares-turisticos-ciudades/ciudad/:ciudadId` | Autenticado | `lugarTuristicoCiudadRoutes.js` → `getLugaresByCiudadId` | validateCiudadIdParam |
| POST | `/api/lugares-turisticos-distritos` | Admin | `lugarTuristicoDistritoRoutes.js` → `createLugar` | uploadLugarTuristicoDistritoImage.single('imagen'), verifyUploadedImageSignatures, validateLugarDistritoBody, distritoExists, uniqueLugar |
| DELETE | `/api/lugares-turisticos-distritos/:id` | Admin | `lugarTuristicoDistritoRoutes.js` → `deleteLugar` | validateIdParam, lugarExists |
| GET | `/api/lugares-turisticos-distritos/:id` | Autenticado | `lugarTuristicoDistritoRoutes.js` → `getLugarById` | validateIdParam |
| PUT | `/api/lugares-turisticos-distritos/:id` | Admin | `lugarTuristicoDistritoRoutes.js` → `updateLugar` | validateIdParam, lugarExists, uploadLugarTuristicoDistritoImage.single('imagen'), verifyUploadedImageSignatures, validateLugarDistritoBody, distritoExists, uniqueLugar |
| GET | `/api/lugares-turisticos-distritos/distrito/:distritoId` | Autenticado | `lugarTuristicoDistritoRoutes.js` → `getLugaresByDistritoId` | validateDistritoIdParam |
| POST | `/api/lugares-turisticos-provincias` | Admin | `lugarTuristicoProvinciaRoutes.js` → `createLugar` | uploadLugarTuristicoProvinciaImage.single('imagen'), verifyUploadedImageSignatures, validateLugarProvinciaBody, provinciaExists, uniqueLugar |
| DELETE | `/api/lugares-turisticos-provincias/:id` | Admin | `lugarTuristicoProvinciaRoutes.js` → `deleteLugar` | validateIdParam, lugarExists |
| GET | `/api/lugares-turisticos-provincias/:id` | Autenticado | `lugarTuristicoProvinciaRoutes.js` → `getLugarById` | validateIdParam |
| PUT | `/api/lugares-turisticos-provincias/:id` | Admin | `lugarTuristicoProvinciaRoutes.js` → `updateLugar` | validateIdParam, lugarExists, uploadLugarTuristicoProvinciaImage.single('imagen'), verifyUploadedImageSignatures, validateLugarProvinciaBody, provinciaExists, uniqueLugar |
| GET | `/api/lugares-turisticos-provincias/provincia/:provinciaId` | Autenticado | `lugarTuristicoProvinciaRoutes.js` → `getLugaresByProvinciaId` | validateProvinciaIdParam |
| DELETE | `/api/lugares-turisticos/:id` | Admin | `lugarTuristicoRoutes.js` → `deleteLugarTuristico` | validateIdParam, lugarExists |
| GET | `/api/lugares-turisticos/:id` | Autenticado | `lugarTuristicoRoutes.js` → `getLugarById` | validateIdParam |
| PUT | `/api/lugares-turisticos/:id` | Admin | `lugarTuristicoRoutes.js` → `updateLugarTuristico` | validateIdParam, lugarExists, uploadImages, verifyUploadedImageSignatures, validateLugarDepartamentoBody, departamentoExists, uniqueLugar |
| GET | `/api/lugares-turisticos/departamento/:departamentoId` | Autenticado | `lugarTuristicoRoutes.js` → `getLugaresByDepartamentoId` | validateDepartamentoIdParam |
| GET | `/api/provincias` | Autenticado | `provinciaRoutes.js` → `getProvincias` | validateProvinciaQuery |
| POST | `/api/provincias` | Admin | `provinciaRoutes.js` → `createProvincia` | uploadProvinciaImage.single('imagen_fondo'), verifyUploadedImageSignatures, validateProvinciaBody, departamentoExists, uniqueProvincia |
| DELETE | `/api/provincias/:id` | Admin | `provinciaRoutes.js` → `deleteProvincia` | validateIdParam, provinciaResourceExists |
| GET | `/api/provincias/:id` | Autenticado | `provinciaRoutes.js` → `getProvinciaById` | validateIdParam |
| PUT | `/api/provincias/:id` | Admin | `provinciaRoutes.js` → `updateProvincia` | validateIdParam, provinciaResourceExists, uploadProvinciaImage.single('imagen_fondo'), verifyUploadedImageSignatures, validateProvinciaBody, departamentoExists, uniqueProvincia |
| GET | `/api/users` | Admin | `userRoutes.js` → `getUsers` | — |
| DELETE | `/api/users/:id` | Admin | `userRoutes.js` → `deleteUserAdmin` | validateIdParam |
| GET | `/api/users/:id` | Admin | `userRoutes.js` → `getUserById` | validateIdParam |
| PUT | `/api/users/:id` | Admin | `userRoutes.js` → `updateUserAdmin` | validateIdParam, validateAdminUserBody |
| GET | `/api/users/search` | Admin | `userRoutes.js` → `searchUsersController` | validateSearchQuery |

## Resultado de sincronización

El contrato OpenAPI incluye las mismas 70 combinaciones método-ruta. La comprobación se automatiza mediante:

```powershell
node .\scripts\check-openapi-sync.mjs
```

Una diferencia entre código y contrato provoca código de salida distinto de cero y bloquea el cierre SDD.
