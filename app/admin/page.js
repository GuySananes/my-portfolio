import { login } from "./actions";
import styles from "../page.module.css";

export default async function AdminLoginPage({ searchParams }) {
  const params = await searchParams;
  const hasError = params?.error === "1";

  return (
    <main className={styles.main} style={{ maxWidth: 360, margin: "0 auto" }}>
      <h1>Admin Login</h1>
      <form action={login} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          autoFocus
          style={{ padding: 8, fontSize: 16 }}
        />
        <button type="submit" style={{ padding: 8, fontSize: 16 }}>
          Log in
        </button>
        {hasError && <p style={{ color: "crimson" }}>Wrong password.</p>}
      </form>
    </main>
  );
}
