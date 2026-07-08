# Tareas del Desarrollo - PERU APP

## 1. Identificación del documento

**Código:** TASKS-001  
**Proyecto:** PERU APP  
**Especificación asociada:** SPEC-001  
**Plan asociado:** PLAN-001  
**Metodología:** Spec-Driven Development  
**Herramienta:** GitHub Spec Kit  
**Responsable:** Erwin Brayam Inca Pauccara  
**Año:** 2026  

---

## 2. Propósito del documento

El presente documento tiene como propósito organizar las tareas necesarias para el análisis, diseño, implementación, validación y documentación de PERU APP.

Las tareas se derivan de la especificación funcional `spec.md` y del plan técnico `plan.md`. Cada tarea está relacionada con un módulo del sistema y permite evidenciar el avance incremental del proyecto bajo el enfoque Spec-Driven Development.

---

## 3. Estados de tarea

Para el control de avance se utilizarán los siguientes estados:

| Estado | Descripción |
|---|---|
| Pendiente | La tarea aún no ha sido iniciada. |
| En progreso | La tarea se encuentra en desarrollo. |
| Completado | La tarea fue implementada o documentada. |
| Validado | La tarea fue revisada mediante prueba funcional o revisión documental. |

---

## 4. Incrementos del proyecto

PERU APP se organiza en los siguientes incrementos:

| Código | Incremento | Descripción |
|---|---|---|
| INC-001 | Autenticación y usuarios | Registro, login, sesión y roles. |
| INC-002 | Información territorial | Departamentos, provincias, distritos y ciudades. |
| INC-003 | Información turística y gastronómica | Lugares turísticos y comidas típicas. |
| INC-004 | Panel de administración | Gestión CRUD de datos del sistema. |
| INC-005 | Detalle turístico ampliado | Vista completa de lugares turísticos. |
| INC-006 | Mapas y rutas | Mapas, rutas referenciales y rutas personalizadas. |
| INC-007 | Mejora visual | Iconos, consistencia visual y estilos. |
| INC-008 | Documentación SDD | Artefactos de Spec-Driven Development. |
| INC-009 | Documentación TDD | Casos de prueba funcionales. |

---

# 5. Tareas por incremento

---

## INC-001. Autenticación y usuarios

### T-001. Crear estructura de autenticación en frontend

**Descripción:** Implementar la página de autenticación para registro e inicio de sesión.  
**Módulo relacionado:** M-001 Autenticación  
**Requerimientos relacionados:** RF-001, RF-002  
**Estado:** Completado  

**Actividades:**

- Crear vista de bienvenida.
- Crear formulario de registro.
- Crear formulario de inicio de sesión.
- Validar campos obligatorios.
- Mostrar mensajes de error o éxito.
- Redirigir al home después del login.

---

### T-002. Implementar registro de usuarios en backend

**Descripción:** Crear endpoint para registrar usuarios en la base de datos.  
**Módulo relacionado:** M-001 Autenticación  
**Requerimientos relacionados:** RF-001  
**Estado:** Completado  

**Actividades:**

- Recibir nombres, apellidos, fecha de nacimiento, correo y contraseña.
- Validar correo existente.
- Cifrar contraseña con bcrypt.
- Registrar usuario con rol `usuario`.
- Devolver respuesta JSON.

---

### T-003. Implementar inicio de sesión

**Descripción:** Permitir autenticación de usuarios mediante correo y contraseña.  
**Módulo relacionado:** M-001 Autenticación  
**Requerimientos relacionados:** RF-002  
**Estado:** Completado  

**Actividades:**

- Validar credenciales.
- Comparar contraseña cifrada.
- Generar token JWT.
- Devolver datos del usuario autenticado.
- Guardar sesión en frontend.

---

### T-004. Implementar cierre de sesión

**Descripción:** Permitir al usuario cerrar sesión y volver al login.  
**Módulo relacionado:** M-001 Autenticación  
**Requerimientos relacionados:** RF-003  
**Estado:** Completado  

**Actividades:**

