# Plan Técnico de Estabilización — PERU APP

## 1. Identificación

- **Código:** PLAN-002
- **Especificación:** SPEC-002
- **Rama:** `002-estabilizacion-calidad`
- **Estado:** Preparado
- **Fecha:** 14 de julio de 2026

## 2. Estrategia

Se aplicará estabilización incremental sobre la arquitectura existente. Cada bloque tendrá una especificación clara, cambios acotados, prueba manual, prueba automatizada cuando corresponda y verificación de regresión.

No se cambiará el diseño visual salvo para incorporar estados necesarios de carga, error, validación y expiración de sesión.

## 3. Puertas de calidad obligatorias

Antes de cerrar cualquier bloque:

1. Backend sin errores de sintaxis.
2. Frontend con `npm run lint` aprobado.
3. Frontend con `npm run build` aprobado.
4. Casos manuales del módulo aprobados.
5. No hay regresión visible del diseño.
6. Especificación y tareas actualizadas.
7. Commit pequeño y descriptivo.

## 4. Orden de implementación

### Bloque 0 — Respaldo y línea base

- Crear rama.
- Respaldar código y SQL Server.
- Ejecutar comprobaciones automáticas.
- Registrar funcionamiento manual y evidencia visual.

**Salida:** estado anterior reproducible y protegido.

### Bloque 1 — Configuración y entorno

- Corregir `.env.example`.
- Unificar URL de API y base de datos.
- Limpiar `.gitignore`.
- Documentar instalación.
- Eliminar configuración duplicada de `/uploads` sin cambiar su URL pública.

**Salida:** entorno consistente y reproducible.

### Bloque 2 — Dependencias controladas

- Ejecutar `npm outdated` y `npm audit`.
- Actualizar dependencias por grupos compatibles.
- Evitar `npm audit fix --force` sin revisión.
- Repetir puertas de calidad después de cada grupo.

**Salida:** dependencias mantenidas sin romper el sistema.

### Bloque 3 — Autenticación y sesión

- Validar JWT.
- Consultar usuario actual en SQL Server.
- Usar rol vigente.
- Validar expiración y usuario eliminado.
- Verificar perfil al cargar frontend.
- Interceptor de HTTP 401.
- Limitar intentos de login y registro.

**Salida:** sesión consistente y revocable.

### Bloque 4 — Protección integral de rutas

- Mantener públicas solo `register` y `login`.
- Proteger GET territoriales y turísticos.
- Mantener CRUD administrativo con `isAdmin`.
- Ejecutar matriz 401/403/200 por rol.

**Salida:** login obligatorio en frontend y backend.

### Bloque 5 — Seguridad HTTP y errores

- Agregar cabeceras de seguridad.
- Restringir CORS.
- Limitar cuerpo JSON.
- Retirar rutas de debug.
- Crear middleware global de errores.
- Mapear errores SQL y Multer a estados HTTP.

**Salida:** respuestas seguras y predecibles.

### Bloque 6 — Validación centralizada

- Definir esquemas por módulo.
- Normalizar correos y textos.
- Validar fechas, población, área y coordenadas.
- Validar relaciones territoriales antes del CRUD.

**Salida:** datos válidos antes de llegar a los modelos.

### Bloque 7 — Integridad y migraciones SQL

- Crear carpeta `database/migrations`.
- Versionar restricciones e índices.
- Definir política de eliminación sin cascada accidental.
- Usar transacciones en operaciones múltiples.
- Incorporar campos de procedencia y auditoría cuando se apruebe su modelo.

**Salida:** base preparada para datos reales.

### Bloque 8 — Gestión segura de imágenes

- Validar archivos.
- Manejar temporales.
- Eliminar imagen anterior al confirmar reemplazo.
- Eliminar imagen asociada al borrar contenido.
- Evitar rutas duplicadas y archivos huérfanos.

**Salida:** sincronización entre disco y SQL Server.

### Bloque 9 — Revisión funcional por módulo

Orden:

1. Autenticación.
2. Usuarios.
3. Departamentos.
4. Provincias.
5. Distritos.
6. Ciudades.
7. Contenido de departamentos.
8. Contenido de provincias.
9. Contenido de distritos.
10. Contenido de ciudades.

Para cada módulo: positivo, negativo, sin token, usuario, admin, duplicado, inexistente y relación bloqueada.

### Bloque 10 — Contrato SDD y OpenAPI

- Inventariar rutas reales.
- Corregir `openapi.yaml`.
- Actualizar modelo de datos.
- Actualizar matriz de trazabilidad y checklist.
- Ejecutar revisión de consistencia Spec Kit.

**Salida:** especificación, contrato y código convergentes.

### Bloque 11 — Automatización de pruebas

- Backend: Vitest/Jest y Supertest.
- API: Postman y Newman.
- Frontend: React Testing Library.
- E2E: Playwright.
- CI: GitHub Actions con instalación, lint, build y tests.

**Salida:** regresión repetible y reportable.

### Bloque 12 — Rendimiento del frontend

- Comprimir y redimensionar multimedia.
- Carga diferida de páginas.
- Lazy loading de imágenes.
- Dividir bundles pesados.
- Comparar diseño con evidencia de Fase 0.

**Salida:** misma apariencia con carga más eficiente.

### Bloque 13 — Carga controlada de datos reales

- Registrar primero Ayacucho.
- Verificar relaciones, contenido, imágenes y fuentes.
- Registrar luego Cusco como segundo caso.
- Ampliar solo después de la validación completa.

**Salida:** contenido real confiable y verificable.

## 5. Estrategia de commits

Ejemplos:

```text
chore(env): unificar configuración de desarrollo
fix(auth): validar usuario y rol actual en base de datos
fix(routes): exigir autenticación en consultas territoriales
fix(errors): centralizar respuestas HTTP
fix(upload): eliminar imágenes huérfanas
feat(validation): agregar esquemas de datos territoriales
docs(openapi): sincronizar contrato con API real
test(api): automatizar autenticación y usuarios
perf(frontend): optimizar recursos multimedia
```

## 6. Criterio de finalización

PLAN-002 se cierra cuando todos los requisitos P1 están implementados y validados, la API está documentada, las pruebas críticas son repetibles y el diseño coincide con la línea base aprobada.
