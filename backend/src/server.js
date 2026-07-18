import app from './app.js';
import { getConnection, closeConnection } from './config/database.js';
import { env } from './config/env.js';

let server;

const startServer = async () => {
  try {
    await getConnection();

    server = app.listen(env.port, () => {
      console.log(`\n🚀 Servidor corriendo en http://localhost:${env.port}`);
      console.log(`📊 Entorno: ${env.nodeEnv}`);
      console.log(`🗄️  Base de datos: ${env.db.database}`);
      console.log(`🌐 Orígenes permitidos: ${env.frontendUrls.join(', ')}\n`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

const shutdown = async (signal) => {
  console.log(`\n⚠️  Señal ${signal} recibida. Cerrando servidor...`);

  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }

  await closeConnection();
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer();
