# Diseño Técnico Final — SPEC-002

## 1. Decisiones de diseño

| Decisión | Implementación | Justificación |
|---|---|---|
| Frontend desacoplado | React + Vite + CSS propio en Vercel | Permite despliegue estático y actualización automática. |
| Backend API | Node.js + Express en Render | Centraliza reglas, seguridad y acceso a datos. |
| Persistencia administrada | AWS RDS for SQL Server Express | Conserva compatibilidad con el modelo SQL Server y elimina dependencia del equipo local. |
| Imágenes remotas | Cloudinary | Evita depender del disco efímero de Render. |
| Autenticación obligatoria | `verifyToken` en rutas funcionales | Aplica denegación por defecto. |
| Rol vigente | Consulta a `Usuarios` en cada petición protegida | Evita conservar privilegios obsoletos en el JWT. |
| Sesión frontend | `AuthContext`, perfil e interceptor 401 | Evita confiar únicamente en la presencia del token. |
| Validación | `validationMiddleware.js` | Reglas reutilizables y respuestas uniformes. |
| Integridad | Middlewares y PK/FK/CHECK/UNIQUE | Defensa en profundidad. |
| Imágenes | firma binaria, tamaño, MIME y limpieza posterior a SQL | Reduce archivos inválidos y huérfanos. |
| Errores | `AppError`, payload uniforme y middleware global | Contrato HTTP predecible. |
| Pruebas | Jest, Supertest, Postman/Newman y Playwright | Cobertura por niveles, sin exigir cuentas QA en producción. |
| Contrato | OpenAPI 3.0.3 | Sincronización explícita con Express. |
| Rutas SPA | `frontend/vercel.json` | Permite abrir o recargar rutas React sin 404. |

## 2. Arquitectura de producción

```text
Navegador
   |
   | HTTPS
   v
Vercel
React + Vite + CSS propio
   |
   | Axios / JSON / JWT
   v
Render
Node.js + Express
   |
   +--> AWS RDS / SQL Server
   |
   +--> Cloudinary
```

## 3. Flujo de autenticación

```text
Authorization: Bearer JWT
        |
        v
Verificar firma y expiración
        |
        v
Buscar usuario actual en SQL Server
        |
        v
Construir req.user con rol vigente
        |
        v
Aplicar isAdmin cuando corresponde
```

El frontend valida la sesión mediante el endpoint de perfil y elimina la sesión local al recibir 401.

## 4. Flujo de escritura con imagen

```text
Recibir multipart
  -> validar límite, MIME, extensión y firma
  -> validar campos
  -> validar relación y duplicado
  -> subir o preparar recurso
  -> ejecutar SQL
  -> confirmar respuesta
  -> retirar imagen anterior si correspondía

Si falla antes de confirmar SQL:
  -> eliminar recurso nuevo
  -> responder error controlado
```

En producción, las columnas de imagen guardan URL HTTPS de Cloudinary. La eliminación utiliza la referencia derivada por el servicio de ciclo de vida.

## 5. Capas

- **Frontend:** páginas, componentes, contextos, rutas protegidas y servicios Axios.
- **Rutas:** autenticación, autorización, upload, validación e integridad.
- **Controladores:** orquestación HTTP y ciclo de imágenes.
- **Modelos:** consultas SQL parametrizadas.
- **Servicios:** Cloudinary y utilidades de archivos.
- **Base de datos:** estructura relacional, restricciones e índices.
- **Infraestructura:** Vercel, Render, AWS RDS, Cloudinary y GitHub.

## 6. Configuración por entorno

### Desarrollo

- Frontend en `http://localhost:5173`.
- Backend en `http://localhost:5000`.
- Base local o AWS RDS únicamente cuando la IP esté autorizada.
- `IMAGE_STORAGE=local` o carpeta Cloudinary de pruebas.

### Producción

- Frontend en Vercel.
- API en Render.
- SQL Server en AWS RDS.
- `IMAGE_STORAGE=cloudinary`.
- CORS con dominio definitivo.
- Secretos administrados por Render y Vercel.

## 7. Persistencia y conectividad

La configuración de `mssql` usa:

- `encrypt` y `trustServerCertificate` desde variables de entorno;
- pool máximo de 10 conexiones;
- puerto configurable;
- instancia nombrada solo cuando corresponde;
- endpoint directo para AWS RDS.

El health ejecuta `SELECT 1 AS ok` y responde 200 cuando la base está conectada o 503 cuando no está disponible.

## 8. Seguridad aplicada

- Helmet.
- CORS por lista blanca.
- Límite de cuerpo configurable.
- Rate limiting en autenticación.
- JWT y bcrypt.
- Consultas SQL parametrizadas.
- Validación de rol en backend.
- Validación binaria de imágenes.
- Respuestas 500 sin credenciales ni stack al cliente.
- Secretos fuera de Git.

## 9. Observabilidad mínima

- `GET /api/health` informa servicio, base, almacenamiento activo y timestamp.
- Render conserva logs de ejecución.
- Vercel conserva logs de construcción y despliegue.
- AWS RDS registra estado y conectividad.
- Cloudinary permite verificar activos almacenados.

## 10. Decisiones diferidas

- Cookie HttpOnly para sesión.
- Staging dedicado.
- Migraciones automatizadas.
- Lazy loading de rutas.
- Transacciones adicionales en operaciones compuestas.

Estas mejoras no bloquean el cierre de la versión 1.0.0.
