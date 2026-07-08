# Especificación Funcional - PERU APP

## 1. Identificación de la especificación

**Código de especificación:** SPEC-001  
**Nombre:** PERU APP - Plataforma web turístico-educativa  
**Proyecto:** PERU APP  
**Año:** 2026  
**Metodología:** Spec-Driven Development  
**Herramienta de documentación:** GitHub Spec Kit  
**Estado:** En desarrollo  
**Responsable:** Erwin Brayam Inca Pauccara  

---

## 2. Descripción general

PERU APP es una plataforma web turístico-educativa orientada a organizar y difundir información turística, territorial y gastronómica del Perú. El sistema permite que los usuarios consulten información sobre departamentos, provincias, distritos y ciudades, además de visualizar lugares turísticos y comidas típicas asociadas a cada nivel territorial.

El sistema también incorpora un panel de administración que permite gestionar usuarios y contenidos turísticos. La plataforma está diseñada bajo una arquitectura cliente-servidor, con frontend en React y Vite, backend en Node.js y Express, y base de datos SQL Server.

El desarrollo se organiza bajo Spec-Driven Development, utilizando GitHub Spec Kit para documentar especificaciones, planificación técnica, tareas, modelo de datos, contratos API y trazabilidad.

---

## 3. Propósito de la especificación

El propósito de esta especificación es definir los requerimientos funcionales y no funcionales de PERU APP, así como los usuarios, módulos, reglas de negocio, criterios de aceptación y restricciones del sistema.

Este documento servirá como base para los demás artefactos del SDD:

- `plan.md`
- `tasks.md`
- `data-model.md`
- `openapi.yaml`
- `traceability-matrix.md`
- `README-SDD.md`

También servirá como base para la elaboración posterior del TDD, donde se definirán los casos de prueba funcionales del sistema.

---

## 4. Alcance del sistema

PERU APP permite:

1. Registrar usuarios.
2. Iniciar sesión.
3. Controlar acceso mediante roles.
4. Explorar departamentos del Perú.
5. Explorar provincias asociadas a departamentos.
6. Explorar distritos asociados a provincias.
7. Explorar ciudades asociadas a departamentos.
8. Visualizar lugares turísticos.
9. Visualizar comidas típicas.
10. Consultar detalle completo de lugares turísticos.
11. Visualizar mapas de departamentos.
12. Visualizar rutas por carretera hacia lugares turísticos.
13. Calcular rutas personalizadas desde un origen ingresado por el usuario.
14. Gestionar información mediante un panel administrador.
15. Gestionar usuarios desde el panel administrador.
16. Mantener documentación SDD del sistema.

---

## 5. Fuera del alcance

PERU APP no contempla:

1. Reservas turísticas.
2. Pagos en línea.
3. Compra de paquetes turísticos.
4. Comercio electrónico.
5. Integración con agencias de viaje.
6. Geolocalización en tiempo real del usuario.
7. Chat en línea.
8. Calificación de destinos.
9. Comentarios públicos.
10. Recomendaciones automáticas mediante inteligencia artificial.
11. Gestión comercial de hoteles, restaurantes o transportes.

El sistema se limita a la organización, gestión y difusión de información turística, territorial y gastronómica.

---

## 6. Usuarios del sistema

### 6.1. Usuario visitante registrado

Es el usuario que se registra e inicia sesión en la plataforma para consultar información turística.

Puede realizar las siguientes acciones:

- Iniciar sesión.
- Explorar departamentos.
- Consultar provincias, distritos y ciudades.
- Visualizar lugares turísticos.
- Visualizar comidas típicas.
- Consultar detalle de lugares turísticos.
- Ver mapas y rutas.
- Calcular una ruta personalizada desde un origen ingresado manualmente.

### 6.2. Administrador

Es el usuario con permisos para gestionar información dentro del sistema.

Puede realizar las siguientes acciones:

- Iniciar sesión.
- Acceder al panel de administración.
- Gestionar usuarios.
- Gestionar departamentos.
- Gestionar provincias.
- Gestionar distritos.
- Gestionar ciudades.
- Gestionar lugares turísticos.
- Gestionar comidas típicas.
- Registrar información ampliada de lugares turísticos.
- Registrar datos referenciales para mapas y rutas.

---

## 7. Reglas de negocio

### RN-001. Acceso autenticado

