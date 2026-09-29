import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const services = [
  {
    name: 'backend',
    command: process.platform === 'win32' ? 'python' : 'python3',
    args: ['server/main.py'],
    cwd: rootDir,
  },
  {
    name: 'collector',
    command: 'npm',
    args: ['run', 'dev', '--workspace=@kabadiwala/collector'],
    cwd: rootDir,
  },
  {
    name: 'recycler',
    command: 'npm',
    args: ['run', 'dev', '--workspace=@kabadiwala/recycler'],
    cwd: rootDir,
  },
];

const spawned = services.map(({ name, command, args, cwd }) => {
  console.log(`Starting ${name}...`);
  const child = spawn(command, args, {
    cwd,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: {
      ...process.env,
      FORCE_COLOR: '1',
    },
  });

  child.on('exit', (code, signal) => {
    if (code === 0) {
      console.log(`${name} exited cleanly.`);
      return;
    }

    const reason = signal ? `signal ${signal}` : `code ${code}`;
    console.error(`${name} exited with ${reason}.`);
    process.exit(code ?? 1);
  });

  child.on('error', (error) => {
    console.error(`Failed to start ${name}:`, error.message);
    process.exit(1);
  });

  return child;
});

const shutdown = () => {
  for (const child of spawned) {
    if (!child.killed) {
      child.kill('SIGTERM');
    }
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
