# Índice de Evidencias — SPEC-002

## Evidencia técnica existente

| Evidencia | Ubicación | Estado |
|---|---|---|
| Línea base | `docs/estabilizacion/evidencias/fase-0/` | Archivada |
| Seguridad | `docs/estabilizacion/evidencias/bloque-2/` | Archivada |
| Validaciones | `docs/estabilizacion/evidencias/bloque-3/` | Archivada |
| Integridad | `docs/estabilizacion/evidencias/bloque-4/` | Archivada |
| Jest | `docs/evidencias/pruebas-finales/jest-results.json` | 388/388 |
| Cobertura | `docs/evidencias/pruebas-finales/jest-coverage-summary.json` | S89.98/B87.48/F96.18/L89.85 |
| Playwright | `docs/evidencias/pruebas-finales/playwright-report.html` y JUnit | 4 flujos; 0 fallos |
| Newman | `backend/reports/newman/` y colección de `tests/postman/` | Último reporte no válido como evidencia final por cuentas QA eliminadas |
| Cierre SDD | `docs/estabilizacion/evidencias/bloque-6/` | Archivada |
| Dependencias | `docs/estabilizacion/evidencias/bloque-9/` | Sin vulnerabilidades reportadas |
| Cloudinary | `docs/estabilizacion/evidencias/bloque-11/` | Integración archivada |
| Cierre precloud | `docs/estabilizacion/evidencias/bloque-12/` | Archivada |
| Validación producción | `specs/002-estabilizacion-calidad/production-validation.md` | Registrada |

## Capturas finales requeridas para el informe o anexos

Guardar las imágenes en `docs/estabilizacion/evidencias/despliegue/` o insertarlas directamente en el informe. Nombres sugeridos:

| Código | Captura | Criterio |
|---|---|---|
| EV-PROD-01 | `01-github-rama-produccion.png` | Repositorio y rama sin secretos. |
| EV-PROD-02 | `02-render-servicio-live.png` | Servicio backend en estado operativo. |
| EV-PROD-03 | `03-health-api.png` | JSON de `/api/health` con estado `ok`. |
| EV-PROD-04 | `04-vercel-ready.png` | Deployment de producción listo. |
| EV-PROD-05 | `05-frontend-inicio.png` | Página pública de acceso. |
| EV-PROD-06 | `06-login-admin.png` | Login correcto sin mostrar contraseña. |
| EV-PROD-07 | `07-datos-imagenes.png` | Datos e imágenes cargados. |
| EV-PROD-08 | `08-crud-crear.png` | Registro temporal creado. |
| EV-PROD-09 | `09-crud-editar.png` | Registro temporal editado. |
| EV-PROD-10 | `10-crud-eliminar.png` | Eliminación confirmada. |
| EV-PROD-11 | `11-cloudinary-activo.png` | Recurso en carpeta de producción sin mostrar API secret. |
| EV-PROD-12 | `12-rds-disponible.png` | Instancia RDS disponible; ocultar endpoint si el informe será público. |
| EV-PROD-13 | `13-rol-403.png` | Usuario normal sin acceso administrativo. |
| EV-PROD-14 | `14-ruta-f5.png` | Ruta interna recargada sin 404. |
| EV-PROD-15 | `15-jest-388.png` | 15 suites y 388 pruebas aprobadas. |
| EV-PROD-16 | `16-cobertura.png` | Resumen de cobertura. |
| EV-PROD-17 | `17-lint-build.png` | ESLint y build aprobados. |
| EV-PROD-18 | `18-openapi-70-70.png` | Sincronización OpenAPI. |

## Reglas de seguridad para capturas

No mostrar:

- contraseñas;
- `JWT_SECRET`;
- `CLOUDINARY_API_SECRET`;
- cookies o tokens;
- contenido completo de `.env`;
- hashes de contraseñas;
- datos personales de usuarios;
- direcciones IP residenciales;
- scripts SQL con información privada.

Los secretos y reportes regenerables no se versionan. Solo se conservan resúmenes y resultados necesarios para la trazabilidad académica.
