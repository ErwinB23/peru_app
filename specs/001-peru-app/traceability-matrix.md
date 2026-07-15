# Matriz de Trazabilidad Funcional — SPEC-001

La trazabilidad técnica detallada de seguridad y pruebas está en `../002-estabilizacion-calidad/traceability-matrix.md`.

| Requisito funcional | Módulo | Contrato API / flujo | Prueba representativa | Estado pre-despliegue |
|---|---|---|---|---|
| RF-001–RF-004 | Autenticación y roles | `/auth/*`, `/users/*` | CP-AUTH/ROLE/USER | Validado |
| RF-005–RF-007 | Home y departamentos | `/departamentos/*` | CP-TERR-001 | Validado |
| RF-008 | Provincias | `/provincias/*` | CP-TERR-002 | Validado |
| RF-009 | Distritos | `/distritos/*` | CP-TERR-003 | Validado |
| RF-010 | Ciudades | `/ciudades/*` | CP-TERR-004 | Validado |
| RF-011–RF-012 | Lugares turísticos | `/lugares-turisticos*` | CP-CONT-001 | Validado |
| RF-013 | Comidas típicas | `/comidas-tipicas*` | CP-CONT-002 | Validado |
| RF-014–RF-020 | Administración CRUD | POST/PUT/DELETE protegidos | CP-ROLE/TERR/CONT | Validado |
| RF-021–RF-023 | Mapas y rutas | Frontend Leaflet/OSRM | Prueba manual/E2E | Implementado; evidencia visual |
| RF-024 | Consistencia visual | Frontend | lint/build + revisión | Implementado |
| RF-025 | SDD | `specs/001` y `specs/002` | CP-SDD-001 | Validado documentalmente |