- Eliminar token local.
- Limpiar datos de usuario.
- Redirigir a la pantalla de autenticación.
- Bloquear acceso a rutas privadas.

---

### T-005. Implementar control de roles

**Descripción:** Diferenciar permisos entre usuario normal y administrador.  
**Módulo relacionado:** M-001 Autenticación / M-009 Administración  
**Requerimientos relacionados:** RF-004  
**Estado:** Completado  

**Actividades:**

- Definir rol `usuario`.
- Definir rol `admin`.
- Proteger rutas privadas.
- Proteger rutas administrativas.
- Validar rol en backend.

---

## INC-002. Información territorial

### T-006. Implementar módulo de departamentos

**Descripción:** Crear funcionalidad para listar, visualizar y gestionar departamentos.  
**Módulo relacionado:** M-003 Departamentos  
**Requerimientos relacionados:** RF-006, RF-007, RF-015  
**Estado:** Completado  

**Actividades:**

- Crear tabla de departamentos.
- Crear endpoint de listado.
- Crear endpoint de detalle.
- Crear vista de departamentos.
- Crear vista de detalle de departamento.
- Mostrar información básica y turística.
- Permitir gestión desde panel administrador.

---

### T-007. Implementar introducción turística de departamento

**Descripción:** Agregar una sección introductoria administrable para cada departamento.  
**Módulo relacionado:** M-003 Departamentos  
**Requerimientos relacionados:** RF-007, RF-015  
**Estado:** Completado  

**Actividades:**

- Agregar campo de introducción.
- Permitir edición desde gestión de contenido.
- Mostrar introducción en detalle de departamento.
- Mantener diseño visual coherente.

---

### T-008. Implementar mapa de departamento

**Descripción:** Mostrar un mapa interactivo en el detalle de departamento.  
**Módulo relacionado:** M-010 Mapas y rutas  
**Requerimientos relacionados:** RF-021  
**Estado:** Completado  

**Actividades:**

- Integrar Leaflet.
- Configurar OpenStreetMap.
- Definir coordenadas referenciales por departamento.
- Mostrar marcador del departamento.
- Permitir zoom y desplazamiento.

---

### T-009. Implementar módulo de provincias

**Descripción:** Crear funcionalidad para consultar y gestionar provincias.  
**Módulo relacionado:** M-004 Provincias  
**Requerimientos relacionados:** RF-008, RF-016  
**Estado:** Completado  

**Actividades:**

- Crear tabla de provincias.
- Asociar provincias con departamentos.
- Crear rutas backend.
- Crear servicios frontend.
- Crear vista de exploración de provincias.
- Permitir gestión administrativa.

---

### T-010. Implementar módulo de distritos

**Descripción:** Crear funcionalidad para consultar y gestionar distritos.  
**Módulo relacionado:** M-005 Distritos  
**Requerimientos relacionados:** RF-009, RF-017  
**Estado:** Completado  

**Actividades:**

- Crear tabla de distritos.
- Asociar distritos con provincias.
- Crear rutas backend.
- Crear servicios frontend.
- Crear vista de exploración de distritos.
- Permitir gestión administrativa.

---

### T-011. Implementar módulo de ciudades

**Descripción:** Crear funcionalidad para consultar y gestionar ciudades.  
**Módulo relacionado:** M-006 Ciudades  
**Requerimientos relacionados:** RF-010, RF-018  
**Estado:** Completado  

**Actividades:**

- Crear tabla de ciudades.
- Asociar ciudades con departamentos.
- Crear rutas backend.
- Crear servicios frontend.
- Crear vista de exploración de ciudades.
- Permitir gestión administrativa.

---

## INC-003. Información turística y gastronómica

### T-012. Implementar lugares turísticos por departamento

**Descripción:** Permitir registrar y visualizar lugares turísticos asociados a departamentos.  
**Módulo relacionado:** M-007 Lugares turísticos  
**Requerimientos relacionados:** RF-011, RF-019  
**Estado:** Completado  

**Actividades:**

