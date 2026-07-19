---
name: peru-app-validacion
description: Ejecuta la validación técnica local y segura de PERU APP cuando el usuario diga "ejecuta las pruebas", "valida el proyecto", "corre todas las pruebas", "revisa que todo funcione" o invoque $peru-app-validacion. Incluye pruebas Jest del backend, lint y build del frontend, sincronización OpenAPI y Playwright solo cuando pueda ejecutarse de forma local y no destructiva. Nunca debe tocar producción, sembrar usuarios QA, modificar pruebas para hacerlas pasar, ni hacer commit, push, merge o despliegue.
---

# Validación técnica local de PERU APP

Ejecuta una validación reproducible, conservadora y de solo comprobación del repositorio PERU APP.

## Objetivo

Comprobar el estado técnico del proyecto local mediante:

1. Estado de Git y rama activa.
2. Pruebas automatizadas del backend.
3. Lint y compilación del frontend.
4. Sincronización entre rutas reales y OpenAPI.
5. Pruebas Playwright solamente cuando estén configuradas para ejecución local segura.
6. Confirmación de que las validaciones no dejaron cambios inesperados.

## Reglas obligatorias de seguridad

- Trabaja desde la raíz del repositorio.
- Lee `AGENTS.md` y la Constitución antes de ejecutar comandos.
- No leas, muestres, copies ni modifiques archivos `.env`.
- Puedes comprobar si un `.env` existe, pero no abrir su contenido.
- No ejecutes `qa:seed`.
- No crees usuarios QA.
- No ejecutes Newman, Postman, `test:api` ni colecciones remotas salvo autorización humana explícita.
- No crees, edites ni elimines registros en AWS RDS.
- No subas, reemplaces ni elimines recursos en Cloudinary.
- No hagas solicitudes a Render, Vercel, AWS o Cloudinary como parte de esta validación local, salvo autorización humana explícita.
- No modifiques código, configuración o pruebas para hacer que una validación pase.
- No instales ni actualices dependencias sin pedir autorización.
- No ejecutes `git add`, `git commit`, `git push`, `merge`, `rebase`, `reset --hard`, `clean`, despliegues ni cambios de rama.
- No cambies archivos de producción.
- Solicita aprobación antes de iniciar servidores temporales no definidos por los scripts existentes del proyecto.
- Si detectas que una prueba puede usar servicios o datos reales, no la ejecutes; explica el riesgo.

## Fase 1: inspección previa

Ejecuta desde la raíz:

```powershell
git branch --show-current
git status --short
git rev-parse --show-toplevel
```

Comprueba que:

- El directorio sea el repositorio esperado.
- La rama activa sea la que el usuario desea validar.
- No existan cambios inesperados.

Si ya existen cambios locales, no los descartes. Regístralos en el informe y continúa solo con validaciones que no los alteren.

Inspecciona, sin modificar:

- `backend/package.json`
- `frontend/package.json`
- configuración Playwright existente;
- `scripts/check-openapi-sync.mjs`;
- archivos `.env.example`, cuando sea necesario;
- `AGENTS.md`.

No leas archivos `.env`.

## Fase 2: backend

Si las dependencias ya están instaladas, ejecuta desde `backend`:

```powershell
npm test
```

Reporta:

- suites totales;
- suites aprobadas y fallidas;
- pruebas totales;
- pruebas aprobadas y fallidas;
- cobertura, cuando el comando la genere;
- advertencias relevantes.

Estas pruebas deben ser unitarias o de integración local con mocks. Si el comando intenta conectarse a una base real o a un servicio cloud, cancélalo y explica el riesgo.

No ejecutes automáticamente:

```powershell
npm run qa:seed
npm run test:api
```

## Fase 3: frontend

Desde `frontend`, ejecuta:

```powershell
npm run lint
npm run build
```

Reporta:

- errores y advertencias de lint;
- resultado del build;
- tamaño o advertencias relevantes del bundle;
- archivos generados ignorados por Git.

Una advertencia de tamaño de bundle no equivale por sí sola a un fallo.

## Fase 4: sincronización OpenAPI

Desde la raíz, si existe el script, ejecuta:

```powershell
node .\scripts\check-openapi-sync.mjs
```

Reporta:

- cantidad de rutas reales;
- cantidad de operaciones OpenAPI;
- diferencias detectadas.

No modifiques el contrato automáticamente si existe una diferencia.

## Fase 5: Playwright

Ejecuta Playwright únicamente si se cumplen todas estas condiciones:

1. Existe una configuración o script E2E definido en el proyecto.
2. Los servidores requeridos son locales.
3. No utiliza cuentas reales ni datos de producción.
4. No ejecuta operaciones destructivas.
5. No requiere leer `.env`.
6. No necesita crear un servidor improvisado o modificar pruebas para funcionar.

Antes de ejecutarlo:

- inspecciona el script y la configuración;
- explica brevemente qué servidores locales necesita;
- solicita aprobación si hay que iniciar procesos temporales.

Usa el script oficial del proyecto si existe. No inventes un comando ni un servidor mock ad hoc.

Si Playwright no puede ejecutarse de forma segura, márcalo como:

```text
OMITIDO POR SEGURIDAD
```

y explica exactamente por qué.

## Fase 6: revisión final

Regresa a la raíz y ejecuta:

```powershell
git status --short
git diff --check
```

Compara el estado final con el estado inicial.

No borres archivos generados ni descartes cambios sin autorización.

## Manejo de fallos

Cuando una validación falle:

1. Conserva la salida relevante.
2. No cambies inmediatamente el código.
3. Distingue entre:
   - fallo real del proyecto;
   - dependencia ausente;
   - configuración local incompleta;
   - prueba insegura o vinculada a producción;
   - problema de entorno.
4. Continúa con las demás validaciones independientes y seguras.
5. Propón el siguiente paso, pero no lo ejecutes si implica modificaciones.

## Formato obligatorio del informe final

Entrega un resumen como este:

```text
VALIDACIÓN TÉCNICA PERU APP

Rama:
Estado inicial de Git:

Backend:
- Comando:
- Suites:
- Pruebas:
- Cobertura:
- Resultado: APROBADO / FALLIDO / OMITIDO

Frontend lint:
- Resultado:
- Errores:
- Advertencias:

Frontend build:
- Resultado:
- Advertencias:

OpenAPI:
- Rutas reales:
- Operaciones documentadas:
- Resultado:

Playwright:
- Resultado: APROBADO / FALLIDO / OMITIDO POR SEGURIDAD
- Motivo:

Estado final de Git:
Archivos modificados por la validación:
Riesgos o pendientes:
Conclusión general:
```

Finaliza confirmando explícitamente:

- si el repositorio quedó limpio;
- si se modificó algún archivo;
- si alguna validación fue omitida;
- que no se ejecutaron commit, push, merge ni despliegue.