# AGENTS.md — PERU APP

## 1. Propósito

Este archivo contiene las instrucciones operativas permanentes para OpenAI Codex CLI al trabajar en PERU APP. Debe aplicarse junto con `.specify/memory/constitution.md` y los artefactos de `specs/`.

## 2. Arquitectura vigente

- Frontend: React 19 + Vite + JavaScript + CSS propio.
- Backend: Node.js + Express.
- Base de datos: Microsoft SQL Server; producción en AWS RDS for SQL Server Express.
- Autenticación y autorización: JWT, bcrypt y control de roles vigente desde la base de datos.
- Imágenes de producción: Cloudinary.
- Frontend desplegado: Vercel.
- Backend desplegado: Render.
- Documentación: GitHub Spec Kit y OpenAPI.
- Rama estable: `main`.
- Rama base de integración: `002-estabilizacion-calidad`.

## 3. Reglas obligatorias

1. No agregar Tailwind CSS. Mantener React + Vite con hojas de estilo CSS propias.
2. No leer, imprimir, copiar, modificar ni versionar archivos `.env`, credenciales, tokens, contraseñas, claves privadas o secretos.
3. No ejecutar `git commit`, `git push`, merge, Pull Request ni despliegues sin autorización explícita del usuario.
4. No modificar directamente `main`.
5. No ejecutar operaciones destructivas contra AWS RDS, Cloudinary, Render o Vercel.
6. No ejecutar `qa:seed`, crear usuarios QA ni cambiar cuentas de producción salvo instrucción explícita.
7. No modificar archivos administrados de `.specify/templates` o `.agents/skills` durante una funcionalidad, salvo que la tarea sea actualizar la infraestructura de Spec Kit.
8. No presentar una tarea como validada si las pruebas o evidencias no fueron ejecutadas.
9. No ocultar brechas. Usar estados claros: `Pendiente`, `Brecha`, `Implementado, pendiente de validación` y `Validado`.
10. Mantener consultas SQL parametrizadas, validación de entrada, control de roles en backend y manejo seguro de imágenes.

## 4. Evolución de especificaciones

- `specs/001-peru-app` representa la línea base funcional original.
- `specs/002-estabilizacion-calidad` representa estabilización, seguridad, pruebas y despliegue.
- Cada nueva funcionalidad relevante debe crear una carpeta nueva `specs/00X-nombre-funcionalidad`.
- No reescribir carpetas históricas completas. Actualizar solo los artefactos afectados por el cambio.
- Actualizar Constitución, README, OpenAPI, modelo de datos o trazabilidad global solo cuando el cambio sea transversal o los afecte directamente.

## 5. Flujo SDD obligatorio

Para una nueva funcionalidad usar:

1. `$speckit-specify`
2. `$speckit-clarify` cuando existan dudas
3. `$speckit-plan`
4. `$speckit-tasks`
5. `$speckit-analyze`
6. `$speckit-implement`
7. `$speckit-converge`

Antes de implementar, confirmar alcance, módulos afectados, criterios de aceptación, pruebas y restricciones de seguridad.

## 6. Validaciones mínimas

### Backend

```powershell
cd backend
npm ci
npm test
```

Línea base conocida: 15 suites y 388 pruebas. Una cifra distinta debe explicarse; no debe copiarse como resultado si no fue ejecutada.

### Frontend

```powershell
cd frontend
npm ci
npm run lint
npm run build
```

La advertencia de tamaño del bundle no equivale por sí sola a un fallo de build.

### Revisión Git

```powershell
git status --short
git --no-pager diff --stat
git diff --check
```

Antes de preparar un commit, mostrar los archivos creados, modificados y eliminados.

## 7. Pruebas contra producción

- La validación manual puede usar cuentas existentes autorizadas sin revelar sus credenciales.
- No crear cuentas temporales en producción por defecto.
- No ejecutar colecciones destructivas ni seeds contra producción.
- El endpoint público de salud puede verificarse, pero no debe exponer información sensible.
- Toda operación CRUD de prueba debe usar registros claramente temporales y eliminarlos solo con autorización.

## 8. Resultado esperado al finalizar una tarea

Codex debe informar:

- Especificación y carpeta de feature utilizadas.
- Archivos creados, modificados y eliminados.
- Decisiones técnicas relevantes.
- Comandos ejecutados.
- Resultado real de lint, build y pruebas.
- Brechas o riesgos pendientes.
- Cambios que requieren autorización humana.

Codex debe detenerse antes de commit, push, merge o despliegue y pedir autorización.