- Crear tabla de lugares turísticos.
- Asociar lugar turístico con departamento.
- Registrar nombre, descripción, ubicación e imagen.
- Mostrar lugares en detalle de departamento.
- Permitir gestión desde panel administrador.

---

### T-013. Implementar comidas típicas por departamento

**Descripción:** Permitir registrar y visualizar comidas típicas asociadas a departamentos.  
**Módulo relacionado:** M-008 Comidas típicas  
**Requerimientos relacionados:** RF-013, RF-020  
**Estado:** Completado  

**Actividades:**

- Crear tabla de comidas típicas.
- Asociar comida típica con departamento.
- Registrar nombre, descripción, imagen y origen.
- Mostrar comidas en detalle de departamento.
- Permitir gestión desde panel administrador.

---

### T-014. Implementar contenido turístico por provincia

**Descripción:** Permitir registrar lugares turísticos y comidas típicas asociadas a provincias.  
**Módulo relacionado:** M-004 Provincias / M-007 / M-008  
**Requerimientos relacionados:** RF-011, RF-013, RF-016  
**Estado:** Completado  

**Actividades:**

- Crear tablas o endpoints por provincia.
- Asociar contenido turístico con provincia.
- Permitir consulta desde frontend.
- Permitir gestión administrativa.

---

### T-015. Implementar contenido turístico por distrito

**Descripción:** Permitir registrar lugares turísticos y comidas típicas asociadas a distritos.  
**Módulo relacionado:** M-005 Distritos / M-007 / M-008  
**Requerimientos relacionados:** RF-011, RF-013, RF-017  
**Estado:** Completado  

**Actividades:**

- Crear tablas o endpoints por distrito.
- Asociar contenido turístico con distrito.
- Permitir consulta desde frontend.
- Permitir gestión administrativa.

---

### T-016. Implementar contenido turístico por ciudad

**Descripción:** Permitir registrar lugares turísticos y comidas típicas asociadas a ciudades.  
**Módulo relacionado:** M-006 Ciudades / M-007 / M-008  
**Requerimientos relacionados:** RF-011, RF-013, RF-018  
**Estado:** Completado  

**Actividades:**

- Crear tablas o endpoints por ciudad.
- Asociar contenido turístico con ciudad.
- Permitir consulta desde frontend.
- Permitir gestión administrativa.

---

## INC-004. Panel de administración

### T-017. Implementar panel de gestión de departamentos

**Descripción:** Crear interfaz administrativa para gestionar departamentos y su contenido.  
**Módulo relacionado:** M-009 Administración  
**Requerimientos relacionados:** RF-015  
**Estado:** Completado  

**Actividades:**

- Crear vista de gestión de departamentos.
- Crear formularios de registro y edición.
- Consumir endpoints del backend.
- Mostrar mensajes de confirmación.
- Actualizar listado después de cambios.

---

### T-018. Implementar gestión de contenido por departamento

**Descripción:** Permitir al administrador gestionar lugares turísticos, comidas típicas e introducción de departamento.  
**Módulo relacionado:** M-009 Administración  
**Requerimientos relacionados:** RF-015, RF-019, RF-020  
**Estado:** Completado  

**Actividades:**

- Crear vista de contenido por departamento.
- Gestionar lugares turísticos.
- Gestionar comidas típicas.
- Editar introducción del departamento.
- Cargar imágenes.

---

### T-019. Implementar gestión de usuarios

**Descripción:** Permitir al administrador visualizar y gestionar usuarios registrados.  
**Módulo relacionado:** M-002 Usuarios / M-009 Administración  
**Requerimientos relacionados:** RF-014  
**Estado:** Completado  

**Actividades:**

- Crear endpoint de listado de usuarios.
- Crear vista de lista de usuarios.
- Proteger acceso solo para administrador.
- Mostrar información básica de usuarios.

---

### T-020. Proteger rutas administrativas

**Descripción:** Restringir el acceso a módulos administrativos según rol.  
**Módulo relacionado:** M-009 Administración  
**Requerimientos relacionados:** RF-004  
**Estado:** Completado  

