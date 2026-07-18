# Plan Técnico de Cierre y Despliegue — PERU APP

## 1. Identificación

- **Código:** PLAN-002
- **Especificación:** SPEC-002
- **Estado:** cierre local post-Cloudinary
- **Fecha:** 18 de julio de 2026

## 2. Estrategia

La estabilización se ejecutó en incrementos verificables. Cada bloque actualizó código, pruebas y artefactos SDD. La aplicación conserva su arquitectura cliente-servidor y añade almacenamiento remoto, seguridad de dependencias y una línea base de datos limpia.

## 3. Arquitectura vigente

```text
React + Vite + CSS propio
        |
        | HTTPS / JSON / JWT
        v
Node.js + Express
        |
        +--> SQL Server local
        |       \--> Azure SQL pendiente
        |
        +--> Cloudinary
```

El backend mantiene `IMAGE_STORAGE=local` únicamente para desarrollo y `IMAGE_STORAGE=cloudinary` para producción.

## 4. Bloques ejecutados

| Bloque | Resultado |
|---|---|
| 1 | Auditoría de estructura, SDD y trazabilidad. |
| 2 | JWT, rol vigente, rutas protegidas, CORS, Helmet y health. |
| 3 | Validación central y errores HTTP uniformes. |
| 4 | Integridad SQL y ciclo de imágenes. |
| 5 | Jest/Supertest, Newman, Playwright y CI. |
| 5.1 | Cobertura estratégica de componentes críticos. |
| 5.2 | Cobertura ampliada de módulos funcionales. |
| 6 | OpenAPI 70/70 y puerta de cierre SDD. |
| 7 | Limpieza de estructura del repositorio. |
| 8 | Optimización multimedia. |
| 9 | Actualización segura de dependencias y auditoría 0. |
| 10 | Preparación del repositorio para almacenamiento cloud. |
| 11 | Integración y validación local de Cloudinary. |
| 12 | Cierre documental posterior a Cloudinary y base limpia. |

## 5. Puertas de calidad superadas

### QG-01 — Coherencia SDD

Constitución, especificaciones, plan, tareas, contrato, casos y trazabilidad describen el comportamiento vigente.

### QG-02 — Backend

- 15 suites.
- 388 pruebas: 363 unitarias y 25 de integración.
- Cobertura S89.98/B87.48/F96.18/L89.85.

### QG-03 — Frontend

- ESLint aprobado.
- Build Vite aprobado.
- 4 pruebas Playwright sin fallos.

### QG-04 — API

- 70 operaciones sincronizadas.
- 11 solicitudes Newman.
- 17 aserciones y 0 fallos.

### QG-05 — Dependencias

- Backend producción: 0 vulnerabilidades.
- Backend completo: 0 vulnerabilidades.
- Frontend producción: 0 vulnerabilidades.
- Frontend completo: 0 vulnerabilidades.

### QG-06 — Imágenes

- Firma, MIME y tamaño validados.
- Cloudinary integrado.
- URL HTTPS persistida en SQL Server.
- Estructura local vacía mediante `.gitkeep`.

## 6. Siguiente ruta de despliegue

1. Adaptar conexión SQL para cifrado configurable.
2. Exportar la base limpia.
3. Crear/importar Azure SQL.
4. Probar backend local contra Azure.
5. Configurar carpeta Cloudinary `peru-app/production`.
6. Desplegar backend en Render.
7. Desplegar frontend en Vercel.
8. Configurar CORS definitivo.
9. Ejecutar Newman y Playwright contra URLs públicas.
10. Archivar capturas, logs y URLs.
11. Marcar aceptación final.

## 7. Estrategia de rollback

- Conservar respaldo local y BACPAC previo a Azure.
- Mantener la rama de estabilización.
- Mantener modo local de imágenes como contingencia de desarrollo.
- Revertir Render al último commit estable si falla health.
- Restaurar variables previas de Vercel si la API no responde.
- No eliminar la base local hasta validar Azure.

## 8. Riesgo técnico pendiente inmediato

La configuración actual de SQL Server usa cifrado local fijo. Antes de Azure se debe implementar soporte de variables como:

```env
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=false
```

La documentación no considera esa capacidad implementada hasta modificar y probar `backend/src/config/database.js`.

## 9. Criterio de finalización

El plan finaliza cuando Azure SQL, Render, Vercel y Cloudinary funcionan mediante HTTPS, y las pruebas públicas validan health, login, roles, CRUD, imágenes y cierre de sesión.
