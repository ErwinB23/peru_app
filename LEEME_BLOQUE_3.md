# BLOQUE 3 — Validaciones, integridad y errores HTTP

Este paquete fue construido sobre `PERU_APP_FINAL ACTUALIZADO.zip`, después de comprobar que el Bloque 2 ya estaba aplicado.

## Qué implementa

1. Validación centralizada para autenticación, usuarios y todos los módulos territoriales y turísticos.
2. Normalización de números recibidos como texto mediante `multipart/form-data`.
3. Validación de campos obligatorios, correo, contraseña, fecha, área, población, coordenadas, IDs y paginación.
4. Comprobación de relaciones territoriales antes de crear o actualizar.
5. Rechazo de nombres duplicados dentro del mismo departamento, provincia, distrito o ciudad.
6. Respuestas uniformes con `error`, `code` y `details`.
7. Estados HTTP 400, 404, 409, 413, 415 y 500 correctamente diferenciados.
8. Traducción segura de errores SQL Server sin mostrar consultas, contraseñas ni información interna.
9. Limpieza de imágenes recién cargadas cuando una solicitud falla.
10. Visualización de errores de campo desde el interceptor Axios.
11. Actualización de tareas, casos de prueba, trazabilidad, inventario de rutas y checklist SDD.

## Qué no modifica

- No reemplaza `backend/.env` ni `frontend/.env`.
- No cambia tus credenciales ni tu base de datos.
- No añade ni elimina tablas.
- No modifica `package.json` ni instala dependencias nuevas.
- No elimina imágenes ya utilizadas.
- No incluye `.git`, `node_modules`, `dist`, `.vite` ni respaldos.

## Aplicación

1. Haz una copia de seguridad o confirma que tu estado actual esté guardado en Git.
2. Descomprime este ZIP.
3. Copia **todo su contenido** en la raíz de `PERU_APP_FINAL`.
4. Selecciona **Reemplazar los archivos en el destino**.
5. Continúa trabajando en la rama:

```powershell
002-estabilizacion-calidad
```

## Ejecución

### Terminal 1 — backend

```powershell
cd C:\Users\ACER\OneDrive\Desktop\PERU_APP_FINAL\backend
npm run dev
```

### Terminal 2 — frontend

```powershell
cd C:\Users\ACER\OneDrive\Desktop\PERU_APP_FINAL\frontend
npm run lint
npm run build
npm run dev
```

### Terminal 3 — comprobación del Bloque 3

```powershell
cd C:\Users\ACER\OneDrive\Desktop\PERU_APP_FINAL
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\block3-validation-check.ps1 -RunFrontendChecks
```

La evidencia se guardará en:

```text
docs\estabilizacion\evidencias\bloque-3\<fecha-hora>\
```

## Resultados esperados del script

```text
GET /api/health                         -> 200
GET /api/departamentos sin token        -> 401
POST /api/auth/register con body vacío  -> 400
POST /api/auth/login con correo inválido -> 400
GET /api/ruta-que-no-existe             -> 404
npm run lint                             -> OK
npm run build                            -> OK
```

## Pruebas manuales con administrador

Realiza al menos estas comprobaciones desde el sistema o Postman/Thunder Client:

| Caso | Resultado esperado |
|---|---:|
| Crear un nombre duplicado en el mismo ámbito | 409 |
| Enviar un ID territorial inexistente | 404 |
| Enviar población negativa o coordenada inválida | 400 |
| Consultar o modificar un ID inexistente | 404 |
| Eliminar un registro que tiene hijos | 409 |
| Cargar una imagen distinta de JPG, PNG o WEBP | 415 |
| Cargar una imagen mayor de 5 MB | 413 |

Ejemplo de validación:

```json
{
  "error": "Datos inválidos",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "field": "email",
      "message": "El correo no tiene un formato válido"
    }
  ]
}
```

## Guardar en Git

Cuando las comprobaciones sean correctas:

```powershell
cd C:\Users\ACER\OneDrive\Desktop\PERU_APP_FINAL
git status
git add -A
git commit -m "feat(validation): implementar bloque 3 de validaciones y errores HTTP"
git push
```

## Nota

La eliminación de la imagen anterior después de una actualización exitosa y la eliminación del archivo asociado después de borrar un registro se cerrarán en el bloque específico de integridad de imágenes. Las pruebas automatizadas con Jest/Supertest, Newman y Playwright corresponden al bloque de pruebas.
