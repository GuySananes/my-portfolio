import { getProjects } from "@/lib/db";
import { createProjectAction, updateProjectAction, deleteProjectAction, moveProjectAction, logout } from "../actions";
import styles from "../../page.module.css";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const projects = await getProjects();

  return (
    <main className={styles.main} style={{ maxWidth: 720, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Dashboard</h1>
        <form action={logout}>
          <button type="submit">Log out</button>
        </form>
      </div>

      <h2>Add a project</h2>
      <form action={createProjectAction} style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
        <input name="title" placeholder="Title" required style={{ padding: 8 }} />
        <textarea name="description" placeholder="Short description" required style={{ padding: 8 }} />
        <input name="githubUrl" placeholder="GitHub URL (optional)" style={{ padding: 8 }} />
        <input name="liveUrl" placeholder="Live site URL (optional)" style={{ padding: 8 }} />
        <button type="submit" style={{ padding: 8 }}>Add project</button>
      </form>

      <h2>Existing projects</h2>
      {projects.length === 0 && <p>No projects yet.</p>}
      {projects.map((project, index) => (
        <details key={project.id} style={{ border: "1px solid #444", borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <summary style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>{project.title}</span>
            <span style={{ display: "flex", gap: 4 }}>
              <form action={moveProjectAction}>
                <input type="hidden" name="id" value={project.id} />
                <input type="hidden" name="direction" value="up" />
                <button type="submit" disabled={index === 0} style={{ padding: "4px 8px" }}>▲</button>
              </form>
              <form action={moveProjectAction}>
                <input type="hidden" name="id" value={project.id} />
                <input type="hidden" name="direction" value="down" />
                <button type="submit" disabled={index === projects.length - 1} style={{ padding: "4px 8px" }}>▼</button>
              </form>
            </span>
          </summary>
          <form action={updateProjectAction} style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
            <input type="hidden" name="id" value={project.id} />
            <input name="title" defaultValue={project.title} required style={{ padding: 8 }} />
            <textarea name="description" defaultValue={project.description} required style={{ padding: 8 }} />
            <input name="githubUrl" defaultValue={project.github_url || ""} placeholder="GitHub URL (optional)" style={{ padding: 8 }} />
            <input name="liveUrl" defaultValue={project.live_url || ""} placeholder="Live site URL (optional)" style={{ padding: 8 }} />
            <button type="submit" style={{ padding: 8 }}>Save changes</button>
          </form>
          <form action={deleteProjectAction} style={{ marginTop: 8 }}>
            <input type="hidden" name="id" value={project.id} />
            <button type="submit" style={{ padding: 8, color: "crimson" }}>Delete</button>
          </form>
        </details>
      ))}
    </main>
  );
}
