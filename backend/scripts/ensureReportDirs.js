import fs from 'fs';
import path from 'path';

for (const relativePath of ['reports/jest', 'reports/newman']) {
  fs.mkdirSync(path.resolve(relativePath), { recursive: true });
}