**Actividades:**

- Crear componente de ruta protegida.
- Validar rol en frontend.
- Validar token y rol en backend.
- Redirigir usuarios no autorizados.

---

## INC-005. Detalle turístico ampliado

### T-021. Crear página de detalle de lugar turístico

**Descripción:** Permitir que el usuario acceda a una vista completa del lugar turístico.  
**Módulo relacionado:** M-007 Lugares turísticos  
**Requerimientos relacionados:** RF-012  
**Estado:** Completado  

**Actividades:**

- Crear ruta `/lugares-turisticos/:id`.
- Crear página `DetalleLugarTuristico`.
- Obtener datos del lugar por ID.
- Mostrar hero con imagen principal.
- Mostrar ubicación referencial.

---

### T-022. Agregar información ampliada del lugar turístico

**Descripción:** Registrar y mostrar datos detallados del lugar turístico.  
**Módulo relacionado:** M-007 Lugares turísticos  
**Requerimientos relacionados:** RF-012, RF-019  
**Estado:** Completado  

**Actividades:**

- Agregar sección “Acerca de”.
- Mostrar provincia y distrito.
- Mostrar clima y altura.
- Mostrar recomendaciones antes del viaje.
- Mostrar recomendaciones durante el viaje.

---

### T-023. Implementar galería de imágenes

**Descripción:** Permitir mostrar una galería de imágenes del lugar turístico.  
**Módulo relacionado:** M-007 Lugares turísticos  
**Requerimientos relacionados:** RF-012, RF-019  
**Estado:** Completado  

**Actividades:**

- Permitir imagen principal.
- Permitir hasta tres imágenes adicionales.
- Mostrar galería en detalle de lugar turístico.
- Mantener diseño responsive.

---

## INC-006. Mapas y rutas

### T-024. Implementar ruta referencial por carretera

**Descripción:** Mostrar una ruta desde un origen registrado por el administrador hacia el lugar turístico.  
**Módulo relacionado:** M-010 Mapas y rutas  
**Requerimientos relacionados:** RF-022  
**Estado:** Completado  

**Actividades:**

- Agregar campos de origen y destino textual.
- Convertir texto a coordenadas con Nominatim.
- Calcular ruta con OSRM.
- Dibujar ruta con Leaflet.
- Mostrar marcadores de inicio y destino.

---

### T-025. Implementar ruta personalizada para usuario

**Descripción:** Permitir que el usuario ingrese su propio origen para calcular la ruta hacia el destino turístico.  
**Módulo relacionado:** M-010 Mapas y rutas  
**Requerimientos relacionados:** RF-023  
**Estado:** Completado  

**Actividades:**

- Agregar formulario de origen personalizado.
- Mantener destino fijo.
- Recalcular ruta por carretera.
- Mostrar mensajes de estado.
- Permitir volver a ruta referencial.

---

### T-026. Manejar errores de rutas

**Descripción:** Mostrar mensajes si no se puede calcular la ruta o encontrar el origen.  
**Módulo relacionado:** M-010 Mapas y rutas  
**Requerimientos relacionados:** RF-022, RF-023  
**Estado:** Completado  

**Actividades:**

- Validar origen vacío.
- Validar origen no encontrado.
- Validar destino no encontrado.
- Mostrar mensaje de error.
- Mantener mapa funcional.

---

## INC-007. Mejora visual

### T-027. Reemplazar emojis por iconos profesionales

**Descripción:** Mejorar la consistencia visual del sistema usando Lucide React.  
**Módulo relacionado:** Interfaz general  
**Requerimientos relacionados:** RF-024  
**Estado:** Completado  

**Actividades:**

- Instalar `lucide-react`.
- Reemplazar emojis principales en login.
- Reemplazar emojis en sidebar.
- Reemplazar emojis en header.
- Reemplazar emojis en home.
- Agregar estilos de alineación.

---

### T-028. Ajustar estilos visuales de mapas y rutas

