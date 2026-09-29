import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('Exporting OpenAPI schema from FastAPI backend...');

const pythonCmd = 'C:\\Users\\User\\AppData\\Local\\Programs\\Python\\Python311\\python.exe';
const script = `
import json
import sys
import os
sys.path.insert(0, os.path.join(r"${rootDir}", "server"))
from main import app

with open(os.path.join(r"${rootDir}", "server", "openapi.json"), "w") as f:
    json.dump(app.openapi(), f, indent=2)
print("[OK] Exported server/openapi.json")
`;

const proc = spawn(pythonCmd, ['-c', script], {
  env: { ...process.env, PYTHONPATH: path.join(rootDir, 'server') }
});

proc.stdout.on('data', (d) => console.log(d.toString()));
proc.stderr.on('data', (d) => console.error(d.toString()));

proc.on('close', (code) => {
  if (code === 0) {
    console.log('[SUCCESS] OpenAPI schema generated successfully.');
  } else {
    console.error(`[ERROR] Failed to export OpenAPI schema (exit code ${code})`);
    process.exit(code);
  }
});
