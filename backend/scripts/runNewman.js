import fs from 'fs';
import path from 'path';
import newman from 'newman';

const required = [
  'QA_ADMIN_EMAIL',
  'QA_ADMIN_PASSWORD',
  'QA_USER_EMAIL',
  'QA_USER_PASSWORD'
];

const missing = required.filter((name) => !process.env[name]);
if (missing.length > 0) {
  console.error(`Faltan variables QA para Newman: ${missing.join(', ')}`);
  process.exit(1);
}

const projectRoot = path.resolve(process.cwd(), '..');
const collectionPath = path.join(
  projectRoot,
  'tests',
  'postman',
  'PERU_APP_QA.postman_collection.json'
);
const environmentPath = path.join(
  projectRoot,
  'tests',
  'postman',
  'PERU_APP_QA.postman_environment.json'
);
const reportPath = path.resolve('reports/newman/peru-app-api.html');

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
const environment = JSON.parse(fs.readFileSync(environmentPath, 'utf8'));
const runtimeValues = {
  baseUrl: process.env.QA_API_BASE_URL || 'http://localhost:5000',
  adminEmail: process.env.QA_ADMIN_EMAIL,
  adminPassword: process.env.QA_ADMIN_PASSWORD,
  userEmail: process.env.QA_USER_EMAIL,
  userPassword: process.env.QA_USER_PASSWORD
};

for (const variable of environment.values) {
  if (Object.hasOwn(runtimeValues, variable.key)) {
    variable.value = runtimeValues[variable.key];
  }
}

newman.run(
  {
    collection: collectionPath,
    environment,
    reporters: ['cli', 'htmlextra'],
    reporter: {
      htmlextra: {
        export: reportPath,
        title: 'PERU APP - Reporte QA de API'
      }
    }
  },
  (error, summary) => {
    if (error) {
      console.error('No se pudo ejecutar Newman:', error.message);
      process.exit(1);
    }

    const failures = summary.run.failures || [];
    if (failures.length > 0) {
      console.error(`Newman finalizo con ${failures.length} fallo(s).`);
      process.exit(1);
    }

    console.log(`[OK] Reporte Newman generado en ${reportPath}`);
  }
);
