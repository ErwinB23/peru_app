# Fase 2 — Configuración y entorno

## Propósito

Eliminar inconsistencias de configuración y centralizar el acceso a variables de entorno sin alterar el diseño ni los flujos funcionales existentes.

## Requisitos

### RF-CONF-001 — Configuración centralizada del backend

El backend debe cargar y validar desde un único módulo las variables necesarias para iniciar el servidor, conectarse a SQL Server y firmar tokens JWT.

### RF-CONF-002 — Variables obligatorias

El inicio del backend debe detenerse con un mensaje claro cuando falte alguna de estas variables:

- `DB_SERVER`
- `DB_DATABASE`
- `DB_USER`
- `DB_PASSWORD`
- `JWT_SECRET`

### RF-CONF-003 — Base de datos coherente

El archivo de ejemplo debe usar `PeruDepartamentosDB`, que es el nombre definido en el script SQL del proyecto.

### RF-CONF-004 — Cliente HTTP único

Los servicios de autenticación del frontend deben utilizar la instancia Axios común para evitar URLs y configuraciones duplicadas.

### RF-CONF-005 — Conservación visual

La fase no debe modificar componentes, estilos, rutas visuales ni recursos multimedia.

## Criterios de aceptación

- El backend pasa la verificación de sintaxis.
- El frontend pasa `npm run lint`.
- El frontend pasa `npm run build`.
- El backend inicia con el archivo `.env` existente.
- Registro, login, consulta y actualización de perfil siguen funcionando.
- No cambia la apariencia del frontend.
