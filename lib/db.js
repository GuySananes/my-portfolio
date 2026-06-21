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
     ORDER BY position ASC NULLS LAST, created_at DESC`
  );
  return rows;
}

export async function addProject({ title, description, githubUrl, liveUrl }) {
  await getPool().query(
    `INSERT INTO projects (title, description, github_url, live_url, position)
     VALUES ($1, $2, $3, $4, COALESCE((SELECT MAX(position) FROM projects), 0) + 1)`,
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

export async function moveProject(id, direction) {
  const pool = getPool();
  const { rows } = await pool.query(`SELECT id, position FROM projects WHERE id = $1`, [id]);
  const current = rows[0];
  if (!current) return;

  const comparator = direction === "up" ? "<" : ">";
  const order = direction === "up" ? "DESC" : "ASC";
  const { rows: neighborRows } = await pool.query(
    `SELECT id, position FROM projects WHERE position ${comparator} $1 ORDER BY position ${order} LIMIT 1`,
    [current.position]
  );
  const neighbor = neighborRows[0];
  if (!neighbor) return;

  await pool.query(`UPDATE projects SET position = $1 WHERE id = $2`, [neighbor.position, current.id]);
  await pool.query(`UPDATE projects SET position = $1 WHERE id = $2`, [current.position, neighbor.id]);
}
