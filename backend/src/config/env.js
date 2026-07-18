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

const parseAllowedOrigins = () => {
  const rawOrigins =
    process.env.FRONTEND_URLS ||
    process.env.FRONTEND_URL ||
    'http://localhost:5173';

  const origins = rawOrigins
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);

  if (origins.length === 0) {
    throw new Error('Debe configurarse al menos un origen permitido para CORS');
  }

  return origins;
};


const parseImageStorage = () => {
  const value = (process.env.IMAGE_STORAGE || 'local').trim().toLowerCase();

  if (!['local', 'cloudinary'].includes(value)) {
    throw new Error('IMAGE_STORAGE debe ser local o cloudinary');
  }

  if (value === 'cloudinary') {
    const requiredCloudinary = [
      'CLOUDINARY_CLOUD_NAME',
      'CLOUDINARY_API_KEY',
      'CLOUDINARY_API_SECRET'
    ];

    const missingCloudinary = requiredCloudinary.filter(
      (name) => !process.env[name] || process.env[name].trim() === ''
    );

    if (missingCloudinary.length > 0) {
      throw new Error(
        `Faltan variables de Cloudinary: ${missingCloudinary.join(', ')}`
      );
    }
  }

  return value;
};

const port = parseOptionalInteger(process.env.PORT || '5000', 'PORT');
const dbPort = parseOptionalInteger(process.env.DB_PORT, 'DB_PORT');
const frontendUrls = parseAllowedOrigins();
const imageStorage = parseImageStorage();

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  port,
  frontendUrl: frontendUrls[0],
  frontendUrls: Object.freeze(frontendUrls),
  requestBodyLimit: process.env.REQUEST_BODY_LIMIT || '1mb',
  imageStorage,
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
  }),
  cloudinary: Object.freeze({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    folder: (process.env.CLOUDINARY_FOLDER || `peru-app/${process.env.NODE_ENV || 'development'}`)
      .replace(/^\/+|\/+$/g, '')
  })
});
