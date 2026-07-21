import { AppError, errorPayload } from '../utils/httpErrors.js';
import { cleanupRequestFiles } from '../utils/fileCleanup.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const isBlank = (value) =>
  value === undefined || value === null ||
  (typeof value === 'string' && value.trim() === '');

const detail = (field, message) => ({ field, message });

const textRule = (options = {}) => ({ type: 'string', ...options });
const numberRule = (options = {}) => ({ type: 'number', ...options });
const integerRule = (options = {}) => ({ type: 'integer', ...options });
const emailRule = (options = {}) => ({ type: 'email', ...options });
const dateRule = (options = {}) => ({ type: 'date', ...options });
const passwordRule = (options = {}) => ({ type: 'password', ...options });

const normalizeString = (value) => String(value).trim();

const validateValue = (field, value, rule) => {
  const errors = [];

  if (isBlank(value)) {
    if (rule.required) {
      errors.push(detail(field, rule.requiredMessage || 'El campo es obligatorio'));
      return { errors };
    }

    return { value: rule.nullable === true ? null : undefined, errors };
  }

  if (rule.type === 'string' || rule.type === 'email' || rule.type === 'password') {
    const normalized = normalizeString(value);

    if (rule.minLength && normalized.length < rule.minLength) {
      errors.push(detail(field, `Debe tener al menos ${rule.minLength} caracteres`));
    }

    if (rule.maxLength && normalized.length > rule.maxLength) {
      errors.push(detail(field, `No debe superar ${rule.maxLength} caracteres`));
    }

    if (rule.type === 'email' && !EMAIL_PATTERN.test(normalized)) {
      errors.push(detail(field, 'El correo no tiene un formato válido'));
    }

    if (rule.enum && !rule.enum.includes(normalized)) {
      errors.push(detail(field, `Valor permitido: ${rule.enum.join(', ')}`));
    }

    if (rule.pattern && !rule.pattern.test(normalized)) {
      errors.push(detail(field, rule.patternMessage || 'El formato no es válido'));
    }

    return {
      value: rule.type === 'email' ? normalized.toLowerCase() : normalized,
      errors
    };
  }

  if (rule.type === 'number' || rule.type === 'integer') {
    const parsed = Number(value);

    if (!Number.isFinite(parsed) || (rule.type === 'integer' && !Number.isInteger(parsed))) {
      errors.push(detail(field, rule.type === 'integer'
        ? 'Debe ser un número entero válido'
        : 'Debe ser un número válido'));
      return { errors };
    }

    if (rule.min !== undefined && parsed < rule.min) {
      errors.push(detail(field, `Debe ser mayor o igual que ${rule.min}`));
    }

    if (rule.exclusiveMin !== undefined && parsed <= rule.exclusiveMin) {
      errors.push(detail(field, `Debe ser mayor que ${rule.exclusiveMin}`));
    }

    if (rule.max !== undefined && parsed > rule.max) {
      errors.push(detail(field, `Debe ser menor o igual que ${rule.max}`));
    }

    return { value: parsed, errors };
  }

  if (rule.type === 'date') {
    const normalized = normalizeString(value);

    if (!DATE_PATTERN.test(normalized)) {
      errors.push(detail(field, 'Debe tener el formato AAAA-MM-DD'));
      return { errors };
    }

    const date = new Date(`${normalized}T00:00:00Z`);
    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== normalized) {
      errors.push(detail(field, 'La fecha no es válida'));
      return { errors };
    }

    if (rule.notFuture) {
      const today = new Date();
      const todayUtc = new Date(Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate()
      ));

      if (date > todayUtc) {
        errors.push(detail(field, 'La fecha no puede estar en el futuro'));
      }
    }

    return { value: normalized, errors };
  }

  return { value, errors };
};

const validateSchema = (schema, source, customValidator) => {
  return async (req, res, next) => {
    const target = req[source] || {};
    const errors = [];

    for (const [field, rule] of Object.entries(schema)) {
      const result = validateValue(field, target[field], rule);
      errors.push(...result.errors);

      if (result.errors.length === 0 && result.value !== undefined) {
        target[field] = result.value;
      }
    }

    if (customValidator) {
      const customErrors = customValidator(target, req) || [];
      errors.push(...customErrors);
    }

    if (errors.length > 0) {
      await cleanupRequestFiles(req);
      const validationError = new AppError(
        'Datos inválidos',
        400,
        'VALIDATION_ERROR',
        errors
      );
      return res.status(400).json(errorPayload(validationError));
    }

    req[source] = target;
    return next();
  };
};

const positiveId = (label = 'ID') => integerRule({
  required: true,
  min: 1,
  requiredMessage: `${label} es obligatorio`
});

const name = (maxLength = 160) => textRule({
  required: true,
  minLength: 2,
  maxLength
});

