# Modelo de Datos - PERU APP

## 1. Identificación del documento

**Código:** DATA-001  
**Proyecto:** PERU APP  
**Especificación asociada:** SPEC-001  
**Plan asociado:** PLAN-001  
**Metodología:** Spec-Driven Development  
**Herramienta:** GitHub Spec Kit  
**Base de datos:** SQL Server  
**Responsable:** Erwin Brayam Inca Pauccara  
**Año:** 2026  

---

## 2. Propósito del modelo de datos

El presente documento describe el modelo de datos de PERU APP, una plataforma web turístico-educativa orientada a organizar y difundir información territorial, turística y gastronómica del Perú.

El modelo de datos permite documentar las entidades principales del sistema, sus campos, relaciones, claves primarias, claves foráneas y reglas de integridad. Este artefacto forma parte del SDD y se deriva de la especificación funcional `spec.md` y del plan técnico `plan.md`.

---

## 3. Descripción general

PERU APP utiliza una base de datos relacional en SQL Server. La información se organiza mediante entidades territoriales y turísticas.

El sistema maneja información sobre:

- Usuarios.
- Departamentos.
- Provincias.
- Distritos.
- Ciudades.
- Lugares turísticos.
- Comidas típicas.
- Contenido turístico por provincia.
- Contenido gastronómico por provincia.
- Contenido turístico por distrito.
- Contenido gastronómico por distrito.
- Contenido turístico por ciudad.
- Contenido gastronómico por ciudad.

---

## 4. Entidades principales del sistema

| Código | Entidad | Descripción |
|---|---|---|
| E-001 | Usuarios | Almacena usuarios registrados y administradores. |
| E-002 | Departamentos | Almacena departamentos del Perú. |
| E-003 | Provincias | Almacena provincias asociadas a departamentos. |
| E-004 | Distritos | Almacena distritos asociados a provincias. |
| E-005 | Ciudades | Almacena ciudades asociadas a distritos; provincia y departamento se obtienen por la jerarquía territorial. |
| E-006 | LugaresTuristicos | Almacena lugares turísticos asociados a departamentos. |
| E-007 | ComidasTipicas | Almacena comidas típicas asociadas a departamentos. |
| E-008 | LugaresTuristicosProvincias | Almacena lugares turísticos asociados a provincias. |
| E-009 | ComidasTipicasProvincias | Almacena comidas típicas asociadas a provincias. |
| E-010 | LugaresTuristicosDistritos | Almacena lugares turísticos asociados a distritos. |
| E-011 | ComidasTipicasDistritos | Almacena comidas típicas asociadas a distritos. |
| E-012 | LugaresTuristicosCiudades | Almacena lugares turísticos asociados a ciudades. |
| E-013 | ComidasTipicasCiudades | Almacena comidas típicas asociadas a ciudades. |

---

## 5. Diseño de tablas

### 5.1. Tabla `Usuarios`

#### Descripción

Almacena la información de los usuarios registrados en PERU APP. Permite diferenciar entre usuarios normales y administradores.

#### Campos principales

| Campo | Tipo sugerido | Descripción | Restricción |
|---|---|---|---|
| id | INT | Identificador único del usuario. | PK, Identity |
| nombres | VARCHAR(100) | Nombres del usuario. | NOT NULL |
| apellidos | VARCHAR(100) | Apellidos del usuario. | NOT NULL |
| fecha_nacimiento | DATE | Fecha de nacimiento del usuario. | NOT NULL |
| email | VARCHAR(150) | Correo electrónico del usuario. | UNIQUE, NOT NULL |
| password | VARCHAR(255) | Contraseña cifrada. | NOT NULL |
| rol | VARCHAR(20) | Rol del usuario. | NOT NULL |
| fecha_creacion | DATETIME | Fecha de registro. | DEFAULT GETDATE() |

#### Reglas

- El campo `email` debe ser único.
- El campo `password` debe almacenarse cifrado.
- El campo `rol` solo debe permitir valores `usuario` o `admin`.
- Los usuarios registrados desde el formulario público deben crearse con rol `usuario`.

#### Requerimientos relacionados

- RF-001 Registro de usuario.
- RF-002 Inicio de sesión.
- RF-004 Control de acceso por rol.
- RF-014 Gestión de usuarios.

---

### 5.2. Tabla `Departamentos`

#### Descripción

Almacena la información general de los departamentos del Perú.

#### Campos principales