Todo usuario debe iniciar sesión para acceder a los módulos principales de la plataforma.

### RN-002. Roles de usuario

El sistema debe manejar dos roles principales:

- `usuario`
- `admin`

### RN-003. Restricción administrativa

Solo los usuarios con rol `admin` pueden acceder a las funcionalidades de gestión.

### RN-004. Organización territorial

La información del sistema debe organizarse por niveles territoriales:

1. Departamento.
2. Provincia.
3. Distrito.
4. Ciudad.

### RN-005. Asociación de contenido turístico

Los lugares turísticos y comidas típicas deben estar asociados a un nivel territorial correspondiente.

### RN-006. Gestión de contenido

El administrador puede crear, editar, consultar y eliminar información turística, territorial y gastronómica.

### RN-007. Visualización de rutas

El sistema puede mostrar rutas por carretera hacia lugares turísticos usando un origen y destino registrados.

### RN-008. Ruta personalizada del usuario

El usuario puede ingresar un origen personalizado para calcular una ruta hacia el lugar turístico seleccionado. El destino no se modifica porque corresponde al lugar turístico visualizado.

### RN-009. Datos obligatorios

Para registrar entidades principales, el sistema debe solicitar datos mínimos como nombre, descripción y relación territorial correspondiente.

### RN-010. Protección de información

Las rutas protegidas deben validar token de autenticación y rol cuando corresponda.

---

## 8. Requerimientos funcionales

### RF-001. Registro de usuario

El sistema debe permitir que una persona cree una cuenta ingresando nombres, apellidos, fecha de nacimiento, correo electrónico y contraseña.

**Criterios de aceptación:**

- El sistema debe validar que los campos obligatorios estén completos.
- El sistema debe validar que la contraseña tenga una longitud mínima.
- El sistema debe registrar al usuario con rol `usuario`.
- El sistema debe mostrar un mensaje de confirmación si el registro fue exitoso.
- El sistema debe mostrar un mensaje de error si el correo ya existe o los datos son inválidos.

---

### RF-002. Inicio de sesión

El sistema debe permitir que un usuario registrado inicie sesión mediante correo electrónico y contraseña.

**Criterios de aceptación:**

- El sistema debe validar las credenciales.
- El sistema debe generar un token de autenticación.
- El sistema debe redirigir al usuario al home si el inicio de sesión es correcto.
- El sistema debe mostrar un mensaje de error si las credenciales son incorrectas.

---

### RF-003. Cierre de sesión

El sistema debe permitir cerrar la sesión activa del usuario.

**Criterios de aceptación:**

- El sistema debe eliminar la sesión local.
- El sistema debe redirigir al login.
- El usuario no debe poder acceder a rutas protegidas después de cerrar sesión.

---

### RF-004. Control de acceso por rol

El sistema debe permitir diferenciar las funcionalidades disponibles según el rol del usuario.

**Criterios de aceptación:**

- Un usuario normal no debe acceder al panel administrador.
- Un administrador sí debe acceder a las funciones de gestión.
- Las rutas administrativas deben validar token y rol.

---

### RF-005. Visualización del home

El sistema debe mostrar una página principal con información visual y accesos a los módulos principales.

**Criterios de aceptación:**

- El home debe mostrar destinos destacados.
- El home debe permitir navegar a departamentos, provincias, distritos y ciudades.
- El home debe mantener una interfaz visual coherente con el objetivo turístico-educativo.

---

### RF-006. Exploración de departamentos

El sistema debe permitir visualizar los departamentos registrados.

**Criterios de aceptación:**

- El sistema debe listar los departamentos disponibles.
- Cada departamento debe mostrar información básica.
- El usuario debe poder seleccionar un departamento para ver su detalle.

---

### RF-007. Detalle de departamento

El sistema debe mostrar información detallada de un departamento.

**Criterios de aceptación:**

- Debe mostrar nombre, capital, región, descripción y datos relevantes.
- Debe mostrar introducción turística si está registrada.
- Debe mostrar mapa del departamento.
- Debe mostrar lugares turísticos asociados.
- Debe mostrar comidas típicas asociadas.

---

### RF-008. Exploración de provincias

El sistema debe permitir consultar provincias asociadas a departamentos.

**Criterios de aceptación:**

