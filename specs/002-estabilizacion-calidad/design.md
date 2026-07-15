# Diseño Técnico Final — SPEC-002

## 1. Decisiones de diseño

| Decisión | Implementación | Justificación |
|---|---|---|
| Autenticación obligatoria | `verifyToken` en rutas funcionales | Denegación por defecto. |
| Rol vigente | Consulta a `Usuarios` en cada petición protegida | Evita privilegios obsoletos en JWT. |
| Sesión frontend | `AuthContext` + perfil + interceptor 401 | Evita confiar solo en `localStorage`. |
| Validación | `validationMiddleware.js` | Reglas reutilizables y respuestas uniformes. |
| Integridad | Middlewares + PK/FK/CHECK/UNIQUE | Defensa en profundidad. |
| Imágenes locales | firma binaria + limpieza posterior a SQL | Reduce archivos inválidos y huérfanos. |
| Errores | `AppError`, `errorPayload`, middleware global | Contrato HTTP predecible. |
| Pruebas | Jest, Supertest, Newman y Playwright | Pirámide de pruebas representativa. |
| Contrato | OpenAPI 3.0.3 | Sincronización explícita con Express. |

## 2. Flujo de autenticación

```text
Authorization: Bearer JWT
        v
Verificar firma y expiración
        v
Buscar usuario actual en SQL Server
        v
Construir req.user con rol vigente
        v
Aplicar isAdmin cuando corresponde
```

## 3. Flujo de escritura con imagen

```text
Recibir multipart
  -> validar límite/MIME/firma
  -> validar campos
  -> validar relación y duplicado
  -> ejecutar SQL
  -> confirmar respuesta
  -> retirar imagen anterior si correspondía

Si falla antes de confirmar SQL:
  -> eliminar archivo nuevo
  -> responder error controlado
```

## 4. Capas

- **Frontend:** páginas, componentes, contexto, servicios Axios.
- **Rutas:** autenticación, autorización, upload, validación e integridad.
- **Controladores:** orquestación HTTP y ciclo de imágenes.
- **Modelos:** consultas SQL parametrizadas.
- **Base de datos:** estructura relacional, restricciones e índices.

## 5. Persistencia en producción

`backend/uploads` es válida únicamente para desarrollo. La producción utilizará Cloudinary; SQL Server/Azure SQL almacenará la URL y el identificador público requerido para reemplazo o eliminación.

## 6. Observabilidad mínima

- `GET /api/health` devuelve estado de servicio y conexión.
- Los errores 500 se registran en servidor sin incluir credenciales en la respuesta.
- Render será la fuente de logs de ejecución durante el despliegue académico.
