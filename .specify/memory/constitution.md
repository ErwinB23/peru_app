# Constitución del Proyecto PERU APP

**Versión:** 1.4.0  
**Fecha de actualización:** 18 de julio de 2026  
**Cambio principal:** Se formaliza Cloudinary como almacenamiento persistente de imágenes, la línea base de datos limpia y la puerta documental previa a Azure SQL.  

## 1. Nombre del proyecto

PERU APP: Plataforma web turístico-educativa basada en Spec-Driven Development para la difusión turística del Perú, 2026.

## 2. Propósito del proyecto

PERU APP tiene como propósito organizar y difundir información turística, territorial y gastronómica del Perú mediante una plataforma web accesible, visual y educativa. El sistema permite consultar información sobre departamentos, provincias, distritos, ciudades, lugares turísticos y comidas típicas, facilitando al usuario una exploración ordenada del país.

El proyecto se desarrolla bajo el enfoque de Spec-Driven Development, utilizando GitHub Spec Kit como herramienta para documentar especificaciones, plan técnico, tareas, modelo de datos, contratos API y trazabilidad.

## 3. Principios del desarrollo

### 3.1. Especificación como fuente principal de verdad

Toda funcionalidad importante del sistema debe estar respaldada por una especificación documentada. El desarrollo no debe basarse únicamente en código, sino en requerimientos, escenarios, reglas de negocio y criterios de aceptación definidos previamente.

### 3.2. Trazabilidad del sistema

Cada requerimiento debe poder relacionarse con su diseño, implementación, módulo correspondiente y prueba funcional. La trazabilidad permite justificar que el sistema implementado responde a los objetivos del proyecto.

### 3.3. Desarrollo incremental e iterativo

PERU APP debe desarrollarse por incrementos funcionales. Cada incremento debe aportar una parte verificable del sistema, como autenticación, exploración territorial, información turística, panel administrador, mapas o documentación.

### 3.4. Arquitectura cliente-servidor

El sistema debe mantener una separación clara entre cliente y servidor. El frontend se encarga de la interfaz e interacción con el usuario, mientras que el backend procesa solicitudes, aplica reglas de negocio y se comunica con la base de datos.

### 3.5. Arquitectura por capas

El proyecto debe organizarse por capas para facilitar su mantenimiento:

- Capa de presentación: React y Vite.
- Capa de servicios frontend: consumo de API REST.
- Capa de rutas backend: definición de endpoints.
- Capa de controladores backend: lógica de solicitud y respuesta.
- Capa de modelos backend: acceso a datos.
- Capa de base de datos: SQL Server.

### 3.6. Separación de responsabilidades

Cada archivo, componente, controlador, modelo o servicio debe cumplir una responsabilidad clara. No se deben mezclar funciones de interfaz, lógica de negocio y acceso a datos dentro de una misma capa.

### 3.7. API REST documentada

La comunicación entre frontend y backend debe realizarse mediante una API REST con solicitudes HTTP y respuestas JSON. Los endpoints principales deben documentarse mediante un contrato API.

### 3.8. Seguridad básica del sistema

El sistema debe implementar autenticación, protección de rutas y control de acceso por roles. Las funcionalidades administrativas deben estar disponibles únicamente para usuarios con rol administrador.

### 3.8.1. Autenticación obligatoria para el acceso al sistema

El acceso a PERU APP requiere una sesión autenticada. Las únicas operaciones funcionales públicas permitidas son el registro y el inicio de sesión. Toda consulta territorial, turística, gastronómica, de perfil o de administración debe exigir un token JWT válido. Para el despliegue puede existir `GET /api/health` como excepción técnica pública, siempre que devuelva únicamente el estado general del servicio y no exponga datos de negocio, credenciales, conteos, servidor, base de datos ni detalles internos.

La protección visual del frontend no sustituye la protección del backend. Cada endpoint protegido debe validar el token, comprobar que el usuario aún existe en la base de datos y utilizar el rol vigente almacenado en SQL Server. Un usuario eliminado, un token expirado o un administrador cuyo rol haya cambiado no debe conservar acceso mediante información antigua contenida en el token.

Política de acceso oficial:

- Público funcional: `POST /api/auth/register` y `POST /api/auth/login`.
- Público técnico: `GET /api/health`, exclusivamente con una respuesta mínima y no sensible.
- Usuario autenticado: consultas territoriales, turísticas y gastronómicas, perfil y cierre de sesión.
- Administrador autenticado: gestión de usuarios y operaciones de creación, actualización y eliminación de contenido.

