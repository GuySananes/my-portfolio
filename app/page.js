import { getProjects } from "@/lib/db";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await getProjects();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>My Projects</h1>

        {projects.length === 0 && <p className={styles.empty}>No projects yet.</p>}

        <div className={styles.grid}>
          {projects.map((project) => (
            <div key={project.id} className={styles.card}>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              <div className={styles.links}>
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                )}
                {project.live_url && (
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                    Live site
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
