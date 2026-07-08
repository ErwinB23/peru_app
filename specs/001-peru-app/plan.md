# Plan Técnico - PERU APP

## 1. Identificación del plan

**Código:** PLAN-001  
**Proyecto:** PERU APP  
**Especificación asociada:** SPEC-001 - PERU APP Plataforma web turístico-educativa  
**Metodología:** Spec-Driven Development  
**Herramienta:** GitHub Spec Kit  
**Responsable:** Erwin Brayam Inca Pauccara  
**Estado:** En desarrollo  
**Año:** 2026  

---

## 2. Propósito del plan técnico

El presente plan técnico tiene como finalidad describir la estrategia de diseño e implementación de PERU APP, una plataforma web turístico-educativa orientada a organizar y difundir información territorial, turística y gastronómica del Perú.

Este documento define la arquitectura del sistema, las tecnologías utilizadas, la organización de módulos, la estructura del frontend, backend, base de datos, API REST, seguridad, mapas, rutas, control de versiones y criterios técnicos necesarios para la construcción del sistema.

El plan técnico forma parte del SDD del proyecto y se deriva de la especificación funcional definida en `spec.md`.

---

## 3. Resumen del sistema

PERU APP es una aplicación web que permite a los usuarios consultar información turística del Perú organizada por departamentos, provincias, distritos y ciudades. Además, permite visualizar lugares turísticos, comidas típicas, mapas, rutas referenciales y rutas personalizadas hacia destinos turísticos.

El sistema cuenta con dos tipos de usuario:

- Usuario: consulta información turística, territorial y gastronómica.
- Administrador: gestiona usuarios y contenido del sistema.

La solución se desarrolla mediante una arquitectura cliente-servidor, con frontend en React y Vite, backend en Node.js y Express, y base de datos en SQL Server.

---

## 4. Arquitectura general

PERU APP utiliza una arquitectura cliente-servidor.

### 4.1. Cliente

El cliente corresponde al frontend desarrollado con React y Vite. Se ejecuta en el navegador web y permite al usuario interactuar con la plataforma mediante pantallas, formularios, tarjetas, botones, mapas y rutas.

### 4.2. Servidor

El servidor corresponde al backend desarrollado con Node.js y Express. Se encarga de recibir solicitudes HTTP, validar autenticación, aplicar reglas de negocio, procesar datos y comunicarse con SQL Server.

### 4.3. Base de datos

La base de datos utiliza SQL Server para almacenararse con SQL Server.

### 4.3. Base de datos

La base de datos utiliza SQL Server para almacenar usuarios, roles, departamentos, provincias, distritos, ciudades, lugares turísticos, comidas típicas e información relacionada con mapas y rutas.

### 4.4. Servicios externos

El sistema utiliza servicios externos para visualización de mapas y cálculo de rutas:

- Leaflet para visualización interactiva de mapas.
- OpenStreetMap como proveedor de mapas.
- Nominatim para búsqueda de coordenadas mediante texto.
- OSRM para cálculo de rutas por carretera.

---

## 5. Arquitectura por capas

El sistema se organiza mediante una arquitectura por capas para separar responsabilidades y facilitar el mantenimiento.

### 5.1. Capa de presentación

Ubicada en el frontend. Está compuesta por páginas, componentes visuales, formularios, tarjetas, estilos CSS, iconos y navegación.

Tecnologías principales:

- React.
- Vite.
- JavaScript.
- HTML5.
- CSS3.
- Lucide React.
- Leaflet.

### 5.2. Capa de servicios frontend

Está compuesta por archivos de servicios que consumen la API REST del backend mediante solicitudes HTTP.

Responsabilidades:

- Enviar datos al backend.
- Obtener datos desde la API.
- Manejar respuestas JSON.
- Centralizar llamadas a endpoints.
- Mantener separada la lógica de consumo de datos.

### 5.3. Capa de rutas backend

Define los endpoints disponibles en la API REST.

Responsabilidades:

- Recibir solicitudes HTTP.
- Asociar cada endpoint con su controlador.
- Aplicar middlewares de autenticación y autorización.
- Separar rutas por módulo.

### 5.4. Capa de controladores backend

Procesa las solicitudes recibidas desde las rutas.

Responsabilidades:

- Validar datos de entrada.
- Coordinar operaciones con los modelos.
- Devolver respuestas JSON.
- Manejar errores.
- Aplicar lógica relacionada con cada operación.

### 5.5. Capa de modelos backend

Gestiona la comunicación directa con SQL Server.

Responsabilidades:

