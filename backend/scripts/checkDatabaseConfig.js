import { env } from '../src/config/env.js';

const safeConfig = {
  nodeEnv: env.nodeEnv,
  server: env.db.server,
  database: env.db.database,
  instance: env.db.instance || null,
  port: env.db.port || null,
  encrypt: env.db.encrypt,
  trustServerCertificate: env.db.trustServerCertificate
};

console.log('Configuración SQL efectiva (sin credenciales):');
console.table(safeConfig);

if (
  env.db.server.endsWith('.database.windows.net') &&
  (!env.db.encrypt || env.db.trustServerCertificate)
) {
  console.error(
    'Configuración Azure insegura: use DB_ENCRYPT=true y DB_TRUST_SERVER_CERTIFICATE=false.'
  );
  process.exit(1);
}

console.log('Configuración SQL válida.');