const optionalText = (maxLength) => textRule({ nullable: true, ...(maxLength ? { maxLength } : {}) });
const requiredDescription = textRule({ required: true, minLength: 5 });
export const validateRegisterBody = validateSchema({
  nombres: textRule({ required: true, minLength: 2, maxLength: 100 }),
  apellidos: textRule({ required: true, minLength: 2, maxLength: 100 }),
  fecha_nacimiento: dateRule({ required: true, notFuture: true }),
  email: emailRule({ required: true, maxLength: 150 }),
  password: passwordRule({ required: true, minLength: 6, maxLength: 72 })
}, 'body');

export const validateLoginBody = validateSchema({
  email: emailRule({ required: true, maxLength: 150 }),
  password: passwordRule({ required: true, minLength: 1, maxLength: 72 })
}, 'body');

export const validateProfileBody = validateSchema({
  nombres: textRule({ required: true, minLength: 2, maxLength: 100 }),
  apellidos: textRule({ required: true, minLength: 2, maxLength: 100 }),
  fecha_nacimiento: dateRule({ required: true, notFuture: true }),
  email: emailRule({ required: true, maxLength: 150 }),
  currentPassword: passwordRule({ maxLength: 72 }),
  newPassword: passwordRule({ minLength: 6, maxLength: 72 })
}, 'body', (body) => {
  const errors = [];
  const hasCurrent = !isBlank(body.currentPassword);
  const hasNew = !isBlank(body.newPassword);

  if (hasCurrent !== hasNew) {
    errors.push(detail(
      'newPassword',
      'Para cambiar la contraseña debe enviar la contraseña actual y la nueva'
    ));
  }

  return errors;
});

export const validateAdminUserBody = validateSchema({
  nombres: textRule({ required: true, minLength: 2, maxLength: 100 }),
  apellidos: textRule({ required: true, minLength: 2, maxLength: 100 }),
  fecha_nacimiento: dateRule({ required: true, notFuture: true }),
  email: emailRule({ required: true, maxLength: 150 }),
  rol: textRule({ required: true, enum: ['usuario', 'admin'] })
}, 'body');

export const validateSearchQuery = validateSchema({
  q: textRule({ required: true, minLength: 2, maxLength: 100 })
}, 'query');

export const validateIdParam = validateSchema({
  id: positiveId('ID')
}, 'params');

export const validateDepartamentoIdParam = validateSchema({
  departamentoId: positiveId('ID de departamento')
}, 'params');

export const validateProvinciaIdParam = validateSchema({
  provinciaId: positiveId('ID de provincia')
}, 'params');

export const validateDistritoIdParam = validateSchema({
  distritoId: positiveId('ID de distrito')
}, 'params');

export const validateCiudadIdParam = validateSchema({
  ciudadId: positiveId('ID de ciudad')
}, 'params');

export const validateProvinciaQuery = validateSchema({
  departamento_id: integerRule({ min: 1 })
}, 'query');

export const validateDistritoQuery = validateSchema({
  provincia_id: integerRule({ min: 1 }),
  page: integerRule({ min: 1 }),
  limit: integerRule({ min: 1, max: 100 })
}, 'query');

export const validateCiudadQuery = validateSchema({
  departamento_id: integerRule({ min: 1 }),
  provincia_id: integerRule({ min: 1 }),
  distrito_id: integerRule({ min: 1 }),
  page: integerRule({ min: 1 }),
  limit: integerRule({ min: 1, max: 100 })
}, 'query');

export const validateDepartamentoBody = validateSchema({
  nombre: name(120),
  capital: textRule({ required: true, minLength: 2, maxLength: 120 }),
  region_natural: textRule({ required: true, minLength: 2, maxLength: 100 }),
  area_km2: numberRule({ required: true, exclusiveMin: 0 }),
  poblacion_aprox: integerRule({ required: true, min: 0 }),
  clima_predominante: optionalText(180),
  principales_actividades: optionalText(255),
  atractivo_turistico_principal: optionalText(255),
  descripcion: optionalText(),
  introduccion: optionalText(),
  imagen_fondo: optionalText(255)
}, 'body');

export const validateDepartamentoIntroduccionBody = async (req, res, next) => {
  const body = req.body || {};
  const fields = Object.keys(body);
  const errors = [];

  if (!Object.prototype.hasOwnProperty.call(body, 'introduccion')) {
    errors.push(detail('introduccion', 'El campo es obligatorio'));
  }

  for (const field of fields) {
    if (field !== 'introduccion') {
      errors.push(detail(field, 'El campo no está permitido'));
    }
  }

  if (
    Object.prototype.hasOwnProperty.call(body, 'introduccion') &&
    body.introduccion !== null &&
    typeof body.introduccion !== 'string'
  ) {
    errors.push(detail('introduccion', 'Debe ser un texto o null'));
  }

  if (errors.length > 0) {
    const validationError = new AppError(
      'Datos inválidos',
      400,
      'VALIDATION_ERROR',
      errors
    );
    return res.status(400).json(errorPayload(validationError));
  }

  const normalized = body.introduccion === null
    ? null
    : body.introduccion.trim();

  req.body = {
    introduccion: normalized === '' ? null : normalized
  };
  return next();
};

