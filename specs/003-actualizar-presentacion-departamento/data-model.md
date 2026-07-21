# Data Model: Actualización parcial de presentación departamental

## Resumen

La feature no introduce entidades, tablas, columnas, índices ni relaciones. Usa el modelo existente de `Departamento` y limita la transición a su atributo `introduccion`.

## Entidad Departamento

| Campo relevante | Tipo lógico | Obligatorio | Cambio permitido por esta feature |
|-----------------|-------------|-------------|-----------------------------------|
| `id` | Entero positivo | Sí | Ninguno; identifica el registro |
| `nombre` | Texto | Sí | Ninguno |
| `capital` | Texto | Sí | Ninguno |
| `region_natural` | Texto | Sí | Ninguno |
| `area_km2` | Decimal positivo | Sí | Ninguno |
| `poblacion_aprox` | Entero no negativo | Sí | Ninguno |
| `descripcion` | Texto opcional | No | Ninguno |
| `introduccion` | Texto largo opcional | No | Sustituir o retirar explícitamente |
| `imagen_fondo` | Referencia de imagen opcional | No | Ninguno |

Los demás atributos y relaciones existentes tampoco se modifican.

## Reglas de validación

- El identificador debe ser un entero mayor que cero.
- Debe existir exactamente un departamento asociado al identificador antes de actualizar.
- La solicitud debe declarar `introduccion`; omitir la propiedad es inválido.
- `introduccion` admite texto normalizado y varios párrafos.
- Un valor vacío o `null` expresa la retirada intencional y se persiste como ausencia de contenido.
- Ninguna propiedad distinta de `introduccion` es válida para la operación dedicada.

## Transición de estado

```text
Departamento existente
    |
    | administrador autorizado + entrada válida
    v
Mismo departamento con introduccion reemplazada o retirada
```

Invariantes posteriores:

- `id` no cambia.
- Los datos generales, la descripción breve, la imagen y las relaciones conservan sus valores previos.
- Si la validación, autorización o persistencia falla, `introduccion` también conserva su valor previo.

## Persistencia

La actualización se realiza sobre la columna existente `Departamentos.introduccion`, identificada mediante `id`. Ambos valores se enlazan como parámetros. No se requiere migración ni carga de datos.