| Campo | Tipo sugerido | Descripción | Restricción |
|---|---|---|---|
| id | INT | Identificador único del departamento. | PK, Identity |
| nombre | VARCHAR(120) | Nombre del departamento. | NOT NULL |
| capital | VARCHAR(120) | Capital del departamento. | NULL |
| region | VARCHAR(80) | Región natural o geográfica. | NULL |
| descripcion | VARCHAR(MAX) | Descripción general. | NULL |
| imagen | VARCHAR(255) | URL HTTPS de Cloudinary o ruta local de desarrollo. | NULL |
| introduccion | VARCHAR(MAX) | Introducción turística administrable. | NULL |
| fecha_creacion | DATETIME | Fecha de creación del registro. | DEFAULT GETDATE() |

#### Reglas

- Un departamento puede tener muchas provincias.
- Un departamento puede tener muchas ciudades de forma indirecta, mediante sus provincias y distritos.
- Un departamento puede tener muchos lugares turísticos.
- Un departamento puede tener muchas comidas típicas.
- La introducción turística puede ser editada desde el panel administrador.

#### Requerimientos relacionados

- RF-006 Exploración de departamentos.
- RF-007 Detalle de departamento.
- RF-015 Gestión de departamentos.
- RF-021 Mapa de departamento.

---

### 5.3. Tabla `Provincias`

#### Descripción

Almacena provincias asociadas a un departamento.

#### Campos principales

| Campo | Tipo sugerido | Descripción | Restricción |
|---|---|---|---|
| id | INT | Identificador único de la provincia. | PK, Identity |
| departamento_id | INT | Departamento al que pertenece. | FK |
| nombre | VARCHAR(120) | Nombre de la provincia. | NOT NULL |
| capital | VARCHAR(120) | Capital de la provincia. | NULL |
| descripcion | VARCHAR(MAX) | Descripción de la provincia. | NULL |
| poblacion | VARCHAR(80) | Información poblacional referencial. | NULL |
| festividad | VARCHAR(180) | Festividad representativa. | NULL |
| actividad_economica | VARCHAR(180) | Actividad económica principal. | NULL |
| imagen | VARCHAR(255) | URL HTTPS de Cloudinary o ruta local de desarrollo. | NULL |
| fecha_creacion | DATETIME | Fecha de creación del registro. | DEFAULT GETDATE() |

#### Reglas

- Una provincia pertenece a un departamento.
- Una provincia puede tener muchos distritos.
- Una provincia puede tener lugares turísticos y comidas típicas asociadas.

#### Requerimientos relacionados

- RF-008 Exploración de provincias.
- RF-016 Gestión de provincias.

---

### 5.4. Tabla `Distritos`

#### Descripción

Almacena distritos asociados a una provincia.

#### Campos principales

| Campo | Tipo sugerido | Descripción | Restricción |
|---|---|---|---|
| id | INT | Identificador único del distrito. | PK, Identity |
| provincia_id | INT | Provincia a la que pertenece. | FK |
| nombre | VARCHAR(120) | Nombre del distrito. | NOT NULL |
| tipo_zona | VARCHAR(120) | Tipo de zona. | NULL |
| nivel_desarrollo | VARCHAR(120) | Nivel de desarrollo referencial. | NULL |
| descripcion | VARCHAR(MAX) | Descripción del distrito. | NULL |
| imagen | VARCHAR(255) | URL HTTPS de Cloudinary o ruta local de desarrollo. | NULL |
| fecha_creacion | DATETIME | Fecha de creación del registro. | DEFAULT GETDATE() |

#### Reglas

- Un distrito pertenece a una provincia.
- Un distrito puede tener lugares turísticos y comidas típicas asociadas.

#### Requerimientos relacionados

- RF-009 Exploración de distritos.
- RF-017 Gestión de distritos.

---

### 5.5. Tabla `Ciudades`

#### Descripción

Almacena ciudades asociadas directamente a distritos. La provincia y el departamento se obtienen mediante la jerarquía territorial.

#### Campos principales

| Campo | Tipo sugerido | Descripción | Restricción |
|---|---|---|---|
| id | INT | Identificador único de la ciudad. | PK, Identity |
| distrito_id | INT | Distrito al que pertenece. | FK |
| nombre | VARCHAR(120) | Nombre de la ciudad. | NOT NULL |
| actividad_principal | VARCHAR(180) | Actividad principal de la ciudad. | NULL |
| atractivo_turistico | VARCHAR(180) | Atractivo turístico destacado. | NULL |
| clima | VARCHAR(120) | Clima referencial. | NULL |
| descripcion | VARCHAR(MAX) | Descripción de la ciudad. | NULL |
| imagen | VARCHAR(255) | URL HTTPS de Cloudinary o ruta local de desarrollo. | NULL |
| fecha_creacion | DATETIME | Fecha de creación del registro. | DEFAULT GETDATE() |

