# PERU APP

Plataforma web turístico-educativa para organizar y difundir información territorial, turística y gastronómica del Perú. El proyecto se desarrolla mediante **Spec-Driven Development (SDD)** con **GitHub Spec Kit**.

## Estado del proyecto

- Especificación funcional principal: `specs/001-peru-app`.
- Especificación de estabilización y calidad: `specs/002-estabilizacion-calidad`.
- Rama de trabajo: `002-estabilizacion-calidad`.
- Fases 1–3: documentadas y técnicamente ejecutadas.
- Próximo bloque: autenticación, sesión, protección de rutas y pruebas de acceso.

## Arquitectura

```text
Frontend React + Vite
        ↓ API REST/JSON
Backend Node.js + Express
        ↓
SQL Server: PeruDepartamentosDB
```

El backend está organizado en rutas, controladores, modelos, middlewares y configuración. El frontend utiliza páginas, componentes, contexto de autenticación y servicios Axios.

## Tecnologías

- React 19 y Vite.
- Node.js y Express.
- SQL Server.
- JWT y bcrypt.
- Axios.
- Multer para imágenes.
- Leaflet y servicios de mapas.
- Git, GitHub y GitHub Spec Kit.

## Requisitos previos

- Node.js y npm.
- SQL Server y SQL Server Management Studio.
- Git.
- Visual Studio Code.
- Base de datos `PeruDepartamentosDB` creada mediante el script incluido.

## Instalación de la base de datos

1. Abrir SQL Server Management Studio.
2. Conectarse a la instancia local.
3. Abrir `database/peru_app_script_base_datos.sql`.
4. Ejecutar el script completo.
5. Confirmar que exista la base `PeruDepartamentosDB`.

## Configuración del backend

Desde la raíz del proyecto:

```powershell
cd backend
Copy-Item .env.example .env
```

Editar `backend/.env` con los datos reales de SQL Server:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
DB_SERVER=localhost
DB_DATABASE=PeruDepartamentosDB
DB_USER=sa
DB_PASSWORD=tu_password
DB_INSTANCE=
DB_PORT=1433
JWT_SECRET=una_clave_larga_y_segura
JWT_EXPIRE=1d
```

Para una instancia nombrada como SQL Server Express puede utilizarse `DB_INSTANCE=SQLEXPRESS` y dejar `DB_PORT` vacío, según la configuración local.

Instalar y ejecutar:

```powershell
npm install
npm run dev
```

Backend esperado: `http://localhost:5000`.

## Configuración del frontend

En otra terminal PowerShell:

```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run lint
npm run build
npm run dev
```

Contenido esperado de `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Frontend esperado: `http://localhost:5173`.

## Roles

- `usuario`: consulta información territorial, turística y gastronómica.
- `admin`: administra usuarios y contenido.

La política definida por `SPEC-002` establece que solo registro y login son públicos. Todas las demás operaciones deben validar un JWT y usar el rol vigente almacenado en SQL Server.

## Endpoints principales

### Autenticación

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`

### Administración y contenido

- `/api/users`
- `/api/departamentos`
- `/api/provincias`
- `/api/distritos`
- `/api/ciudades`
- `/api/lugares-turisticos`
- `/api/comidas-tipicas`
- Rutas de contenido asociadas a provincias, distritos y ciudades.

El contrato definitivo se mantiene en `specs/001-peru-app/openapi.yaml` y debe sincronizarse después de estabilizar las rutas.

## Flujo SDD con Spec Kit

Los artefactos principales son:

```text
.specify/memory/constitution.md
specs/001-peru-app/spec.md
specs/001-peru-app/plan.md
specs/001-peru-app/tasks.md
specs/001-peru-app/data-model.md
specs/001-peru-app/openapi.yaml
specs/001-peru-app/traceability-matrix.md
specs/002-estabilizacion-calidad/spec.md
specs/002-estabilizacion-calidad/plan.md
specs/002-estabilizacion-calidad/tasks.md
specs/002-estabilizacion-calidad/test-cases.md
```

Ciclo obligatorio de cambio:

```text
Especificar → planificar → crear tareas → implementar → probar → registrar evidencia → actualizar trazabilidad → commit
```

Antes de modificar una función debe identificarse su requisito y tarea. Después de implementarla deben registrarse el caso de prueba y la evidencia correspondiente.

## Validaciones de calidad disponibles

### Línea base

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\phase0-baseline.ps1
```

### Configuración

```powershell
.\scripts\phase2-validate-config.ps1
```

### Dependencias estables

```powershell
.\scripts\phase3-restore-stable.ps1
```

Las evidencias se almacenan en `docs/estabilizacion/evidencias`.

## Respaldo de SQL Server

1. Crear la carpeta `C:\SQLBackups`.
2. Abrir `database/maintenance/000-backup-before-stabilization.sql` en SSMS.
3. Ejecutarlo.
4. Conservar la salida que confirme `BACKUP DATABASE` y `RESTORE VERIFYONLY`.
5. No subir archivos `.bak` ni secretos al repositorio.

## Control de versiones

Antes de cada bloque:

```powershell
git status
git branch --show-current
```

Después de implementar y validar:

```powershell
git add .
git commit -m "tipo(alcance): descripcion del cambio"
git push
```

No deben versionarse `.env`, `node_modules`, `dist`, respaldos `.bak` ni archivos temporales.

## Estado de pruebas

Las evidencias manuales y de compilación se encuentran en `docs/estabilizacion/evidencias`. Las pruebas automatizadas con Supertest, Postman/Newman y Playwright se incorporarán en el bloque de validación definido en `TASKS-002`.

## Despliegue

El despliegue final requiere:

1. SQL Server accesible por el backend.
2. Backend publicado con variables de producción.
3. Frontend publicado con `VITE_API_URL` apuntando al backend público.
4. CORS restringido al dominio real del frontend.
5. Persistencia correcta de imágenes.
6. Pruebas de login, roles, consultas y CRUD en producción.

## Autor

Erwin Brayam Inca Pauccara.