### 3.9. Roles del sistema

PERU APP maneja dos roles principales:

- Usuario: puede explorar información turística, territorial y gastronómica.
- Administrador: puede gestionar usuarios, departamentos, provincias, distritos, ciudades, lugares turísticos y comidas típicas.

### 3.10. Gestión administrativa controlada

El panel administrador debe permitir registrar, editar, consultar y eliminar información del sistema según los permisos definidos. Las operaciones administrativas deben estar protegidas por autenticación y rol administrador.

### 3.11. Experiencia de usuario clara y consistente

La interfaz debe ser visualmente ordenada, responsive y coherente con el propósito turístico-educativo del sistema. Debe evitarse el exceso de elementos visuales que dificulten la navegación.

### 3.12. Uso de mapas y rutas

Los mapas y rutas deben utilizarse como apoyo visual para mejorar la experiencia del usuario. El sistema puede mostrar rutas referenciales o personalizadas hacia lugares turísticos, manteniendo el destino asociado al lugar seleccionado.

### 3.13. Alcance funcional delimitado

PERU APP no incluye reservas turísticas, pagos en línea, comercio electrónico, paquetes turísticos, integración con agencias de viaje ni compras dentro de la plataforma. Su finalidad principal es organizar y difundir información turística.

### 3.14. Control de versiones

Todo cambio relevante del sistema debe registrarse mediante Git y GitHub. Las mejoras deben trabajarse en ramas separadas y documentarse mediante commits descriptivos.

### 3.15. Validación mediante pruebas

Toda funcionalidad implementada debe poder verificarse mediante pruebas funcionales documentadas. El TDD debe derivarse del SDD y debe validar los módulos principales del sistema.

### 3.16. Evidencia antes de cierre

Una tarea no se considera terminada solo porque exista documentación o código. Para declararla validada debe existir una prueba ejecutada y una evidencia verificable. Los artefactos SDD deben distinguir como mínimo los estados `Pendiente`, `Brecha`, `Implementado, pendiente de validación` y `Validado`.

### 3.17. Coherencia entre especificación, código y pruebas

La Constitución, `spec.md`, `plan.md`, `tasks.md`, OpenAPI, rutas, pruebas y matriz de trazabilidad deben describir el mismo comportamiento. Cuando se detecte una contradicción, el estado se registra como brecha y no se oculta mediante una marca de tarea completada.

### 3.18. Persistencia de imágenes en producción

Las imágenes cargadas por los administradores deben almacenarse en un servicio persistente externo cuando la aplicación se despliegue. Cloudinary es el proveedor oficial de producción. SQL Server almacena la URL HTTPS y el backend conserva el control de carga, validación, reemplazo y eliminación. El modo local de `backend/uploads` se admite únicamente para desarrollo o contingencia y no constituye almacenamiento permanente en Render.

## 4. Tecnologías oficiales del proyecto

Las tecnologías definidas para PERU APP son:

- Frontend: React, Vite, JavaScript, HTML5 y CSS3.
- Backend: Node.js y Express.js.
- Base de datos: SQL Server.
- API: REST con respuestas JSON.
- Autenticación: JWT y control de roles.
- Mapas: Leaflet, OpenStreetMap, Nominatim y OSRM.
- Iconos: Lucide React.
- Control de versiones: Git y GitHub.
- Documentación SDD: GitHub Spec Kit.
- Editor de desarrollo: Visual Studio Code.
- Gestor de paquetes: npm.
- Almacenamiento de imágenes en producción: Cloudinary.
- Despliegue objetivo: Vercel, Render y Azure SQL.

## 5. Módulos principales del sistema

PERU APP comprende los siguientes módulos:

1. Autenticación y registro de usuarios.
2. Inicio de sesión.
3. Control de roles.
4. Gestión de usuarios.
5. Exploración de departamentos.
6. Exploración de provincias.
7. Exploración de distritos.
8. Exploración de ciudades.
9. Visualización de lugares turísticos.
10. Visualización de comidas típicas.
11. Gestión de contenido turístico y gastronómico.
12. Detalle de lugares turísticos.
13. Mapa de ubicación por departamento.
14. Ruta por carretera hacia lugares turísticos.
15. Ruta personalizada desde el origen ingresado por el usuario.
16. Panel administrador.