#### Reglas

- Una ciudad pertenece a un distrito.
- La provincia y el departamento de la ciudad se obtienen a través del distrito y su provincia.
- Una ciudad puede tener lugares turísticos y comidas típicas asociadas.

#### Requerimientos relacionados

- RF-010 Exploración de ciudades.
- RF-018 Gestión de ciudades.

---

### 5.6. Tabla `LugaresTuristicos`

#### Descripción

Almacena lugares turísticos asociados a departamentos. Esta entidad incluye información básica y ampliada para mostrar una página de detalle turístico.

#### Campos principales

| Campo | Tipo sugerido | Descripción | Restricción |
|---|---|---|---|
| id | INT | Identificador único del lugar turístico. | PK, Identity |
| departamento_id | INT | Departamento asociado. | FK |
| nombre | VARCHAR(160) | Nombre del lugar turístico. | NOT NULL |
| descripcion | VARCHAR(MAX) | Descripción breve. | NULL |
| imagen | VARCHAR(255) | URL HTTPS o ruta local de la imagen principal. | NULL |
| ubicacion_referencial | VARCHAR(255) | Ubicación textual referencial. | NULL |
| acerca | VARCHAR(MAX) | Información ampliada del lugar. | NULL |
| recomendaciones_antes | VARCHAR(MAX) | Recomendaciones antes del viaje. | NULL |
| recomendaciones_durante | VARCHAR(MAX) | Recomendaciones durante el viaje. | NULL |
| clima | VARCHAR(120) | Clima del destino. | NULL |
| altura | VARCHAR(120) | Altura referencial. | NULL |
| provincia | VARCHAR(120) | Provincia referencial. | NULL |
| distrito | VARCHAR(120) | Distrito referencial. | NULL |
| origen_nombre | VARCHAR(160) | Nombre del origen referencial. | NULL |
| origen_busqueda | VARCHAR(255) | Texto usado para buscar coordenadas del origen. | NULL |
| destino_nombre | VARCHAR(180) | Nombre del destino. | NULL |
| destino_busqueda | VARCHAR(255) | Texto usado para buscar coordenadas del destino. | NULL |
| imagen_2 | VARCHAR(255) | URL HTTPS o ruta local de imagen adicional 1. | NULL |
| imagen_3 | VARCHAR(255) | URL HTTPS o ruta local de imagen adicional 2. | NULL |
| imagen_4 | VARCHAR(255) | URL HTTPS o ruta local de imagen adicional 3. | NULL |
| fecha_creacion | DATETIME | Fecha de creación. | DEFAULT GETDATE() |

#### Reglas

- Un lugar turístico pertenece a un departamento.
- El detalle del lugar turístico puede mostrar imagen principal y hasta tres imágenes adicionales.
- El destino de la ruta se mantiene fijo porque corresponde al lugar turístico.
- El origen registrado por el administrador sirve como ruta referencial.
- El usuario puede ingresar un origen personalizado sin modificar la base de datos.

#### Requerimientos relacionados

- RF-011 Visualización de lugares turísticos.
- RF-012 Detalle de lugar turístico.
- RF-019 Gestión de lugares turísticos.
- RF-022 Ruta referencial hacia lugar turístico.
- RF-023 Ruta personalizada del usuario.

---

### 5.7. Tabla `ComidasTipicas`

#### Descripción

Almacena comidas típicas asociadas a departamentos.

#### Campos principales

| Campo | Tipo sugerido | Descripción | Restricción |
|---|---|---|---|
| id | INT | Identificador único de la comida típica. | PK, Identity |
| departamento_id | INT | Departamento asociado. | FK |
| nombre | VARCHAR(160) | Nombre de la comida típica. | NOT NULL |
| descripcion | VARCHAR(MAX) | Descripción de la comida. | NULL |
| imagen | VARCHAR(255) | URL HTTPS de Cloudinary o ruta local. | NULL |
| origen_descripcion | VARCHAR(MAX) | Descripción de origen o tradición. | NULL |
| fecha_creacion | DATETIME | Fecha de creación. | DEFAULT GETDATE() |

#### Reglas

- Una comida típica pertenece a un departamento.
- La comida típica debe mostrarse en el detalle del departamento.
- El administrador puede gestionar comidas típicas desde el panel de contenido.

