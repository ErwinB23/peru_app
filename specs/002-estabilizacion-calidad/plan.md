# Plan Técnico de Cierre y Despliegue — PERU APP

## 1. Identificación

- **Código:** PLAN-002
- **Especificación:** SPEC-002
- **Estado:** cierre pre-despliegue
- **Fecha:** 15 de julio de 2026

## 2. Estrategia

La estabilización se ejecutó en incrementos verificables. Cada bloque actualizó código, pruebas y artefactos SDD. El cierre no altera la arquitectura base; consolida la fuente de verdad y crea una puerta automática antes del despliegue.

## 3. Arquitectura vigente

```text
React + Vite (frontend)
        |
        | HTTPS / JSON / JWT
        v
Node.js + Express (backend)
        |
        +--> SQL Server local / Azure SQL en producción
        |
        +--> uploads local / Cloudinary en producción
```

## 4. Bloques ejecutados

| Bloque | Resultado |
|---|---|
| 1 | Auditoría de estructura, SDD y trazabilidad. |
| 2 | JWT, rol vigente, rutas protegidas, CORS, Helmet y health check. |
| 3 | Validación central y errores HTTP uniformes. |
| 4 | Integridad SQL e imágenes locales. |
| 5 | Jest/Supertest, Newman, Playwright y CI. |
| 5.1 | Cobertura estratégica de componentes críticos. |
| 5.2 | Cobertura ampliada de todos los módulos funcionales. |
| 6 | OpenAPI 70/70, documentación final y puerta pre-despliegue. |

## 5. Puertas de calidad

### QG-01 — Coherencia SDD

Constitución, especificación, plan, tareas, contrato, casos y trazabilidad describen el mismo comportamiento.

### QG-02 — Calidad del backend

- 14 suites de referencia.
- 376 pruebas de referencia: 351 unitarias y 25 de integración.
- Umbrales mínimos S80/B70/F85/L80.

### QG-03 — Calidad del frontend

- ESLint sin errores.
- Build Vite correcto.
- Playwright implementado para autenticación y CRUD representativo.

### QG-04 — Contrato

El inventario real y OpenAPI contienen 70 operaciones equivalentes.

### QG-05 — Seguridad de repositorio

No se versionan `.env`, credenciales QA, `node_modules`, builds, uploads locales ni respaldos.

## 6. Ruta de despliegue aprobada

1. Revisar vulnerabilidades de producción con `npm audit --omit=dev`.
2. Integrar Cloudinary y migrar referencias de imágenes.
3. Crear Azure SQL y migrar esquema/datos.
4. Desplegar backend en Render.
5. Desplegar frontend en Vercel.
6. Configurar CORS con la URL definitiva.
7. Ejecutar Newman y Playwright contra producción.
8. Registrar URLs, logs y capturas en el SDD.

## 7. Estrategia de rollback

- Conservar respaldo SQL anterior a migración.
- Mantener rama y tag pre-despliegue.
- No eliminar `uploads` locales hasta confirmar Cloudinary.
- Revertir servicio de Render al último commit estable si falla el health check.
- Revertir variables de Vercel si la API pública no responde.

## 8. Criterio de finalización

El plan termina cuando la puerta local aprueba calidad y el despliegue público aprueba login, consulta, roles, CRUD, imágenes y cierre de sesión. Hasta entonces, el estado correcto es **Aprobado para desplegar**, no **Producción aceptada**.