- Ejecutar consultas SQL.
- Insertar registros.
- Actualizar registros.
- Eliminar registros.
- Consultar datos.
- Devolver resultados al controlador.

### 5.6. Capa de base de datos

Almacena la información persistente del sistema.

Responsabilidades:

- Mantener tablas y relaciones.
- Garantizar integridad de datos.
- Permitir consultas estructuradas.
- Almacenar entidades principales del sistema.

---

## 6. Tecnologías utilizadas

| Área | Tecnología | Uso dentro del proyecto |
|---|---|---|
| Frontend | React | Construcción de interfaces mediante componentes |
| Frontend | Vite | Ejecución y construcción rápida del proyecto |
| Frontend | JavaScript | Lógica de interacción del lado del cliente |
| Frontend | CSS3 | Diseño visual de pantallas, tarjetas, formularios y mapas |
| Frontend | Lucide React | Iconos SVG profesionales |
| Frontend | Leaflet | Mapas interactivos |
| Backend | Node.js | Entorno de ejecución del servidor |
| Backend | Express.js | Framework para rutas, controladores y middlewares |
| Base de datos | SQL Server | Almacenamiento relacional de información |
| Seguridad | JWT | Autenticación mediante token |
| Seguridad | bcrypt | Cifrado de contraseñas |
| API | REST | Comunicación entre frontend y backend |
| Mapas | OpenStreetMap | Proveedor de mapas |
| Rutas | Nominatim | Conversión de texto a coordenadas |
| Rutas | OSRM | Cálculo de rutas por carretera |
| Control de versiones | Git | Registro de cambios |
| Repositorio | GitHub | Gestión remota del proyecto |
| SDD | GitHub Spec Kit | Organización de especificaciones y artefactos |

---

## 7. Diseño del frontend

El frontend de PERU APP está desarrollado con React y Vite. Su objetivo es presentar una interfaz clara, visual y ordenada para que el usuario pueda explorar información turística del Perú.

### 7.1. Organización del frontend

La estructura general del frontend considera:

- `src/pages`: páginas principales del sistema.
- `src/components`: componentes reutilizables.
- `src/services`: servicios para consumir la API REST.
- `src/context`: manejo del contexto de autenticación.
- `src/styles`: hojas de estilo por módulo.
- `src/assets`: imágenes, logos y recursos visuales.

### 7.2. Páginas principales

Las páginas principales del sistema son:

- AuthPage.
- Home.
- Departamentos.
- DetalleDepartamento.
- DetalleLugarTuristico.
- ExplorarProvincias.
- ExplorarDistritos.
- ExplorarCiudades.
- GestionDepartamentos.
- GestionContenidoDepartamento.
- ListaUsuarios.
- Perfil.
- Configuración.

### 7.3. Componentes principales

Los componentes principales son:

- AppHeader.
- Sidebar.
- UserDropdown.
- PrivateRoute.
- AdminRoute.
- Formularios de gestión.
- Tarjetas de contenido.
- Mapas interactivos.

### 7.4. Navegación

La navegación del frontend se realiza mediante React Router. Las rutas privadas requieren autenticación y las rutas administrativas requieren rol `admin`.

### 7.5. Diseño visual

La interfaz prioriza:

- Diseño responsive.
- Tarjetas visuales.
- Imágenes turísticas.
- Colores representativos.
- Iconos SVG profesionales.
- Botones claros.
- Separación visual por módulos.
- Mapas integrados.

---

## 8. Diseño del backend

El backend de PERU APP está desarrollado con Node.js y Express. Su objetivo es exponer una API REST para gestionar y consultar la información del sistema.

### 8.1. Organización del backend

La estructura general del backend considera:

- `src/routes`: definición de rutas.
- `src/controllers`: lógica de solicitudes y respuestas.
- `src/models`: consultas y operaciones con SQL Server.
- `src/middlewares`: autenticación, autorización y carga de archivos.
- `src/config`: configuración de base de datos.
- `uploads`: almacenamiento de imágenes cargadas.

### 8.2. Responsabilidades del backend

El backend debe:

- Registrar usuarios.
- Autenticar usuarios.
- Generar tokens JWT.
- Validar roles.
- Gestionar usuarios.
- Gestionar departamentos.
- Gestionar provincias.
- Gestionar distritos.
- Gestionar ciudades.
- Gestionar lugares turísticos.
- Gestionar comidas típicas.
- Procesar imágenes.
- Responder en formato JSON.

---

## 9. Diseño de la base de datos

La base de datos se implementa en SQL Server y almacena la información principal de PERU APP.

