# Checklist de Puerta de Despliegue

| Control | Estado | Evidencia / observación |
|---|---|---|
| Rama correcta | Completado | `002-estabilizacion-calidad` |
| `git status` limpio antes del commit | Verificar al aplicar archivos | Ejecutar en la raíz |
| `.env` y credenciales fuera de Git | Completado | `.gitignore` y revisión del repositorio |
| OpenAPI 70/70 | Completado | `check-openapi-sync.mjs` |
| Jest y cobertura | Completado | 15 suites, 388 pruebas |
| ESLint | Completado | Código de salida 0 |
| Vite build | Completado | Build aprobado |
| Auditoría npm | Completado | Sin vulnerabilidades reportadas en cierre |
| Respaldo SQL privado | Completado | Fuera del repositorio |
| Cloudinary | Completado | Activo en producción |
| AWS RDS | Completado | Conectado desde Render |
| Health de Render | Completado | Validación final aprobada |
| Vercel consume API | Completado | Flujo funcional aprobado |
| CORS definitivo | Completado | Dominio Vercel configurado |
| Rutas SPA | Completado | `frontend/vercel.json` |
| Newman de producción | No aplica en este cierre | No se crean cuentas QA; decisión documentada |
| Playwright de producción | No ejecutado | Existe evidencia local; producción validada manualmente |
| Validación manual | Completado | `production-validation.md` |
| Capturas finales | Pendiente documental | Seguir `evidence-index.md` |

## Resultado

La puerta técnica de despliegue está aprobada. Las capturas son un pendiente académico, no un bloqueo funcional.
