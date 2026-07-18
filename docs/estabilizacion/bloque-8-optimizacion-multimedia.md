# Bloque 8 - Optimizacion multimedia previa al despliegue

## Objetivo

Reducir el peso de los recursos estaticos del frontend sin cambiar su contenido visual ni el comportamiento funcional de la aplicacion.

## Cambios aplicados

- Cinco imagenes del carrusel Home convertidas de PNG a WebP.
- Imagen de fondo del login convertida de PNG a WebP.
- Ancho maximo de imagenes reducido a 1920 px, conservando proporcion.
- Video del panel de autenticacion recodificado a H.264, 1280x720, 24 fps y sin audio porque se reproduce con `muted`.
- Importaciones de `Home.jsx` actualizadas a WebP.
- Fondo de `AuthPage.css` actualizado a WebP.
- Correccion de `background-position` a `center center`.

## Resultados medidos

| Recurso | Antes | Despues | Reduccion |
|---|---:|---:|---:|
| Arequipa | 9.62 MB | 0.38 MB | 96.08 % |
| Ayacucho | 9.60 MB | 0.40 MB | 95.82 % |
| Cusco | 10.61 MB | 0.55 MB | 94.84 % |
| Lima | 8.80 MB | 0.33 MB | 96.21 % |
| Pasco | 10.22 MB | 0.50 MB | 95.14 % |
| Fondo de login | 6.99 MB | 0.38 MB | 94.54 % |
| Video del login | 22.49 MB | 1.46 MB | 93.53 % |
| **Total** | **78.33 MB** | **3.99 MB** | **94.90 %** |

## Alcance

Este bloque optimiza solamente recursos estaticos incluidos en el bundle del frontend. Las imagenes de `backend/uploads` no se modifican porque se migraran a Cloudinary en el siguiente bloque y pueden estar referenciadas por la base de datos local.

## Criterios de aceptacion

- El frontend compila sin errores.
- No existen referencias activas a los seis PNG sustituidos.
- Los cinco recursos Home y el fondo de login se sirven como WebP.
- El video conserva formato MP4/H.264 y pesa menos de 3 MB.
- La apariencia del login y del Home se conserva.
