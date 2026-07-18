# Estructura final antes de Cloudinary

## Conservar en el repositorio

- `.github/`
- `.specify/`
- `.speckit/`
- `backend/`
- `database/`
- `docs/`
- `frontend/`
- `scripts/`
- `specs/`
- `tests/`
- `.gitignore`
- `README.md`

## Conservar solo localmente

- `.git/`
- `backend/.env`
- `frontend/.env`
- `tests/qa-credentials.local.ps1`
- `backend/uploads/` hasta terminar la migracion a Cloudinary

## No incluir en ZIP ni despliegue

- `node_modules/`
- `dist/`
- `.vite/`
- `reports/`
- `.env`
- `.git/`
- credenciales QA locales
- PNG antiguos sustituidos por WebP
- archivos `LEEME` temporales de correcciones

## Estado tecnico revisado

- SDD y OpenAPI cerrados localmente.
- 14 suites y 376 pruebas aprobadas.
- Cobertura general superior al 87 por ciento.
- Backend y frontend con cero vulnerabilidades registradas en Bloque 9.
- Recursos WebP y video optimizado presentes.
- Pendiente inmediato: Cloudinary.
