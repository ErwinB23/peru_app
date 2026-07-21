# Quickstart: Validación local de presentación departamental

## Objetivo

Demostrar localmente que un administrador puede actualizar solo `introduccion`, que ningún otro campo cambia y que el `PUT` completo conserva su contrato. Esta guía no autoriza pruebas contra producción ni creación de usuarios QA.

## Prerrequisitos

- Dependencias locales instaladas mediante los archivos de bloqueo del proyecto.
- Base de datos local de desarrollo disponible con un departamento conocido.
- Cuenta administrativa local existente; no registrar credenciales en comandos, archivos o evidencias.
- Ningún servicio configurado contra AWS RDS, Render, Vercel o Cloudinary de producción.

## 1. Pruebas automatizadas del backend

```powershell
Set-Location backend
npm ci
npm test
```

Resultado esperado:

- Pasan los casos de actualización parcial, validación, autorización y recurso inexistente.
- Se demuestra que los atributos distintos de `introduccion` no cambian.
- Continúan pasando los casos existentes del `PUT` completo.
- La cifra real de suites y pruebas se reporta desde la ejecución; cualquier diferencia frente a la línea base de 15 suites y 388 pruebas se explica.

## 2. Calidad del frontend

```powershell
Set-Location ../frontend
npm ci
npm run lint
npm run build
```

Resultado esperado:

- El servicio específico y la pantalla no introducen errores de lint.
- El frontend compila correctamente. Una advertencia de tamaño del bundle se documenta, pero por sí sola no se trata como fallo.

## 3. Sincronización del contrato

Desde la raíz del repositorio:

```powershell
Set-Location ..
node scripts/check-openapi-sync.mjs
```

Resultado esperado: la ruta real y `specs/001-peru-app/openapi.yaml` están sincronizadas con el contrato de [contracts/departamentos-introduccion.openapi.yaml](./contracts/departamentos-introduccion.openapi.yaml).

## 4. Escenario funcional local

1. Iniciar backend y frontend locales usando la configuración de desarrollo autorizada.
2. Iniciar sesión con una cuenta administrativa local existente.
3. Abrir la gestión de contenido de un departamento y anotar sus datos generales actuales.
4. Cambiar solamente la presentación y pulsar **Guardar presentación**.
5. Confirmar el mensaje de éxito y recargar la vista.
6. Verificar que el texto persiste y que nombre, capital, región, área, población e imagen mantienen sus valores.
7. Vaciar el texto, guardar y comprobar que la presentación se retira sin afectar los demás datos.

Resultado esperado: ambos guardados terminan en una sola acción, sin errores por campos generales ausentes.

## 5. Escenarios negativos

- Solicitud sin token: rechazo sin modificación.
- Usuario local sin rol administrador: rechazo sin modificación.
- ID inválido o inexistente: error coherente sin creación de registros.
- Cuerpo sin `introduccion`, con tipo inválido o con propiedades adicionales: error de validación.
- `PUT /api/departamentos/:id` sin sus campos generales: continúa devolviendo error de validación.

## 6. Revisión Git

```powershell
git status --short
git --no-pager diff --stat
git diff --check
```

Antes de cualquier commit futuro se deben mostrar archivos creados, modificados y eliminados. Este flujo se detiene antes de commit, push, merge o despliegue.