## 6. Reglas de calidad

El sistema debe cumplir las siguientes reglas de calidad:

- Adecuación funcional: las funcionalidades deben cumplir su propósito.
- Usabilidad: la interfaz debe ser fácil de comprender y utilizar.
- Seguridad: toda ruta funcional, excepto registro e inicio de sesión, debe requerir autenticación válida; el health check técnico se limita a información no sensible.
- Autorización vigente: los permisos deben comprobarse con el usuario y rol actuales almacenados en la base de datos.
- Denegación por defecto: una solicitud sin token, con token inválido, expirado o asociado a un usuario inexistente debe ser rechazada.
- Mantenibilidad: el código debe organizarse por módulos, capas y responsabilidades.
- Consistencia visual: los componentes deben mantener una línea gráfica uniforme.
- Disponibilidad de información: los datos deben mostrarse de forma clara y ordenada.
- Trazabilidad: los requerimientos deben relacionarse con diseño, implementación y pruebas.

## 7. Artefactos del SDD

El SDD del proyecto debe incluir como mínimo los siguientes artefactos:

- `constitution.md`: principios y reglas del proyecto.
- `spec.md`: especificación funcional del sistema.
- `plan.md`: plan técnico de implementación.
- `tasks.md`: tareas del desarrollo.
- `data-model.md`: modelo de datos.
- `openapi.yaml`: contrato de API REST.
- `traceability-matrix.md`: matriz de trazabilidad.
- `README-SDD.md`: resumen general del SDD.

## 8. Criterios de aceptación de la documentación

La documentación será considerada válida si cumple con los siguientes criterios:

1. Describe el sistema PERU APP de acuerdo con lo realmente implementado.
2. Incluye los módulos principales del sistema.
3. Relaciona requerimientos, diseño, implementación y pruebas.
4. Describe la arquitectura cliente-servidor y por capas.
5. Documenta los roles de usuario y administrador.
6. Incluye el modelo de datos principal.
7. Incluye el contrato de API REST.
8. Permite construir posteriormente el TDD.
9. Mantiene coherencia con el informe académico del proyecto.
10. Está versionada mediante Git y GitHub.

## 9. Restricciones del proyecto

PERU APP se desarrolla como un proyecto académico. Por ello, el sistema prioriza la funcionalidad, documentación, trazabilidad y presentación del producto, sin pretender cubrir todas las necesidades de una plataforma turística comercial.

El sistema depende de la información registrada por el administrador. Las rutas y mapas pueden depender de servicios externos de mapas y enrutamiento, por lo que su disponibilidad puede variar según conexión a internet o disponibilidad del servicio.

## 10. Declaración final

Esta constitución guía el desarrollo, documentación, validación y mantenimiento de PERU APP. Cualquier especificación, plan, tarea, modelo de datos, contrato API o prueba funcional debe respetar los principios definidos en este documento.

## 10. Puerta de cierre SDD y despliegue

El cierre documental de una especificación exige, como mínimo:

1. Constitución, especificación, plan y tareas coherentes.
2. Contrato API sincronizado con las rutas reales.
3. Matriz de trazabilidad con requisito, código, prueba y evidencia.
4. Suite automatizada con umbrales explícitos.
5. Lint y build aprobados.
6. Riesgos y pendientes declarados sin marcarlos falsamente como completados.

El estado **Aprobado para despliegue** no equivale a **Aceptado en producción**. La aceptación final requiere evidencias del frontend, backend, base de datos e imágenes funcionando desde sus URLs públicas.

## 11. Política de métricas y evidencia

- Los porcentajes de cobertura deben indicar el conjunto real de archivos medidos.
- Las pruebas unitarias, de integración, API y E2E deben contabilizarse por separado.
- Los reportes generados pueden permanecer fuera de Git; el resumen verificable debe copiarse a `docs/estabilizacion/evidencias`.
- Toda cifra incorporada al SDD debe provenir de una ejecución o de una validación interna identificada como tal.

## 12. Gobierno y control de cambios

- La Constitución utiliza versionado semántico.
- Cambios incompatibles en principios obligatorios incrementan la versión mayor.
- Nuevas puertas de calidad incrementan la versión menor.
- Correcciones editoriales incrementan la versión de parche.
- Antes de fusionar la rama de estabilización se ejecutará `scripts/block6-sdd-closure.ps1 -RunQualityChecks`.