- El usuario debe poder acceder al módulo de provincias.
- El sistema debe mostrar provincias registradas.
- Las provincias deben estar asociadas a un departamento.

---

### RF-009. Exploración de distritos

El sistema debe permitir consultar distritos asociados a provincias.

**Criterios de aceptación:**

- El usuario debe poder acceder al módulo de distritos.
- El sistema debe mostrar distritos registrados.
- Los distritos deben estar asociados a una provincia.

---

### RF-010. Exploración de ciudades

El sistema debe permitir consultar ciudades asociadas a departamentos.

**Criterios de aceptación:**

- El usuario debe poder acceder al módulo de ciudades.
- El sistema debe mostrar ciudades registradas.
- Las ciudades deben estar asociadas a un departamento.

---

### RF-011. Visualización de lugares turísticos

El sistema debe mostrar lugares turísticos registrados.

**Criterios de aceptación:**

- Los lugares turísticos deben mostrar nombre, descripción, ubicación e imagen.
- Los lugares deben estar asociados al nivel territorial correspondiente.
- El usuario debe poder acceder al detalle del lugar turístico.

---

### RF-012. Detalle de lugar turístico

El sistema debe mostrar una página de detalle para cada lugar turístico.

**Criterios de aceptación:**

- Debe mostrar imagen principal.
- Debe mostrar nombre y ubicación referencial.
- Debe mostrar descripción ampliada o sección “Acerca de”.
- Debe mostrar información general como departamento, provincia, distrito, clima y altura.
- Debe mostrar galería de imágenes.
- Debe mostrar recomendaciones antes y durante el viaje.
- Debe mostrar mapa de ruta hacia el destino.

---

### RF-013. Visualización de comidas típicas

El sistema debe mostrar comidas típicas registradas.

**Criterios de aceptación:**

- Las comidas típicas deben mostrar nombre, descripción, imagen y origen.
- Deben estar asociadas a un nivel territorial correspondiente.
- Deben visualizarse en los detalles donde corresponda.

---

### RF-014. Gestión de usuarios

El sistema debe permitir al administrador gestionar usuarios.

**Criterios de aceptación:**

- El administrador debe poder listar usuarios.
- El administrador debe poder visualizar datos básicos de usuarios.
- El sistema debe restringir esta función a usuarios con rol `admin`.

---

### RF-015. Gestión de departamentos

El sistema debe permitir al administrador gestionar departamentos.

**Criterios de aceptación:**

- El administrador debe poder crear departamentos.
- El administrador debe poder editar departamentos.
- El administrador debe poder eliminar departamentos si corresponde.
- El administrador debe poder registrar información introductoria.

---

### RF-016. Gestión de provincias

El sistema debe permitir al administrador gestionar provincias.

**Criterios de aceptación:**

- El administrador debe poder crear, editar y eliminar provincias.
- Cada provincia debe asociarse a un departamento.
- Los datos deben reflejarse en la vista del usuario.

---

### RF-017. Gestión de distritos

El sistema debe permitir al administrador gestionar distritos.

**Criterios de aceptación:**

- El administrador debe poder crear, editar y eliminar distritos.
- Cada distrito debe asociarse a una provincia.
- Los datos deben visualizarse correctamente en el módulo correspondiente.

---

### RF-018. Gestión de ciudades

El sistema debe permitir al administrador gestionar ciudades.

**Criterios de aceptación:**

- El administrador debe poder crear, editar y eliminar ciudades.
- Cada ciudad debe asociarse a un departamento.
- Los datos deben visualizarse correctamente en el módulo correspondiente.

---

### RF-019. Gestión de lugares turísticos

El sistema debe permitir al administrador gestionar lugares turísticos.

**Criterios de aceptación:**

- El administrador debe poder crear, editar y eliminar lugares turísticos.
- Debe poder registrar nombre, descripción, ubicación, imagen principal e imágenes adicionales.
- Debe poder registrar información general como clima, altura, provincia y distrito.
- Debe poder registrar recomendaciones antes y durante el viaje.
- Debe poder registrar origen y destino textual para la ruta referencial.

---

### RF-020. Gestión de comidas típicas

El sistema debe permitir al administrador gestionar comidas típicas.

**Criterios de aceptación:**

- El administrador debe poder crear, editar y eliminar comidas típicas.
- Debe poder registrar nombre, descripción, imagen y origen.
- Las comidas registradas deben visualizarse en el módulo correspondiente.

