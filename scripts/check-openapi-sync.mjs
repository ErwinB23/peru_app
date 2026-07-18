import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const appPath = path.join(root, 'backend', 'src', 'app.js');
const routesDir = path.join(root, 'backend', 'src', 'routes');
const openapiPath = path.join(root, 'specs', '001-peru-app', 'openapi.yaml');

function extractCalls(text) {
  const calls = [];
  const pattern = /router\.(get|post|put|patch|delete)\s*\(/g;
  let match;
  while ((match = pattern.exec(text))) {
    let index = pattern.lastIndex;
    let depth = 1;
    let quote = null;
    let escaped = false;
    const start = index;
    while (index < text.length && depth > 0) {
      const char = text[index];
      if (quote) {
        if (escaped) escaped = false;
        else if (char === '\\') escaped = true;
        else if (char === quote) quote = null;
      } else if (["'", '"', '`'].includes(char)) quote = char;
      else if (char === '(') depth += 1;
      else if (char === ')') depth -= 1;
      index += 1;
    }
    calls.push({ method: match[1].toUpperCase(), args: text.slice(start, index - 1) });
  }
  return calls;
}

function firstQuoted(args) {
  const match = args.match(/^\s*['"]([^'"]+)['"]/);
  if (!match) throw new Error(`No se pudo leer la ruta: ${args.slice(0, 80)}`);
  return match[1];
}

function normalizeExpress(value) {
  return value.replace(/:([A-Za-z0-9_]+)/g, '{$1}');
}

const app = fs.readFileSync(appPath, 'utf8');
const mounts = new Map();
for (const match of app.matchAll(/app\.use\('([^']+)',\s*(\w+)\);/g)) {
  mounts.set(match[2], match[1]);
}

const actual = new Set();
for (const file of fs.readdirSync(routesDir).filter((name) => name.endsWith('.js'))) {
  const variable = path.basename(file, '.js');
  const mount = mounts.get(variable);
  if (!mount) throw new Error(`Router sin montaje en app.js: ${variable}`);
  const text = fs.readFileSync(path.join(routesDir, file), 'utf8');
  for (const call of extractCalls(text)) {
    const localPath = firstQuoted(call.args);
    const full = localPath === '/' ? mount : `${mount.replace(/\/$/, '')}${localPath}`;
    actual.add(`${call.method} ${normalizeExpress(full)}`);
  }
}
actual.add('GET /api/health');

const yaml = fs.readFileSync(openapiPath, 'utf8').split(/\r?\n/);
const documented = new Set();
let inPaths = false;
let currentPath = null;
for (const line of yaml) {
  if (line === 'paths:') { inPaths = true; continue; }
  if (inPaths && /^components:/.test(line)) break;
  if (!inPaths) continue;
  const pathMatch = line.match(/^  (\/[^:]+):\s*$/);
  if (pathMatch) { currentPath = `/api${pathMatch[1] === '/' ? '' : pathMatch[1]}`; continue; }
  const methodMatch = line.match(/^    (get|post|put|patch|delete):\s*$/);
  if (methodMatch && currentPath) documented.add(`${methodMatch[1].toUpperCase()} ${currentPath}`);
}

const missing = [...actual].filter((item) => !documented.has(item)).sort();
const extra = [...documented].filter((item) => !actual.has(item)).sort();
console.log(`Rutas reales: ${actual.size}`);
console.log(`Operaciones OpenAPI: ${documented.size}`);
if (missing.length) console.error(`Faltan en OpenAPI:\n- ${missing.join('\n- ')}`);
if (extra.length) console.error(`Sobran en OpenAPI:\n- ${extra.join('\n- ')}`);
if (missing.length || extra.length) process.exit(1);
console.log('[OK] OpenAPI sincronizado 70/70.');
