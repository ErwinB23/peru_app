import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { getConnection, closeConnection, sql } from '../src/config/database.js';
import { env } from '../src/config/env.js';
import {
  deleteCloudinaryAsset,
  uploadFileToCloudinary
} from '../src/services/cloudinaryService.js';

const apply = process.argv.includes('--apply');
const dryRun = !apply || process.argv.includes('--dry-run');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const reportDir = path.resolve(__dirname, '..', 'reports', 'cloudinary');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const reportPath = path.join(reportDir, `migration-${timestamp}.json`);

const resources = [
  { table: 'Departamentos', folder: 'departamentos', columns: ['imagen_fondo'] },
  { table: 'Provincias', folder: 'provincias', columns: ['imagen_fondo'] },
  { table: 'Distritos', folder: 'distritos', columns: ['imagen_fondo'] },
  { table: 'Ciudades', folder: 'ciudades', columns: ['imagen_fondo'] },
  { table: 'LugaresTuristicos', folder: 'lugares-turisticos', columns: ['imagen', 'imagen_2', 'imagen_3', 'imagen_4'] },
  { table: 'ComidasTipicas', folder: 'comidas-tipicas', columns: ['imagen'] },
  { table: 'LugaresTuristicosProvincias', folder: 'lugares-turisticos-provincias', columns: ['imagen'] },
  { table: 'ComidasTipicasProvincias', folder: 'comidas-tipicas-provincias', columns: ['imagen'] },
  { table: 'LugaresTuristicosDistritos', folder: 'lugares-turisticos-distritos', columns: ['imagen'] },
  { table: 'ComidasTipicasDistritos', folder: 'comidas-tipicas-distritos', columns: ['imagen'] },
  { table: 'LugaresTuristicosCiudades', folder: 'lugares-turisticos-ciudades', columns: ['imagen'] },
  { table: 'ComidasTipicasCiudades', folder: 'comidas-tipicas-ciudades', columns: ['imagen'] },
];

const isLocalUploadPath = (value) => typeof value === 'string' && value.startsWith('/uploads/');

const toAbsoluteLocalPath = (storedPath) => {
  const relative = storedPath.replace(/^\/+/, '').replace(/\//g, path.sep);
  const absolute = path.resolve(process.cwd(), relative);
  const uploadsRoot = path.resolve(process.cwd(), 'uploads');
  const relativeToUploads = path.relative(uploadsRoot, absolute);

  if (relativeToUploads.startsWith('..') || path.isAbsolute(relativeToUploads)) {
    return null;
  }

  return absolute;
};

const buildSelect = ({ table, columns }) => {
  const predicates = columns.map((column) => `[${column}] LIKE '/uploads/%'`).join(' OR ');
  return `SELECT [id], ${columns.map((column) => `[${column}]`).join(', ')} FROM [${table}] WHERE ${predicates}`;
};

const updateRow = async (pool, resource, id, updates) => {
  const request = pool.request().input('id', sql.Int, id);
  const assignments = [];

  for (const [column, value] of Object.entries(updates)) {
    request.input(column, sql.VarChar(255), value);
    assignments.push(`[${column}] = @${column}`);
  }

  await request.query(`UPDATE [${resource.table}] SET ${assignments.join(', ')} WHERE [id] = @id`);
};

const report = {
  mode: dryRun ? 'dry-run' : 'apply',
  startedAt: new Date().toISOString(),
  imageStorage: env.imageStorage,
  cloudName: env.cloudinary.cloudName || null,
  scannedRecords: 0,
  migratedFields: 0,
  reusedUploads: 0,
  missingFiles: [],
  updates: [],
  errors: [],
};

const uploadedCache = new Map();

try {
  await fs.mkdir(reportDir, { recursive: true });
  const pool = await getConnection();

  for (const resource of resources) {
    const rows = (await pool.request().query(buildSelect(resource))).recordset;

    for (const row of rows) {
      report.scannedRecords += 1;
      const updates = {};
      const newlyUploadedPublicIds = [];

      try {
        for (const column of resource.columns) {
          const oldPath = row[column];
          if (!isLocalUploadPath(oldPath)) continue;

          const absolutePath = toAbsoluteLocalPath(oldPath);
          if (!absolutePath) {
            report.missingFiles.push({ table: resource.table, id: row.id, column, oldPath, reason: 'ruta insegura' });
            continue;
          }

          try {
            await fs.access(absolutePath);
          } catch {
            report.missingFiles.push({ table: resource.table, id: row.id, column, oldPath, reason: 'archivo no encontrado' });
            continue;
          }

          if (dryRun) {
            updates[column] = `[DRY-RUN] ${absolutePath}`;
            continue;
          }

          let upload = uploadedCache.get(oldPath);
          if (upload) {
            report.reusedUploads += 1;
          } else {
            upload = await uploadFileToCloudinary(absolutePath, {
              folder: resource.folder,
              originalName: path.basename(absolutePath),
            });
            uploadedCache.set(oldPath, upload);
            newlyUploadedPublicIds.push(upload.public_id);
          }

          updates[column] = upload.secure_url;
        }

        if (Object.keys(updates).length === 0) continue;

        if (!dryRun) {
          await updateRow(pool, resource, row.id, updates);
          report.migratedFields += Object.keys(updates).length;
        }

        report.updates.push({
          table: resource.table,
          id: row.id,
          values: Object.fromEntries(
            Object.entries(updates).map(([column, value]) => [column, {
              previous: row[column],
              current: value,
            }])
          )
        });
      } catch (error) {
        if (!dryRun) {
          await Promise.allSettled(newlyUploadedPublicIds.map((publicId) => deleteCloudinaryAsset(publicId)));
        }
        report.errors.push({ table: resource.table, id: row.id, message: error.message });
      }
    }
  }
} catch (error) {
  report.errors.push({ stage: 'global', message: error.message });
} finally {
  report.finishedAt = new Date().toISOString();
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');
  await closeConnection();
}

console.log(`Modo: ${report.mode}`);
console.log(`Registros revisados: ${report.scannedRecords}`);
console.log(`Campos migrados: ${report.migratedFields}`);
console.log(`Archivos faltantes: ${report.missingFiles.length}`);
console.log(`Errores: ${report.errors.length}`);
console.log(`Reporte: ${reportPath}`);

if (report.errors.length > 0 || (!dryRun && report.missingFiles.length > 0)) {
  process.exitCode = 1;
}
