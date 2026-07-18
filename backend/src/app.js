import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { getConnection } from './config/database.js';
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import departamentoRoutes from './routes/departamentoRoutes.js';
import provinciaRoutes from './routes/provinciaRoutes.js';
import distritoRoutes from './routes/distritoRoutes.js';
import ciudadRoutes from './routes/ciudadRoutes.js';
import userRoutes from './routes/userRoutes.js';
import lugarTuristicoRoutes from './routes/lugarTuristicoRoutes.js';
import comidaTipicaRoutes from './routes/comidaTipicaRoutes.js';
import lugarTuristicoProvinciaRoutes from './routes/lugarTuristicoProvinciaRoutes.js';
import comidaTipicaProvinciaRoutes from './routes/comidaTipicaProvinciaRoutes.js';
import lugarTuristicoDistritoRoutes from './routes/lugarTuristicoDistritoRoutes.js';
import comidaTipicaDistritoRoutes from './routes/comidaTipicaDistritoRoutes.js';
import lugarTuristicoCiudadRoutes from './routes/lugarTuristicoCiudadRoutes.js';
import comidaTipicaCiudadRoutes from './routes/comidaTipicaCiudadRoutes.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, '..', 'uploads');
const allowedOrigins = new Set(env.frontendUrls);

if (env.nodeEnv === 'production') {
  app.set('trust proxy', 1);
}

app.disable('x-powered-by');
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);
app.use(
  cors({
    origin(origin, callback) {
      // Permite herramientas sin cabecera Origin, como Postman, Newman y health checks.
      if (!origin || allowedOrigins.has(origin.replace(/\/$/, ''))) {
        return callback(null, true);
      }

      const corsError = new Error('Origen no autorizado por CORS');
      corsError.code = 'CORS_ORIGIN_DENIED';
      corsError.status = 403;
      return callback(corsError);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
    maxAge: 86400
  })
);
app.use(express.json({ limit: env.requestBodyLimit }));
app.use(express.urlencoded({ extended: true, limit: env.requestBodyLimit }));
app.use('/uploads', express.static(uploadsPath));

// Único endpoint técnico público. No expone servidor, credenciales ni estadísticas.
app.get('/api/health', async (req, res) => {
  try {
    const pool = await getConnection();
    await pool.request().query('SELECT 1 AS ok');

    return res.status(200).json({
      status: 'ok',
      service: 'peru-app-api',
      database: 'connected',
      imageStorage: env.imageStorage,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check sin conexión a la base de datos:', error.message);
    return res.status(503).json({
      status: 'degraded',
      service: 'peru-app-api',
      database: 'unavailable',
      imageStorage: env.imageStorage,
      timestamp: new Date().toISOString()
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departamentos', departamentoRoutes);
app.use('/api/provincias', provinciaRoutes);
app.use('/api/distritos', distritoRoutes);
app.use('/api/ciudades', ciudadRoutes);
app.use('/api/lugares-turisticos', lugarTuristicoRoutes);
app.use('/api/comidas-tipicas', comidaTipicaRoutes);
app.use('/api/lugares-turisticos-provincias', lugarTuristicoProvinciaRoutes);
app.use('/api/comidas-tipicas-provincias', comidaTipicaProvinciaRoutes);
app.use('/api/lugares-turisticos-distritos', lugarTuristicoDistritoRoutes);
app.use('/api/comidas-tipicas-distritos', comidaTipicaDistritoRoutes);
app.use('/api/lugares-turisticos-ciudades', lugarTuristicoCiudadRoutes);
app.use('/api/comidas-tipicas-ciudades', comidaTipicaCiudadRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