---

### RF-021. Mapa de departamento

El sistema debe mostrar un mapa interactivo en el detalle del departamento.

**Criterios de aceptación:**

- El mapa debe permitir desplazamiento y zoom.
- El mapa debe mostrar una ubicación referencial del departamento.
- El mapa debe integrarse visualmente con la interfaz del detalle.

---

### RF-022. Ruta referencial hacia lugar turístico

El sistema debe mostrar una ruta por carretera desde un origen registrado por el administrador hacia el lugar turístico.

**Criterios de aceptación:**

- El sistema debe usar el origen y destino registrados.
- El mapa debe mostrar marcador de inicio y destino.
- La ruta debe dibujarse siguiendo carretera cuando el servicio externo responda correctamente.
- Si no se obtiene ruta por carretera, el sistema puede mostrar una ruta referencial.

---

### RF-023. Ruta personalizada del usuario

El sistema debe permitir que el usuario ingrese un origen personalizado para calcular una ruta hacia el lugar turístico.

**Criterios de aceptación:**

- El usuario debe poder escribir su origen.
- El destino debe permanecer fijo.
- El sistema debe recalcular la ruta en el mapa.
- El sistema debe permitir volver a la ruta referencial.
- El sistema debe mostrar mensajes de estado o error si no se puede calcular la ruta.

---

### RF-024. Consistencia visual mediante iconos

El sistema debe utilizar iconos SVG profesionales para mejorar la presentación visual.

**Criterios de aceptación:**

- Los iconos deben reemplazar emojis principales.
- Los iconos deben mantener coherencia visual.
- Los iconos deben alinearse correctamente en botones, menús y tarjetas.

---

### RF-025. Documentación SDD

El sistema debe contar con documentación basada en Spec-Driven Development.

**Criterios de aceptación:**

- Debe existir constitución del proyecto.
- Debe existir especificación funcional.
- Debe existir plan técnico.
- Debe existir lista de tareas.
- Debe existir modelo de datos.
- Debe existir contrato API.
- Debe existir matriz de trazabilidad.
- La documentación debe relacionarse con lo implementado.

---

## 9. Requerimientos no funcionales

### RNF-001. Usabilidad

La interfaz debe ser clara, ordenada, comprensible y fácil de utilizar por usuarios con conocimientos básicos de navegación web.

### RNF-002. Seguridad

El sistema debe proteger rutas privadas mediante autenticación y control de roles.

### RNF-003. Mantenibilidad

El código debe organizarse por módulos, componentes, servicios, rutas, controladores y modelos.

### RNF-004. Consistencia visual

La interfaz debe mantener colores, tipografía, tarjetas, botones e iconos de manera uniforme.

### RNF-005. Disponibilidad de información

La información debe mostrarse de forma ordenada y accesible desde los módulos correspondientes.

### RNF-006. Compatibilidad

El sistema debe ejecutarse en navegadores web modernos.

### RNF-007. Rendimiento básico

El sistema debe cargar las vistas principales sin tiempos de espera excesivos en un entorno local o académico.

### RNF-008. Escalabilidad académica

La estructura del sistema debe permitir agregar nuevos departamentos, provincias, distritos, ciudades, lugares turísticos y comidas típicas.

### RNF-009. Trazabilidad

Cada requerimiento debe poder relacionarse con tareas, diseño, implementación y pruebas.

### RNF-010. Documentación

El sistema debe contar con documentación técnica suficiente para comprender su diseño, implementación y validación.

---

## 10. Entidades principales

El sistema considera las siguientes entidades principales:

1. Usuario.
2. Departamento.
3. Provincia.
4. Distrito.
5. Ciudad.
6. Lugar turístico.
7. Comida típica.
8. Rol.
9. Imagen.
10. Ruta referencial.

---

## 11. Módulos del sistema

### M-001. Módulo de autenticación

Incluye registro, inicio de sesión, cierre de sesión y manejo de token.

### M-002. Módulo de usuarios

Incluye gestión y visualización de usuarios para administradores.

### M-003. Módulo de departamentos

Incluye listado, detalle y gestión de departamentos.

### M-004. Módulo de provincias

Incluye listado, detalle y gestión de provincias.

### M-005. Módulo de distritos

Incluye listado, detalle y gestión de distritos.

### M-006. Módulo de ciudades