### 9.1. Entidades principales

Las entidades principales del sistema son:

- Usuarios.
- Departamentos.
- Provincias.
- Distritos.
- Ciudades.
- LugaresTuristicos.
- ComidasTipicas.
- Lugares turísticos por provincia.
- Lugares turísticos por distrito.
- Lugares turísticos por ciudad.
- Comidas típicas por provincia.
- Comidas típicas por distrito.
- Comidas típicas por ciudad.

### 9.2. Relaciones generales

Las relaciones generales son:

- Un departamento puede tener muchas provincias.
- Una provincia puede tener muchos distritos.
- Un departamento puede tener muchas ciudades.
- Un departamento puede tener muchos lugares turísticos.
- Un departamento puede tener muchas comidas típicas.
- Una provincia, distrito o ciudad puede tener información turística y gastronómica asociada.

### 9.3. Información ampliada de lugares turísticos

Los lugares turísticos pueden almacenar:

- Nombre.
- Descripción.
- Imagen principal.
- Imágenes adicionales.
- Ubicación referencial.
- Acerca del lugar.
- Provincia.
- Distrito.
- Clima.
- Altura.
- Recomendaciones antes del viaje.
- Recomendaciones durante el viaje.
- Origen referencial.
- Búsqueda del origen.
- Nombre del destino.
- Búsqueda del destino.

---

## 10. Diseño de la API REST

La API REST permite la comunicación entre el frontend y el backend mediante endpoints HTTP.

### 10.1. Formato de comunicación

El formato de comunicación principal es JSON.

### 10.2. Métodos HTTP utilizados

El sistema utiliza los siguientes métodos:

- `GET`: obtener información.
- `POST`: crear registros o iniciar acciones.
- `PUT`: actualizar registros.
- `DELETE`: eliminar registros.

### 10.3. Rutas principales

Las rutas principales son:

- `/api/auth`
- `/api/users`
- `/api/departamentos`
- `/api/provincias`
- `/api/distritos`
- `/api/ciudades`
- `/api/lugares-turisticos`
- `/api/comidas-tipicas`
- `/api/lugares-turisticos-provincias`
- `/api/comidas-tipicas-provincias`
- `/api/lugares-turisticos-distritos`
- `/api/comidas-tipicas-distritos`
- `/api/lugares-turisticos-ciudades`
- `/api/comidas-tipicas-ciudades`

### 10.4. Protección de endpoints

Los endpoints privados deben validar token JWT. Los endpoints administrativos deben validar token y rol `admin`.

---

## 11. Seguridad del sistema

La seguridad del sistema se implementa mediante autenticación, cifrado de contraseñas y control de roles.

### 11.1. Autenticación

El usuario inicia sesión con correo electrónico y contraseña. Si las credenciales son válidas, el backend genera un token JWT.

### 11.2. Cifrado de contraseñas

Las contraseñas se almacenan cifradas mediante bcrypt.

### 11.3. Autorización

El sistema diferencia entre rol `usuario` y rol `admin`.

### 11.4. Protección de rutas frontend

Las rutas privadas del frontend requieren que exista una sesión activa.

### 11.5. Protección de rutas backend

Las rutas administrativas del backend utilizan middlewares para verificar token y rol.

---

## 12. Diseño de mapas y rutas

PERU APP incorpora mapas y rutas como apoyo visual para mejorar la experiencia turística.

### 12.1. Mapa de departamento

El detalle de departamento muestra un mapa interactivo usando Leaflet y OpenStreetMap. Este mapa permite visualizar una ubicación referencial del departamento.

### 12.2. Ruta referencial hacia lugares turísticos

El detalle de lugar turístico puede mostrar una ruta por carretera desde un origen registrado por el administrador hacia el destino turístico.

### 12.3. Ruta personalizada del usuario

El usuario puede escribir un origen personalizado. El sistema usa ese origen para calcular una ruta hacia el lugar turístico seleccionado. El destino no se modifica porque pertenece al lugar turístico.

### 12.4. Servicios utilizados

- Nominatim: convierte texto en coordenadas.
- OSRM: calcula la ruta por carretera.
- Leaflet: muestra la ruta en el mapa.

### 12.5. Consideración técnica

Si los servicios externos no responden correctamente, el sistema puede mostrar un mensaje de error o una ruta referencial alternativa.

---

## 13. Gestión de imágenes

El sistema permite registrar imágenes para departamentos, lugares turísticos y comidas típicas.

### 13.1. Imágenes principales

Cada entidad turística puede tener una imagen principal para presentación visual.

