import { spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

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

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

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
const reportDir = path.resolve('reports/newman');
const htmlReportPath = path.join(reportDir, 'peru-app-api.html');
const jsonReportPath = path.join(reportDir, 'peru-app-api.json');
const junitReportPath = path.join(reportDir, 'peru-app-api.xml');
const temporaryEnvironmentPath = path.join(
  os.tmpdir(),
  `peru-app-newman-${process.pid}-${Date.now()}.json`
);

fs.mkdirSync(reportDir, { recursive: true });

if (!fs.existsSync(collectionPath) || !fs.existsSync(environmentPath)) {
  console.error('No se encontraron la coleccion o el environment de Postman.');
  process.exit(1);
}

const environment = JSON.parse(fs.readFileSync(environmentPath, 'utf8'));
const runtimeValues = {
  baseUrl: process.env.QA_API_BASE_URL || 'http://localhost:5000',
  adminEmail: process.env.QA_ADMIN_EMAIL,
  adminPassword: process.env.QA_ADMIN_PASSWORD,
  userEmail: process.env.QA_USER_EMAIL,
  userPassword: process.env.QA_USER_PASSWORD
};

for (const variable of environment.values || []) {
  if (Object.hasOwn(runtimeValues, variable.key)) {
    variable.value = runtimeValues[variable.key];
  }
}

fs.writeFileSync(temporaryEnvironmentPath, JSON.stringify(environment), {
  encoding: 'utf8',
  mode: 0o600
});

const createHtmlReport = (report) => {
  const executions = report.run?.executions || [];
  const failures = report.run?.failures || [];
  const rows = executions.map((execution, index) => {
    const assertions = execution.assertions || [];
    const failed = assertions.filter((assertion) => assertion.error);
    const status = execution.response?.code ?? 'N/A';
    const method = execution.request?.method ?? 'N/A';
    const name = execution.item?.name ?? `Solicitud ${index + 1}`;
    const result = failed.length === 0 ? 'APROBADO' : 'FALLIDO';
    const details = failed
      .map((assertion) => assertion.error?.message || assertion.assertion)
      .join(' | ');

    return `<tr><td>${index + 1}</td><td>${escapeHtml(name)}</td><td>${escapeHtml(method)}</td><td>${escapeHtml(status)}</td><td>${result}</td><td>${escapeHtml(details)}</td></tr>`;
  }).join('\n');

  const stats = report.run?.stats || {};
  const totalAssertions = stats.assertions?.total ?? 0;
  const failedAssertions = stats.assertions?.failed ?? 0;
  const totalRequests = stats.requests?.total ?? executions.length;
  const started = report.run?.timings?.started;
  const completed = report.run?.timings?.completed;
  const duration = started && completed ? completed - started : 0;
  const failed = failures.length > 0 || failedAssertions > 0;

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>PERU APP - Reporte QA de API</title>
<style>
body{font-family:Arial,sans-serif;margin:32px;color:#1f2937}h1{margin-bottom:4px}.summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin:24px 0}.card{border:1px solid #d1d5db;border-radius:8px;padding:16px}.ok{color:#047857}.fail{color:#b91c1c}table{width:100%;border-collapse:collapse;font-size:14px}th,td{border:1px solid #d1d5db;padding:8px;text-align:left}th{background:#f3f4f6}
</style>
</head>
<body>
<h1>PERU APP - Reporte QA de API</h1>
<p>Generado: ${escapeHtml(new Date().toISOString())}</p>
<div class="summary">
<div class="card"><strong>Solicitudes</strong><br>${totalRequests}</div>
<div class="card"><strong>Aserciones</strong><br>${totalAssertions}</div>
<div class="card"><strong>Fallos</strong><br><span class="${failed ? 'fail' : 'ok'}">${failures.length}</span></div>
<div class="card"><strong>Duracion</strong><br>${duration} ms</div>
</div>
<p>Resultado global: <strong class="${failed ? 'fail' : 'ok'}">${failed ? 'FALLIDO' : 'APROBADO'}</strong></p>
<table>
<thead><tr><th>#</th><th>Solicitud</th><th>Metodo</th><th>HTTP</th><th>Resultado</th><th>Detalle</th></tr></thead>
<tbody>${rows}</tbody>
</table>
</body>
</html>`;
};

const npxCommand = 'npx';
const newmanVersion = process.env.NEWMAN_VERSION || '6.2.2';
const args = [
  '--yes',
  `newman@${newmanVersion}`,
  'run',
  collectionPath,
  '-e',
  temporaryEnvironmentPath,
  '--reporters',
  'cli,json,junit',
  '--reporter-json-export',
  jsonReportPath,
  '--reporter-junit-export',
  junitReportPath
];

try {
  const result = spawnSync(npxCommand, args, {
    cwd: process.cwd(),
    env: process.env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    // En Windows, npx es un archivo .cmd y necesita ejecutarse mediante cmd.exe.
    shell: process.platform === 'win32',
    windowsHide: true
  });

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);

  if (fs.existsSync(jsonReportPath)) {
    const report = JSON.parse(fs.readFileSync(jsonReportPath, 'utf8'));
    fs.writeFileSync(htmlReportPath, createHtmlReport(report), 'utf8');
  }

  if (result.error) {
    console.error(`No se pudo iniciar Newman aislado: ${result.error.message}`);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`Newman finalizo con codigo ${result.status}.`);
    process.exit(result.status || 1);
  }

  console.log(`[OK] Reporte Newman HTML: ${htmlReportPath}`);
  console.log(`[OK] Reporte Newman JSON: ${jsonReportPath}`);
  console.log(`[OK] Reporte Newman JUnit: ${junitReportPath}`);
} finally {
  fs.rmSync(temporaryEnvironmentPath, { force: true });
}
