# Frontend — PERU APP

Interfaz web turístico-educativa para explorar y administrar información territorial, turística y gastronómica del Perú. Consume la API REST de PERU APP y protege las rutas de usuario y administración desde la interfaz.

## Tecnologías

- React 19 y Vite.
- JavaScript, HTML y CSS propio.
- React Router, Axios, Leaflet y Lucide React.
- No utiliza Tailwind CSS.

## Configuración y comandos

La URL de la API se configura con `VITE_API_URL`; no se deben versionar valores privados.

```powershell
cd frontend
npm ci
npm run dev
npm run lint
npm run build
```

## Despliegue

El frontend se despliega en Vercel. [`vercel.json`](./vercel.json) configura la reescritura SPA para que las rutas internas de React se recarguen sin responder 404.
