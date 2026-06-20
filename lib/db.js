import { Pool } from "pg";

let pool;

function getPool() {
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return pool;
}

export async function getProjects() {
  const { rows } = await getPool().query(
    `SELECT id, title, description, github_url, live_url
     FROM projects
     ORDER BY created_at DESC`
  );
  return rows;
}

export async function addProject({ title, description, githubUrl, liveUrl }) {
  await getPool().query(
    `INSERT INTO projects (title, description, github_url, live_url)
     VALUES ($1, $2, $3, $4)`,
    [title, description, githubUrl || null, liveUrl || null]
  );
}

export async function updateProject(id, { title, description, githubUrl, liveUrl }) {
  await getPool().query(
    `UPDATE projects
     SET title = $1, description = $2, github_url = $3, live_url = $4
     WHERE id = $5`,
    [title, description, githubUrl || null, liveUrl || null, id]
  );
}

export async function deleteProject(id) {
  await getPool().query(`DELETE FROM projects WHERE id = $1`, [id]);
}
