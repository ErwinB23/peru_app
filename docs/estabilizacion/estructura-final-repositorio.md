# Estructura final del repositorio PERU APP

## Directorios obligatorios

```text
PERU_APP_FINAL/
├── .github/                 # Integracion continua
├── .specify/                # Plantillas y memoria de Spec Kit
├── .speckit/                # Comandos de Spec Kit
├── backend/                 # API Node.js y pruebas
├── database/                # Migraciones y mantenimiento SQL Server
├── docs/                    # Evidencias y documentacion complementaria
├── frontend/                # React y pruebas E2E
├── scripts/                 # Automatizacion de calidad y despliegue
├── specs/                   # Especificaciones SDD 001 y 002
├── tests/                   # Postman y credenciales QA de ejemplo
├── .gitignore
└── README.md
```

## Elementos que deben salir de la raiz

- `phase0-backups/`: contiene copias ZIP completas anteriores a la estabilizacion. Se conserva fuera del proyecto como respaldo historico.
- `CIERRE_FASES_0_A_3_SDD/`: paquete antiguo de aplicacion; sus artefactos vigentes ya existen en `docs/` y `specs/`.
- `backup-documentacion-sdd-*`: copia antigua de documentos ya incorporados.
- `LEEME_BLOQUE_*.md`, manifiestos y validaciones internas: instrucciones temporales de los paquetes aplicados.

## Elementos regenerables

Pueden eliminarse antes de crear un ZIP o desplegar:

- `frontend/dist/`
- `frontend/.vite/`
- `backend/reports/`
- `frontend/reports/`

Los reportes finales relevantes se preservan en `docs/evidencias/pruebas-finales/`.

## Elementos locales que no deben subirse

- `.env` reales.
- `node_modules/`.
- `backend/uploads/` mientras se migra a Cloudinary.
- Credenciales QA locales.
- ZIP, BAK y respaldos.

## Elementos que no se deben borrar todavía

- `.git/`: necesario para continuar trabajando localmente; se excluye solo de los ZIP compartidos.
- `backend/uploads/`: puede estar referenciado por la base de datos local. Se retirara despues de migrar todas las imagenes a Cloudinary.
- `docs/estabilizacion/evidencias/`: demuestra pruebas, cobertura y cierre SDD.
- `.specify/`, `.speckit/` y `specs/`: demuestran el proceso SDD con Spec Kit.
