import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

// DEBUG - Verificar variables de entorno
console.log('🔍 Variables de entorno:');
console.log('DB_SERVER:', process.env.DB_SERVER);
console.log('DB_DATABASE:', process.env.DB_DATABASE);
console.log('DB_USER:', process.env.DB_USER);

// Parsear `DB_SERVER` para soportar formatos "HOST\\INSTANCE" o solo "HOST"
const rawServer = process.env.DB_SERVER || 'localhost';
let serverName = rawServer;
let instance = process.env.DB_INSTANCE || null;
if (rawServer.includes('\\')) {
  const parts = rawServer.split('\\');
  serverName = parts[0];
  instance = parts[1] || instance;
}

const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined;

// Configuración de la conexión a SQL Server
const config = {
  server: serverName,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// Si se especificó instancia, agrégala a las opciones
if (instance) {
  config.options.instanceName = instance;
}

// Si se especificó puerto, agrégalo al config (mssql usa `port` fuera de `options`)
if (dbPort) {
  config.port = dbPort;
}

// Pool de conexiones global
let pool = null;

// Función para obtener la conexión
export const getConnection = async () => {
  try {
    if (!pool) {
      pool = await sql.connect(config);
      console.log('✅ Conexión a SQL Server establecida');
    }
    return pool;
  } catch (error) {
    console.error('❌ Error al conectar con SQL Server:', error.message);
    throw error;
  }
};

// Función para cerrar la conexión
export const closeConnection = async () => {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      console.log('🔌 Conexión a SQL Server cerrada');
    }
  } catch (error) {
    console.error('❌ Error al cerrar la conexión:', error.message);
  }
};

export { sql };