#### Requerimientos relacionados

- RF-013 Visualización de comidas típicas.
- RF-020 Gestión de comidas típicas.

---

### 5.8. Tabla `LugaresTuristicosProvincias`

#### Descripción

Almacena lugares turísticos asociados a provincias.

#### Campos principales

| Campo | Tipo sugerido | Descripción | Restricción |
|---|---|---|---|
| id | INT | Identificador único. | PK, Identity |
| provincia_id | INT | Provincia asociada. | FK |
| nombre | VARCHAR(160) | Nombre del lugar turístico. | NOT NULL |
| descripcion | VARCHAR(MAX) | Descripción. | NULL |
| imagen | VARCHAR(255) | URL HTTPS de Cloudinary o ruta local. | NULL |
| ubicacion_referencial | VARCHAR(255) | Ubicación referencial. | NULL |
| fecha_creacion | DATETIME | Fecha de creación. | DEFAULT GETDATE() |

#### Reglas

- Un lugar turístico provincial pertenece a una provincia.
- Se muestra dentro del contexto de exploración o detalle provincial.

#### Requerimientos relacionados

- RF-011 Visualización de lugares turísticos.
- RF-016 Gestión de provincias.

---

### 5.9. Tabla `ComidasTipicasProvincias`

#### Descripción

Almacena comidas típicas asociadas a provincias.

#### Campos principales

| Campo | Tipo sugerido | Descripción | Restricción |
|---|---|---|---|
| id | INT | Identificador único. | PK, Identity |
| provincia_id | INT | Provincia asociada. | FK |
| nombre | VARCHAR(160) | Nombre de la comida típica. | NOT NULL |
| descripcion | VARCHAR(MAX) | Descripción. | NULL |
| imagen | VARCHAR(255) | URL HTTPS de Cloudinary o ruta local. | NULL |
| origen_descripcion | VARCHAR(MAX) | Origen o tradición. | NULL |
| fecha_creacion | DATETIME | Fecha de creación. | DEFAULT GETDATE() |

#### Reglas

- Una comida típica provincial pertenece a una provincia.
- Se muestra dentro del contexto de exploración o detalle provincial.

#### Requerimientos relacionados

- RF-013 Visualización de comidas típicas.
- RF-016 Gestión de provincias.

---

### 5.10. Tabla `LugaresTuristicosDistritos`

#### Descripción

Almacena lugares turísticos asociados a distritos.

#### Campos principales

| Campo | Tipo sugerido | Descripción | Restricción |
|---|---|---|---|
| id | INT | Identificador único. | PK, Identity |
| distrito_id | INT | Distrito asociado. | FK |
| nombre | VARCHAR(160) | Nombre del lugar turístico. | NOT NULL |
| descripcion | VARCHAR(MAX) | Descripción. | NULL |
| imagen | VARCHAR(255) | URL HTTPS de Cloudinary o ruta local. | NULL |
| ubicacion_referencial | VARCHAR(255) | Ubicación referencial. | NULL |
| fecha_creacion | DATETIME | Fecha de creación. | DEFAULT GETDATE() |

#### Reglas

- Un lugar turístico distrital pertenece a un distrito.
- Se muestra dentro del contexto de exploración o detalle distrital.

#### Requerimientos relacionados

- RF-011 Visualización de lugares turísticos.
- RF-017 Gestión de distritos.

---

### 5.11. Tabla `ComidasTipicasDistritos`

#### Descripción

Almacena comidas típicas asociadas a distritos.

#### Campos principales

| Campo | Tipo sugerido | Descripción | Restricción |
|---|---|---|---|
| id | INT | Identificador único. | PK, Identity |
| distrito_id | INT | Distrito asociado. | FK |
| nombre | VARCHAR(160) | Nombre de la comida típica. | NOT NULL |
| descripcion | VARCHAR(MAX) | Descripción. | NULL |
| imagen | VARCHAR(255) | URL HTTPS de Cloudinary o ruta local. | NULL |
| origen_descripcion | VARCHAR(MAX) | Origen o tradición. | NULL |
| fecha_creacion | DATETIME | Fecha de creación. | DEFAULT GETDATE() |

#### Reglas

- Una comida típica distrital pertenece a un distrito.
- Se muestra dentro del contexto de exploración o detalle distrital.

#### Requerimientos relacionados

- RF-013 Visualización de comidas típicas.
- RF-017 Gestión de distritos.

---

### 5.12. Tabla `LugaresTuristicosCiudades`