**Descripción:** Mejorar la presentación de la sección de mapas y rutas.  
**Módulo relacionado:** M-010 Mapas y rutas  
**Requerimientos relacionados:** RF-021, RF-022, RF-023  
**Estado:** Completado  

**Actividades:**

- Ajustar panel informativo.
- Agregar formulario de origen.
- Estilizar botones.
- Estilizar mensajes de estado.
- Mantener diseño responsive.

---

### T-029. Validar consistencia responsive

**Descripción:** Revisar que las vistas principales sean visualmente adaptables.  
**Módulo relacionado:** Interfaz general  
**Requerimientos relacionados:** RNF-001, RNF-004  
**Estado:** En progreso  

**Actividades:**

- Revisar login.
- Revisar home.
- Revisar detalle de departamento.
- Revisar detalle de lugar turístico.
- Revisar panel administrador.
- Ajustar estilos si corresponde.

---

## INC-008. Documentación SDD

### T-030. Inicializar GitHub Spec Kit

**Descripción:** Preparar la estructura base de Spec Kit dentro del proyecto.  
**Módulo relacionado:** Documentación SDD  
**Requerimientos relacionados:** RF-025  
**Estado:** Completado  

**Actividades:**

- Crear rama de documentación.
- Inicializar Spec Kit.
- Crear estructura `.specify`.
- Crear estructura `.speckit`.
- Registrar cambios con Git.

---

### T-031. Crear constitución del proyecto

**Descripción:** Definir principios, reglas, tecnologías y restricciones de PERU APP.  
**Módulo relacionado:** Documentación SDD  
**Requerimientos relacionados:** RF-025  
**Estado:** Completado  

**Actividades:**

- Documentar propósito del proyecto.
- Documentar principios del desarrollo.
- Documentar arquitectura.
- Documentar roles.
- Documentar tecnologías oficiales.
- Documentar restricciones.

---

### T-032. Crear especificación funcional

**Descripción:** Documentar requerimientos funcionales, no funcionales, reglas de negocio, usuarios y alcance.  
**Módulo relacionado:** Documentación SDD  
**Requerimientos relacionados:** RF-025  
**Estado:** Completado  

**Actividades:**

- Documentar alcance.
- Documentar usuarios.
- Documentar reglas de negocio.
- Documentar requerimientos funcionales.
- Documentar requerimientos no funcionales.
- Documentar escenarios de uso.

---

### T-033. Crear plan técnico

**Descripción:** Documentar arquitectura, tecnologías, frontend, backend, base de datos, API, seguridad y rutas.  
**Módulo relacionado:** Documentación SDD  
**Requerimientos relacionados:** RF-025  
**Estado:** Completado  

**Actividades:**

- Documentar arquitectura cliente-servidor.
- Documentar arquitectura por capas.
- Documentar frontend.
- Documentar backend.
- Documentar SQL Server.
- Documentar API REST.
- Documentar seguridad.
- Documentar mapas y rutas.

---

### T-034. Crear documento de tareas

**Descripción:** Documentar las tareas del proyecto organizadas por incrementos.  
**Módulo relacionado:** Documentación SDD  
**Requerimientos relacionados:** RF-025  
**Estado:** Completado  

**Actividades:**

- Definir incrementos.
- Relacionar tareas con módulos.
- Relacionar tareas con requerimientos.
- Registrar estado de avance.
- Preparar base para trazabilidad.

---

### T-035. Crear modelo de datos

**Descripción:** Documentar entidades, campos principales y relaciones de base de datos.  
**Módulo relacionado:** Documentación SDD  
**Requerimientos relacionados:** RF-025  
**Estado:** Pendiente  

**Actividades:**

- Documentar Usuarios.
- Documentar Departamentos.
- Documentar Provincias.
- Documentar Distritos.
- Documentar Ciudades.
- Documentar LugaresTuristicos.
- Documentar ComidasTipicas.
- Documentar relaciones.

---

### T-036. Crear contrato API REST

**Descripción:** Documentar endpoints principales del backend mediante OpenAPI.  
**Módulo relacionado:** Documentación SDD  
**Requerimientos relacionados:** RF-025  
**Estado:** Pendiente  