export const validateProvinciaBody = validateSchema({
  nombre: name(120),
  capital: textRule({ required: true, minLength: 2, maxLength: 120 }),
  departamento_id: positiveId('ID de departamento'),
  area_km2: numberRule({ required: true, exclusiveMin: 0 }),
  poblacion_aprox: integerRule({ required: true, min: 0 }),
  actividad_economica_principal: optionalText(255),
  festividad_representativa: optionalText(255),
  descripcion_general: optionalText(),
  imagen_fondo: optionalText(255)
}, 'body');

export const validateDistritoBody = validateSchema({
  nombre: name(120),
  provincia_id: positiveId('ID de provincia'),
  area_km2: numberRule({ required: true, exclusiveMin: 0 }),
  poblacion_aprox: integerRule({ required: true, min: 0 }),
  altitud_msnm: integerRule({ min: 0 }),
  tipo_zona: textRule({ enum: ['Urbano', 'Rural', 'Mixto'], maxLength: 120 }),
  servicios_basicos: optionalText(255),
  nivel_desarrollo: textRule({ enum: ['Alto', 'Medio', 'Bajo'], maxLength: 120 }),
  descripcion: optionalText(),
  imagen_fondo: optionalText(255)
}, 'body');

export const validateCiudadBody = validateSchema({
  nombre: name(120),
  distrito_id: positiveId('ID de distrito'),
  tipo_ciudad: textRule({
    enum: ['Capital', 'Historica', 'Turistica', 'Comercial'],
    maxLength: 120
  }),
  poblacion: integerRule({ required: true, min: 0 }),
  latitud: numberRule({ min: -90, max: 90 }),
  longitud: numberRule({ min: -180, max: 180 }),
  clima: optionalText(150),
  principal_actividad: optionalText(255),
  atractivo_turistico: optionalText(255),
  descripcion_cultural: optionalText(),
  imagen_fondo: optionalText(255)
}, 'body');

const lugarDepartamentoSchema = {
  departamento_id: positiveId('ID de departamento'),
  nombre: name(160),
  descripcion: requiredDescription,
  imagen: optionalText(255),
  ubicacion_referencial: optionalText(255),
  acerca: optionalText(),
  recomendaciones_antes: optionalText(),
  recomendaciones_durante: optionalText(),
  clima: optionalText(120),
  altura: optionalText(120),
  provincia: optionalText(120),
  distrito: optionalText(120),
  origen_nombre: optionalText(160),
  latitud_origen: numberRule({ min: -90, max: 90 }),
  longitud_origen: numberRule({ min: -180, max: 180 }),
  latitud_destino: numberRule({ min: -90, max: 90 }),
  longitud_destino: numberRule({ min: -180, max: 180 }),
  imagen_2: optionalText(255),
  imagen_3: optionalText(255),
  imagen_4: optionalText(255),
  origen_busqueda: optionalText(255),
  destino_nombre: optionalText(180),
  destino_busqueda: optionalText(255)
};

export const validateLugarDepartamentoBody = validateSchema(
  lugarDepartamentoSchema,
  'body'
);

export const validateComidaDepartamentoBody = validateSchema({
  departamento_id: positiveId('ID de departamento'),
  nombre: name(160),
  descripcion: requiredDescription,
  imagen: optionalText(255),
  origen_descripcion: optionalText()
}, 'body');

const nestedLugarSchema = (parentField, parentLabel) => ({
  [parentField]: positiveId(`ID de ${parentLabel}`),
  nombre: name(160),
  descripcion: requiredDescription,
  imagen: optionalText(255),
  ubicacion_referencial: optionalText(255)
});

const nestedComidaSchema = (parentField, parentLabel) => ({
  [parentField]: positiveId(`ID de ${parentLabel}`),
  nombre: name(160),
  descripcion: requiredDescription,
  imagen: optionalText(255),
  origen_descripcion: optionalText()
});

export const validateLugarProvinciaBody = validateSchema(
  nestedLugarSchema('provincia_id', 'provincia'),
  'body'
);
export const validateComidaProvinciaBody = validateSchema(
  nestedComidaSchema('provincia_id', 'provincia'),
  'body'
);
export const validateLugarDistritoBody = validateSchema(
  nestedLugarSchema('distrito_id', 'distrito'),
  'body'
);
export const validateComidaDistritoBody = validateSchema(
  nestedComidaSchema('distrito_id', 'distrito'),
  'body'
);
export const validateLugarCiudadBody = validateSchema(
  nestedLugarSchema('ciudad_id', 'ciudad'),
  'body'
);
export const validateComidaCiudadBody = validateSchema(
  nestedComidaSchema('ciudad_id', 'ciudad'),
  'body'
);