#### Descripción

Almacena lugares turísticos asociados a ciudades.

#### Campos principales

| Campo | Tipo sugerido | Descripción | Restricción |
|---|---|---|---|
| id | INT | Identificador único. | PK, Identity |
| ciudad_id | INT | Ciudad asociada. | FK |
| nombre | VARCHAR(160) | Nombre del lugar turístico. | NOT NULL |
| descripcion | VARCHAR(MAX) | Descripción. | NULL |
| imagen | VARCHAR(255) | URL HTTPS de Cloudinary o ruta local. | NULL |
| ubicacion_referencial | VARCHAR(255) | Ubicación referencial. | NULL |
| fecha_creacion | DATETIME | Fecha de creación. | DEFAULT GETDATE() |

#### Reglas

- Un lugar turístico de ciudad pertenece a una ciudad.
- Se muestra dentro del contexto de exploración o detalle de ciudad.

#### Requerimientos relacionados

- RF-011 Visualización de lugares turísticos.
- RF-018 Gestión de ciudades.

---

### 5.13. Tabla `ComidasTipicasCiudades`

#### Descripción

Almacena comidas típicas asociadas a ciudades.

#### Campos principales

| Campo | Tipo sugerido | Descripción | Restricción |
|---|---|---|---|
| id | INT | Identificador único. | PK, Identity |
| ciudad_id | INT | Ciudad asociada. | FK |
| nombre | VARCHAR(160) | Nombre de la comida típica. | NOT NULL |
| descripcion | VARCHAR(MAX) | Descripción. | NULL |
| imagen | VARCHAR(255) | URL HTTPS de Cloudinary o ruta local. | NULL |
| origen_descripcion | VARCHAR(MAX) | Origen o tradición. | NULL |
| fecha_creacion | DATETIME | Fecha de creación. | DEFAULT GETDATE() |

#### Reglas

- Una comida típica de ciudad pertenece a una ciudad.
- Se muestra dentro del contexto de exploración o detalle de ciudad.

#### Requerimientos relacionados

- RF-013 Visualización de comidas típicas.
- RF-018 Gestión de ciudades.

---

## 6. Relaciones del modelo de datos

### 6.1. Relaciones territoriales

| Relación | Tipo | Descripción |
|---|---|---|
| Departamentos → Provincias | 1 a N | Un departamento tiene muchas provincias. |
| Provincias → Distritos | 1 a N | Una provincia tiene muchos distritos. |
| Distritos → Ciudades | 1 a N | Un distrito tiene muchas ciudades. La provincia y el departamento se derivan de la jerarquía territorial. |

### 6.2. Relaciones turísticas y gastronómicas por departamento

| Relación | Tipo | Descripción |
|---|---|---|
| Departamentos → LugaresTuristicos | 1 a N | Un departamento tiene muchos lugares turísticos. |
| Departamentos → ComidasTipicas | 1 a N | Un departamento tiene muchas comidas típicas. |

### 6.3. Relaciones turísticas y gastronómicas por provincia

| Relación | Tipo | Descripción |
|---|---|---|
| Provincias → LugaresTuristicosProvincias | 1 a N | Una provincia tiene muchos lugares turísticos. |
| Provincias → ComidasTipicasProvincias | 1 a N | Una provincia tiene muchas comidas típicas. |

### 6.4. Relaciones turísticas y gastronómicas por distrito

| Relación | Tipo | Descripción |
|---|---|---|
| Distritos → LugaresTuristicosDistritos | 1 a N | Un distrito tiene muchos lugares turísticos. |
| Distritos → ComidasTipicasDistritos | 1 a N | Un distrito tiene muchas comidas típicas. |

### 6.5. Relaciones turísticas y gastronómicas por ciudad

| Relación | Tipo | Descripción |
|---|---|---|
| Ciudades → LugaresTuristicosCiudades | 1 a N | Una ciudad tiene muchos lugares turísticos. |
| Ciudades → ComidasTipicasCiudades | 1 a N | Una ciudad tiene muchas comidas típicas. |

---

## 7. Diagrama lógico textual

```text
Usuarios
  └── rol: usuario | admin

Departamentos
  ├── Provincias
  │     ├── Distritos
  │     │     ├── LugaresTuristicosDistritos
  │     │     ├── ComidasTipicasDistritos
  │     │     └── Ciudades
  │     │           ├── LugaresTuristicosCiudades
  │     │           └── ComidasTipicasCiudades
  │     ├── LugaresTuristicosProvincias
  │     └── ComidasTipicasProvincias
  ├── LugaresTuristicos
  └── ComidasTipicas
```

