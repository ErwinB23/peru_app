import dotenv from 'dotenv';

dotenv.config();

const requiredVariables = [
  'DB_SERVER',
  'DB_DATABASE',
  'DB_USER',
  'DB_PASSWORD',
  'JWT_SECRET'
];

const missingVariables = requiredVariables.filter(
  (name) => !process.env[name] || process.env[name].trim() === ''
);

if (missingVariables.length > 0) {
  throw new Error(
    `Faltan variables de entorno obligatorias: ${missingVariables.join(', ')}`
  );
}

const parseOptionalInteger = (value, variableName) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const parsedValue = Number.parseInt(value, 10);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new Error(`${variableName} debe ser un número entero mayor que 0`);
  }

  return parsedValue;
};

const port = parseOptionalInteger(process.env.PORT || '5000', 'PORT');
const dbPort = parseOptionalInteger(process.env.DB_PORT, 'DB_PORT');

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  port,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  db: Object.freeze({
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    instance: process.env.DB_INSTANCE || undefined,
    port: dbPort
  }),
  jwt: Object.freeze({
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRE || '1d'
  })
});
