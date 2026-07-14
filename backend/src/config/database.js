import sql from 'mssql';
import { env } from './env.js';

const rawServer = env.db.server;
let serverName = rawServer;
let instanceName = env.db.instance;

if (rawServer.includes('\\')) {
  const [host, instanceFromServer] = rawServer.split('\\');
  serverName = host;
  instanceName = instanceFromServer || instanceName;
}

const config = {
  server: serverName,
  database: env.db.database,
  user: env.db.user,
  password: env.db.password,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

if (instanceName) {
  config.options.instanceName = instanceName;
}

if (env.db.port) {
  config.port = env.db.port;
}

let pool = null;

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
