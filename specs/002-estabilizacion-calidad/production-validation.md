# Validación Funcional de Producción — PERU APP

## Identificación

- **Código:** VAL-PROD-002
- **Fecha:** 18 de julio de 2026
- **Rama:** `002-estabilizacion-calidad`
- **Entorno:** producción
- **Responsable:** propietario del proyecto
- **Método:** validación manual con cuentas existentes autorizadas

## URLs verificadas

- Frontend: `https://peru-app-frontend.vercel.app`
- Backend: `https://peru-app-backend.onrender.com`
- API: `https://peru-app-backend.onrender.com/api`
- Health: `https://peru-app-backend.onrender.com/api/health`

## Prerrequisitos

- Backend desplegado en Render.
- Frontend desplegado en Vercel.
- AWS RDS disponible.
- Cloudinary configurado.
- CORS con el dominio definitivo.
- Cuenta administradora existente.
- Cuenta normal existente para verificar autorización.

## Resultados

| ID | Prueba | Resultado esperado | Resultado |
|---|---|---|---|
| VP-001 | Abrir frontend | Página de acceso visible | Aprobado |
| VP-002 | Login administrador | Acceso a `/home` | Aprobado |
| VP-003 | Recargar `/home` | Mantener navegación sin 404 | Aprobado |
| VP-004 | Consultar departamentos | Datos e imágenes visibles | Aprobado |
| VP-005 | Consultar provincias, distritos y ciudades | Datos cargados | Aprobado |
| VP-006 | Crear registro temporal | Registro persistido | Aprobado |
| VP-007 | Subir imagen | URL Cloudinary asociada | Aprobado |
| VP-008 | Editar registro temporal | Cambio persistido tras F5 | Aprobado |
| VP-009 | Eliminar registro temporal | Registro e imagen retirados | Aprobado |
| VP-010 | Usuario normal intenta administrar | Acceso denegado / 403 | Aprobado |
| VP-011 | Cerrar sesión | Token retirado y acceso protegido | Aprobado |
| VP-012 | Abrir ruta privada sin sesión | Redirección al acceso | Aprobado |
| VP-013 | Revisar consola | Sin errores CORS o solicitudes a localhost durante el flujo | Aprobado |
| VP-014 | Health | Servicio, base e imageStorage operativos | Aprobado |

## Datos de prueba

Se utilizó un registro temporal identificable y se eliminó al finalizar. No se crearon cuentas QA ni se modificaron credenciales de usuarios reales.

## Observaciones

- Render puede presentar arranque en frío; una respuesta temporal 503 debe contrastarse con logs y un nuevo intento.
- Las capturas deben ocultar contraseñas, tokens, endpoints sensibles y datos personales.
- La prueba manual no sustituye todas las pruebas automatizadas; complementa las 388 pruebas Jest/Supertest y el reporte Playwright local.

## Dictamen

**VALIDACIÓN FUNCIONAL DE PRODUCCIÓN APROBADA.**

El flujo confirma la integración Vercel → Render → AWS RDS / Cloudinary y permite declarar la versión candidata 1.0.0 apta para cierre académico.
