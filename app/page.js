import { getProjects } from "@/lib/db";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await getProjects();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.brand}>Guy Sananes</span>
        <nav className={styles.nav}>
          <a href="#projects">Projects</a>
        </nav>
      </header>

      <section className={styles.hero}>
        <p className={styles.heroEyebrow}>Hi, I&apos;m</p>
        <h1 className={styles.heroName}>Guy Sananes</h1>
        <p className={styles.heroTagline}>I build things for the web.</p>
        <a href="#projects" className={styles.heroCta}>
          See my work ↓
        </a>
      </section>

      <main className={styles.main} id="projects">
        <h2 className={styles.sectionTitle}>Projects</h2>

        {projects.length === 0 && <p className={styles.empty}>No projects yet.</p>}

        <div className={styles.grid}>
          {projects.map((project) => (
            <article key={project.id} className={styles.card}>
              <h3>{project.title}</h3>
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
            </article>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Guy Sananes</p>
      </footer>
    </div>
  );
}