Incluye listado, detalle y gestión de ciudades.

### M-007. Módulo de lugares turísticos

Incluye visualización, detalle, galería, recomendaciones, mapa y rutas.

### M-008. Módulo de comidas típicas

Incluye visualización y gestión de comidas típicas.

### M-009. Módulo de administración

Incluye las operaciones CRUD disponibles para el usuario administrador.

### M-010. Módulo de mapas y rutas

Incluye visualización de mapas, rutas referenciales y rutas personalizadas.

### M-011. Módulo de documentación SDD

Incluye los artefactos generados con GitHub Spec Kit.

---

## 12. Escenarios principales de uso

### EU-001. Registro de usuario

Un visitante ingresa a la plataforma, selecciona registrarse, completa sus datos y crea una cuenta para acceder al sistema.

### EU-002. Inicio de sesión

Un usuario registrado ingresa su correo y contraseña para acceder a los módulos de PERU APP.

### EU-003. Exploración territorial

Un usuario accede al home y navega por departamentos, provincias, distritos y ciudades para consultar información turística.

### EU-004. Consulta de lugar turístico

Un usuario selecciona un lugar turístico desde el detalle de un departamento y accede a su página de detalle.

### EU-005. Cálculo de ruta personalizada

Un usuario escribe su origen actual o ciudad de partida y el sistema calcula una ruta hacia el lugar turístico seleccionado.

### EU-006. Gestión administrativa

Un administrador inicia sesión, accede al panel de administración y gestiona información territorial, turística y gastronómica.

### EU-007. Validación documental

El desarrollador revisa que las funcionalidades implementadas estén relacionadas con las especificaciones, tareas, modelo de datos, API y pruebas.

---

## 13. Dependencias externas

PERU APP puede depender de los siguientes servicios o librerías:

- React.
- Vite.
- Node.js.
- Express.js.
- SQL Server.
- JWT.
- bcrypt.
- Leaflet.
- OpenStreetMap.
- Nominatim.
- OSRM.
- Lucide React.
- npm.
- Git y GitHub.
- GitHub Spec Kit.

---

## 14. Riesgos y consideraciones

### R-001. Dependencia de servicios de mapas

Los mapas y rutas pueden depender de servicios externos. Si estos servicios no responden, la ruta puede no calcularse correctamente.

### R-002. Información manual

La información turística depende de los datos ingresados por el administrador.

### R-003. Proyecto académico

El sistema se desarrolla como proyecto académico, por lo que no contempla despliegue comercial completo.

### R-004. Control de acceso

Si no se valida correctamente el rol, un usuario podría intentar acceder a rutas administrativas. Por ello, el backend debe validar token y rol.

### R-005. Crecimiento de información

A medida que aumente la cantidad de datos turísticos, será necesario optimizar consultas, imágenes y carga de vistas.

---

## 15. Criterios generales de aceptación

La especificación será considerada cumplida cuando:

1. El sistema permita registrar e iniciar sesión a usuarios.
2. El sistema diferencie usuario normal y administrador.
3. El usuario pueda explorar departamentos, provincias, distritos y ciudades.
4. El usuario pueda visualizar lugares turísticos y comidas típicas.
5. El usuario pueda consultar detalle completo de lugares turísticos.
6. El usuario pueda visualizar mapas y rutas.
7. El usuario pueda calcular una ruta personalizada.
8. El administrador pueda gestionar información del sistema.
9. Las rutas administrativas estén protegidas.
10. La documentación SDD exista y esté relacionada con el sistema implementado.
11. El sistema pueda ser validado posteriormente mediante casos de prueba en el TDD.

---

## 16. Relación con el informe académico

Esta especificación se relaciona directamente con el informe del proyecto PERU APP, especialmente con:

- El planteamiento del problema.
- Los objetivos del proyecto.
- La justificación técnica.
- La metodología basada en Spec-Driven Development.
- Las variables de análisis, diseño, implementación, funcionamiento y usabilidad.
- La validación funcional del sistema.

---

## 17. Estado final esperado

Al finalizar la implementación y documentación, PERU APP debe contar con una plataforma web funcional, organizada, documentada y validable mediante pruebas. El sistema debe servir como herramienta turístico-educativa para difundir información del Perú y como evidencia de aplicación de Spec-Driven Development mediante GitHub Spec Kit.