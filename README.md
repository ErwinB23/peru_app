# PERU APP

Plataforma web turístico-educativa desarrollada con **React + Vite**, **Node.js + Express** y **SQL Server**, bajo un flujo **Spec-Driven Development con GitHub Spec Kit**.

## Estado

- Rama de estabilización: `002-estabilizacion-calidad`.
- SDD pre-despliegue: cerrado y aprobado con condiciones.
- API: 70 operaciones documentadas en OpenAPI 2.0.0.
- Pruebas de referencia: 14 suites, 376 casos.
- Cobertura de referencia: S91.20 · B87.01 · F96.85 · L91.08.
- Pendiente: Cloudinary, Azure SQL, Render, Vercel y aceptación pública.

## Estructura SDD

```text
.specify/memory/constitution.md
specs/001-peru-app/                 # alcance funcional y contrato API
specs/002-estabilizacion-calidad/   # seguridad, calidad, pruebas y cierre
```

Flujo aplicado:

```text
Constitución -> especificación -> plan -> tareas -> implementación
-> pruebas -> análisis -> evidencia -> trazabilidad -> despliegue
```

## Ejecución local

Backend:

```powershell
cd backend
Copy-Item .env.example .env
npm install
npm run dev
```

Frontend:

```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run dev
```

URLs locales:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Health: `http://localhost:5000/api/health`

## Calidad

```powershell
cd backend
npm run test:coverage

cd ..\frontend
npm run lint
npm run build
```

Cierre SDD completo:

```powershell
cd C:\Users\ACER\OneDrive\Desktop\PERU_APP_FINAL
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\scripts\block6-sdd-closure.ps1 -RunQualityChecks -OpenReports
```

## Despliegue objetivo

```text
Vercel (frontend)
   -> Render (backend)
      -> Azure SQL
      -> Cloudinary
```

Consultar `specs/002-estabilizacion-calidad/deployment-readiness.md`.

## Seguridad

No versionar `.env`, credenciales QA, `node_modules`, `dist`, reportes pesados, `uploads` locales ni respaldos.

## Autor

Erwin Brayam Inca Pauccara — 2026.