**Actividades:**

- Documentar endpoints de auth.
- Documentar endpoints de usuarios.
- Documentar endpoints de departamentos.
- Documentar endpoints de provincias.
- Documentar endpoints de distritos.
- Documentar endpoints de ciudades.
- Documentar endpoints de lugares turísticos.
- Documentar endpoints de comidas típicas.

---

### T-037. Crear matriz de trazabilidad

**Descripción:** Relacionar requerimientos, módulos, tareas y pruebas futuras.  
**Módulo relacionado:** Documentación SDD  
**Requerimientos relacionados:** RF-025  
**Estado:** Pendiente  

**Actividades:**

- Relacionar RF con módulos.
- Relacionar RF con tareas.
- Relacionar RF con casos de prueba futuros.
- Preparar insumo para TDD.

---

### T-038. Crear README del SDD

**Descripción:** Crear resumen general del SDD y explicación de artefactos.  
**Módulo relacionado:** Documentación SDD  
**Requerimientos relacionados:** RF-025  
**Estado:** Pendiente  

**Actividades:**

- Explicar propósito del SDD.
- Listar artefactos creados.
- Explicar relación con PERU APP.
- Explicar relación con TDD.
- Indicar cómo revisar la documentación.

---

## INC-009. Documentación TDD

### T-039. Crear documento TDD

**Descripción:** Elaborar documento de diseño de pruebas basado en el SDD.  
**Módulo relacionado:** Pruebas  
**Requerimientos relacionados:** Todos los RF principales  
**Estado:** Pendiente  

**Actividades:**

- Definir alcance de pruebas.
- Definir estrategia de pruebas.
- Definir casos de prueba.
- Relacionar casos con requerimientos.
- Registrar resultados esperados.

---

### T-040. Crear casos de prueba funcionales

**Descripción:** Documentar pruebas funcionales por módulo.  
**Módulo relacionado:** Pruebas  
**Requerimientos relacionados:** RF-001 a RF-025  
**Estado:** Pendiente  

**Actividades:**

- Crear casos de prueba para autenticación.
- Crear casos de prueba para usuarios.
- Crear casos de prueba para departamentos.
- Crear casos de prueba para provincias.
- Crear casos de prueba para distritos.
- Crear casos de prueba para ciudades.
- Crear casos de prueba para lugares turísticos.
- Crear casos de prueba para comidas típicas.
- Crear casos de prueba para mapas y rutas.
- Crear casos de prueba para panel administrador.

---

## 6. Relación general entre tareas y artefactos

| Artefacto | Tareas relacionadas |
|---|---|
| `constitution.md` | T-030, T-031 |
| `spec.md` | T-032 |
| `plan.md` | T-033 |
| `tasks.md` | T-034 |
| `data-model.md` | T-035 |
| `openapi.yaml` | T-036 |
| `traceability-matrix.md` | T-037 |
| `README-SDD.md` | T-038 |
| TDD | T-039, T-040 |

---

## 7. Criterios de aceptación del documento de tareas

El documento será considerado válido si cumple con los siguientes criterios:

1. Las tareas están organizadas por incrementos.
2. Cada tarea tiene código identificador.
3. Cada tarea se relaciona con un módulo del sistema.
4. Cada tarea se relaciona con requerimientos funcionales.
5. Se indica el estado de cada tarea.
6. Las tareas permiten evidenciar el desarrollo incremental.
7. El documento sirve como base para la matriz de trazabilidad.
8. El documento permite construir posteriormente el TDD.

---

## 8. Consideraciones finales

Este documento organiza el trabajo realizado y pendiente del proyecto PERU APP bajo el enfoque Spec-Driven Development. Las tareas permiten demostrar que el sistema fue desarrollado de manera incremental, manteniendo relación entre especificación, diseño, implementación y validación.

Las tareas pendientes relacionadas con modelo de datos, contrato API, trazabilidad y TDD serán completadas en los siguientes artefactos del SDD y en la documentación de pruebas.