### 13.2. Galería de lugar turístico

El detalle de lugar turístico puede mostrar imagen principal y hasta tres imágenes adicionales.

### 13.3. Almacenamiento

Las imágenes cargadas se almacenan en el backend dentro de carpetas de uploads y se referencian mediante rutas accesibles desde el frontend.

---

## 14. Estrategia de implementación

La implementación se organiza por incrementos funcionales.

### Incremento 1. Autenticación y usuarios

Incluye registro, inicio de sesión, cierre de sesión, JWT, bcrypt y roles.

### Incremento 2. Información territorial

Incluye departamentos, provincias, distritos y ciudades.

### Incremento 3. Información turística y gastronómica

Incluye lugares turísticos y comidas típicas asociadas a niveles territoriales.

### Incremento 4. Panel de administración

Incluye gestión CRUD de usuarios y contenidos.

### Incremento 5. Detalle turístico ampliado

Incluye página de detalle de lugares turísticos, galería, recomendaciones e información general.

### Incremento 6. Mapas y rutas

Incluye mapa de departamento, ruta referencial por carretera y ruta personalizada del usuario.

### Incremento 7. Mejora visual

Incluye iconos profesionales, consistencia de interfaz y refinamiento visual.

### Incremento 8. Documentación SDD

Incluye constitución, especificación, plan, tareas, modelo de datos, API y trazabilidad.

### Incremento 9. Documentación TDD

Incluye casos de prueba funcionales y validación de módulos.

---

## 15. Estrategia de control de versiones

El proyecto utiliza Git y GitHub para controlar cambios.

### 15.1. Rama principal

La rama `main` contiene la versión estable del proyecto.

### 15.2. Ramas de mejora

Cada mejora importante se trabaja en una rama separada, por ejemplo:

- `mejora-introduccion-departamento`
- `detalle-lugares-turisticos-departamento`
- `mejora-iconos-lucide`
- `ruta-personalizada-usuario`
- `documentacion-sdd-spec-kit`

### 15.3. Commits

Los commits deben ser descriptivos y representar cambios concretos.

Ejemplos:

- `Inicializa Spec Kit y constitucion del proyecto`
- `Agrega especificacion funcional de PERU APP`
- `Agrega plan tecnico del SDD`
- `Agrega modelo de datos del sistema`
- `Agrega matriz de trazabilidad del SDD`

---

## 16. Estrategia de validación

La validación del sistema se realizará mediante dos enfoques:

### 16.1. Validación funcional

Se verificará que los módulos principales funcionen según lo especificado.

Módulos a validar:

- Registro.
- Login.
- Cierre de sesión.
- Control de roles.
- Departamentos.
- Provincias.
- Distritos.
- Ciudades.
- Lugares turísticos.
- Comidas típicas.
- Panel administrador.
- Mapas.
- Rutas referenciales.
- Rutas personalizadas.

### 16.2. Validación documental

Se verificará que los artefactos del SDD estén completos y relacionados con el sistema implementado.

Artefactos a validar:

- `constitution.md`
- `spec.md`
- `plan.md`
- `tasks.md`
- `data-model.md`
- `openapi.yaml`
- `traceability-matrix.md`
- `README-SDD.md`

---

## 17. Relación con TDD

El TDD se construirá después del SDD y tomará como base los requerimientos funcionales definidos en `spec.md`.

Cada caso de prueba del TDD debe relacionarse con:

- Código de requerimiento.
- Módulo.
- Objetivo de prueba.
- Precondición.
- Datos de entrada.
- Pasos.
- Resultado esperado.
- Resultado obtenido.
- Estado.

---

## 18. Criterios de aceptación del plan técnico

El plan técnico será considerado válido si:

1. Describe la arquitectura general del sistema.
2. Define las tecnologías utilizadas.
3. Explica la organización del frontend.
4. Explica la organización del backend.
5. Describe la base de datos.
6. Describe la API REST.
7. Incluye seguridad y roles.
8. Incluye mapas y rutas.
9. Define incrementos de implementación.
10. Permite construir los siguientes artefactos del SDD.
11. Sirve como base para el TDD.

---

## 19. Consideraciones finales

El presente plan técnico organiza la implementación de PERU APP de acuerdo con Spec-Driven Development. Su finalidad es mantener coherencia entre lo especificado, lo diseñado, lo implementado y lo que posteriormente será probado mediante el TDD.

Este documento debe mantenerse actualizado si se agregan nuevos módulos, tecnologías o cambios relevantes en la arquitectura del sistema.