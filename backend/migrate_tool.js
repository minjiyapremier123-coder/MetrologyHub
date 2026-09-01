const { spawn } = require('child_process');
require('dotenv').config();

const CONNECTION_STRING = process.env.DATABASE_URL || process.env.POSTGRES_URL || 'postgres://postgres:postgres@postgres:5432/lm_poc';

console.log('Running migrations using node-pg-migrate');

const args = ['node-pg-migrate', 'up', '-m', './migrations', '-d', CONNECTION_STRING];

const proc = spawn('npx', args, { stdio: 'inherit', shell: true });
proc.on('close', (code) => {
  if (code !== 0) {
    console.error('Migrations failed with exit code', code);
    process.exit(code);
  }
  console.log('Migrations applied successfully');
});
