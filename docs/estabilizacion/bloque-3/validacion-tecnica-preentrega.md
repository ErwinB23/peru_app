# Validación técnica previa a la entrega — Bloque 3

## Resultado

El paquete fue revisado sobre el ZIP actualizado entregado por el usuario.

| Comprobación | Resultado |
|---|---|
| Sintaxis de `backend/src` | 54 archivos JavaScript correctos |
| Manejo centralizado de errores | 69 bloques `catch` vinculados a `handleControllerError` |
| Rutas de escritura inspeccionadas | 14 POST, 14 PUT y 13 DELETE |
| POST/PUT sin validador | 0 |
| Respuestas directas HTTP 500 en controladores | 0 |
| `npm run lint` del frontend | Correcto |
| `npm run build` del frontend | Correcto |

## Alcance comprobado

- Validación y normalización de entradas JSON y `multipart/form-data`.
- IDs enteros positivos y paginación acotada.
- Correo, contraseña, fechas, números, coordenadas y enumeraciones.
- Existencia del registro antes de editar o eliminar.
- Existencia de la relación territorial antes de crear o actualizar.
- Duplicados de nombre dentro del mismo ámbito territorial.
- Conversión de errores SQL Server a respuestas 400 o 409.
- Errores de imágenes con 413 o 415.
- Limpieza de archivos recién cargados cuando la solicitud falla.
- Presentación de detalles de validación desde Axios.

## Validación que debe ejecutarse en la computadora del proyecto

La ejecución completa de endpoints depende del SQL Server y de los datos locales. Debe ejecutarse:

```powershell
.\scripts\block3-validation-check.ps1 -RunFrontendChecks
```

Después deben probarse con un token de administrador los casos de duplicado, relación inexistente, eliminación con hijos y archivos inválidos.

## Advertencia de rendimiento existente

El build finaliza correctamente, pero Vite advierte sobre imágenes, video y un fragmento JavaScript de gran tamaño. Esta advertencia no pertenece al Bloque 3 y se atenderá antes del despliegue.