---

## 8. Reglas de integridad

### RI-001. Integridad de usuarios

No debe existir más de un usuario con el mismo correo electrónico.

### RI-002. Integridad de roles

El rol del usuario debe estar limitado a `usuario` o `admin`.

### RI-003. Integridad territorial

Una provincia debe estar asociada a un departamento existente.

### RI-004. Integridad provincial

Un distrito debe estar asociado a una provincia existente.

### RI-005. Integridad de ciudad

Una ciudad debe estar asociada a un distrito existente. La provincia y el departamento se determinan mediante la jerarquía territorial.

### RI-006. Integridad turística departamental

Un lugar turístico departamental debe estar asociado a un departamento existente.

### RI-007. Integridad gastronómica departamental

Una comida típica departamental debe estar asociada a un departamento existente.

### RI-008. Integridad de imágenes

Las imágenes deben almacenarse como rutas o referencias al archivo cargado.

### RI-009. Integridad de rutas

Los campos de origen y destino textual deben permitir calcular rutas mediante servicios externos, pero no deben impedir la visualización del lugar turístico si están vacíos.

### RI-010. Eliminación controlada

La eliminación de registros debe considerar relaciones existentes para evitar datos huérfanos.

---

## 9. Datos de mapas y rutas

### 9.1. Mapa de departamento

El mapa de departamento se maneja en el frontend mediante datos referenciales de coordenadas. No requiere una tabla independiente, ya que se utiliza como apoyo visual en la vista de detalle.

### 9.2. Ruta referencial de lugar turístico

La ruta referencial se basa en los siguientes campos de `LugaresTuristicos`:

- `origen_nombre`
- `origen_busqueda`
- `destino_nombre`
- `destino_busqueda`

Estos campos permiten que el sistema busque coordenadas mediante texto y calcule rutas por carretera.

### 9.3. Ruta personalizada del usuario

La ruta personalizada no se guarda en la base de datos. El usuario ingresa un origen temporal en la interfaz y el sistema calcula la ruta hacia el destino turístico seleccionado.

---

## 10. Relación entre modelo de datos y requerimientos

| Requerimiento | Entidades relacionadas |
|---|---|
| RF-001 | Usuarios |
| RF-002 | Usuarios |
| RF-004 | Usuarios |
| RF-006 | Departamentos |
| RF-007 | Departamentos, LugaresTuristicos, ComidasTipicas |
| RF-008 | Provincias |
| RF-009 | Distritos |
| RF-010 | Ciudades |
| RF-011 | LugaresTuristicos, LugaresTuristicosProvincias, LugaresTuristicosDistritos, LugaresTuristicosCiudades |
| RF-012 | LugaresTuristicos |
| RF-013 | ComidasTipicas, ComidasTipicasProvincias, ComidasTipicasDistritos, ComidasTipicasCiudades |
| RF-014 | Usuarios |
| RF-015 | Departamentos |
| RF-016 | Provincias |
| RF-017 | Distritos |
| RF-018 | Ciudades |
| RF-019 | LugaresTuristicos |
| RF-020 | ComidasTipicas |
| RF-021 | Departamentos |
| RF-022 | LugaresTuristicos |
| RF-023 | LugaresTuristicos |
| RF-025 | Todas las entidades documentadas |

---

## 11. Consideraciones técnicas

1. El modelo de datos está diseñado para un proyecto académico.
2. Las imágenes se almacenan como rutas de archivo y no como binarios dentro de SQL Server.
3. Las rutas personalizadas del usuario no se almacenan para evitar registros innecesarios.
4. Los servicios externos de mapas y rutas no forman parte de la base de datos.
5. El modelo permite ampliar información turística por diferentes niveles territoriales.
6. La estructura puede evolucionar si en el futuro se desea normalizar más entidades o agregar nuevas funcionalidades.

---

## 12. Criterios de aceptación del modelo de datos

El modelo de datos será considerado válido si cumple con los siguientes criterios:

1. Documenta las entidades principales del sistema.
2. Describe campos principales por tabla.
3. Identifica claves primarias y foráneas.
4. Explica relaciones territoriales.
5. Explica relaciones turísticas y gastronómicas.
6. Incluye datos necesarios para rutas turísticas.
7. Relaciona entidades con requerimientos funcionales.
8. Es coherente con los módulos implementados en PERU APP.
9. Permite construir el contrato API REST.
10. Permite construir la matriz de trazabilidad y el TDD.
