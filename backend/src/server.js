import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { getConnection, closeConnection } from './config/database.js';
import path from "path";
import { fileURLToPath } from "url";


// Importar rutas
import authRoutes from './routes/authRoutes.js';
import departamentoRoutes from './routes/departamentoRoutes.js';
import provinciaRoutes from './routes/provinciaRoutes.js';
import distritoRoutes from './routes/distritoRoutes.js';
import ciudadRoutes from './routes/ciudadRoutes.js';
import userRoutes from "./routes/userRoutes.js";
import lugarTuristicoRoutes from "./routes/lugarTuristicoRoutes.js";
import comidaTipicaRoutes from "./routes/comidaTipicaRoutes.js";
import lugarTuristicoProvinciaRoutes from './routes/lugarTuristicoProvinciaRoutes.js';
import comidaTipicaProvinciaRoutes from './routes/comidaTipicaProvinciaRoutes.js';
import lugarTuristicoDistritoRoutes from './routes/lugarTuristicoDistritoRoutes.js';
import comidaTipicaDistritoRoutes from './routes/comidaTipicaDistritoRoutes.js';
import lugarTuristicoCiudadRoutes from './routes/lugarTuristicoCiudadRoutes.js';
import comidaTipicaCiudadRoutes from './routes/comidaTipicaCiudadRoutes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, "..", "uploads");


// MIDDLEWARES
app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json()); // Parsea JSON en las peticiones
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsPath));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/lugares-turisticos", lugarTuristicoRoutes);
app.use("/api/comidas-tipicas", comidaTipicaRoutes);
app.use('/api/lugares-turisticos-provincias', lugarTuristicoProvinciaRoutes);
app.use('/api/comidas-tipicas-provincias', comidaTipicaProvinciaRoutes);
app.use('/api/lugares-turisticos-distritos', lugarTuristicoDistritoRoutes);
app.use('/api/comidas-tipicas-distritos', comidaTipicaDistritoRoutes);
app.use('/api/lugares-turisticos-ciudades', lugarTuristicoCiudadRoutes);
app.use('/api/comidas-tipicas-ciudades', comidaTipicaCiudadRoutes);


// RUTA DE PRUEBA
app.get('/', (req, res) => {
  res.json({ 
    message: '🇵🇪 API de Departamentos del Perú',
    status: 'OK',
    version: '1.0.0'
  });
});

// RUTA PARA PROBAR CONEXIÓN A LA BASE DE DATOS
app.get('/api/test-db', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT 
        (SELECT COUNT(*) FROM Usuarios) as total_usuarios,
        (SELECT COUNT(*) FROM Departamentos) as total_departamentos,
        (SELECT COUNT(*) FROM Provincias) as total_provincias,
        (SELECT COUNT(*) FROM Distritos) as total_distritos,
        (SELECT COUNT(*) FROM Ciudades) as total_ciudades
    `);
    
    res.json({
      message: '✅ Conexión a base de datos exitosa',
      database: process.env.DB_DATABASE,
      server: process.env.DB_SERVER,
      datos: result.recordset[0]
    });
  } catch (error) {
    res.status(500).json({
      message: '❌ Error al conectar con la base de datos',
      error: error.message
    });
  }
});

// RUTA DE DEBUG - VERIFICAR TOKEN Y ROL
app.get('/api/debug-token', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.json({
      error: 'No se envió token',
      header_recibido: authHeader
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    res.json({
      message: 'Token válido',
      usuario_decodificado: decoded,
      rol: decoded.rol,
      es_admin: decoded.rol === 'admin'
    });
  } catch (error) {
    res.json({
      error: 'Token inválido',
      detalle: error.message
    });
  }
});

// RUTAS DE LA API
app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);
app.use('/api/departamentos', departamentoRoutes);
app.use('/api/provincias', provinciaRoutes);
app.use('/api/distritos', distritoRoutes);
app.use('/api/ciudades', ciudadRoutes);


// MANEJO DE ERRORES 404
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.path 
  });
});

// INICIAR SERVIDOR
const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    await getConnection();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📊 Entorno: ${process.env.NODE_ENV}`);
      console.log(`🗄️  Base de datos: ${process.env.DB_DATABASE}\n`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// MANEJO DE CIERRE GRACEFUL
process.on('SIGINT', async () => {
  console.log('\n⚠️  Cerrando servidor...');
  await closeConnection();
  process.exit(0);
});

startServer();