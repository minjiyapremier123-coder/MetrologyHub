const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const CONNECTION_STRING = process.env.DATABASE_URL || process.env.POSTGRES_URL || 'postgres://postgres:postgres@postgres:5432/lm_poc';
const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function run() {
  const client = new Client({ connectionString: CONNECTION_STRING });
  await client.connect();
  try {
    console.log('Connected to Postgres, running versioned migrations from', MIGRATIONS_DIR);
    // ensure migrations table exists (in case migrations folder was updated)
    await client.query(`CREATE TABLE IF NOT EXISTS migrations (id SERIAL PRIMARY KEY, name TEXT NOT NULL UNIQUE, applied_at TIMESTAMP WITH TIME ZONE DEFAULT now());`);

    const files = fs.readdirSync(MIGRATIONS_DIR).filter(f=>f.endsWith('.sql')).sort();
    for (const file of files) {
      const name = file;
      // check if applied
      const r = await client.query('SELECT 1 FROM migrations WHERE name=$1', [name]);
      if (r.rows.length > 0) {
        console.log('Skipping already applied migration', name);
        continue;
      }
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
      console.log('Applying migration', name);
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO migrations(name) VALUES($1)', [name]);
        await client.query('COMMIT');
        console.log('Applied', name);
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      }
    }
    console.log('All migrations applied');
  } finally {
    await client.end();
  }
}

run().catch(err => { console.error('Migration failed:', err.message); process.exit(1); });
