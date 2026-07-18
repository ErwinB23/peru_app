# Estructura final del repositorio PERU APP

## Estructura obligatoria

```text
PERU_APP_FINAL/
├── .github/
├── .specify/
├── .speckit/
├── backend/
│   ├── scripts/
│   ├── src/
│   ├── tests/
│   └── uploads/       # Solo carpetas y .gitkeep
├── database/
├── docs/
├── frontend/
├── scripts/
├── specs/
├── tests/
├── .gitignore
└── README.md
```

## Estado de almacenamiento

- Cloudinary es el almacenamiento persistente.
- `backend/uploads` queda disponible solo para modo local.
- Git conserva la estructura mediante `.gitkeep`.
- Las imágenes reales están excluidas.
- No se debe borrar `.gitkeep`.

## No deben estar en la raíz

- `LEEME_BLOQUE_*.md`.
- Manifiestos temporales.
- ZIP, BAK o respaldos.
- `node_modules`.
- `dist` o `.vite`.
- `.env`.
- reportes regenerables.

## Directorios esenciales

- `.specify`, `.speckit` y `specs`: SDD con Spec Kit.
- `.github`: integración continua.
- `database`: scripts SQL.
- `docs`: evidencias.
- `tests`: Postman y ejemplos QA.
- `scripts`: puertas de calidad y despliegue.

## Archivos locales

`.git` permanece en la carpeta de trabajo, pero se excluye de cualquier ZIP compartido.

Los `.env` permanecen localmente y están ignorados por Git.

## Estado previo a Azure

La raíz está ordenada, Cloudinary está integrado, la base local está limpia y la siguiente modificación funcional corresponde al cifrado de Azure SQL.
