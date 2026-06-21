import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

await pool.query(`
  CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    github_url TEXT,
    live_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now()
  )
`);

await pool.query(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS position INTEGER`);
await pool.query(`
  UPDATE projects SET position = sub.rn
  FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY position NULLS LAST, created_at DESC) AS rn
    FROM projects
  ) sub
  WHERE projects.id = sub.id AND projects.position IS NULL
`);

console.log("projects table ready");
await pool.end();
