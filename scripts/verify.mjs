import { chromium } from "playwright";

const base = "http://localhost:3000";
const browser = await chromium.launch();
const page = await browser.newPage();

function log(step, ok, extra = "") {
  console.log(`${ok ? "PASS" : "FAIL"} - ${step}${extra ? " - " + extra : ""}`);
}

// 1. public page empty state
await page.goto(`${base}/`);
log("public page shows empty state", await page.locator("text=No projects yet").isVisible());

// 2. dashboard redirects when logged out
await page.goto(`${base}/admin/dashboard`);
log("dashboard redirects to /admin when logged out", page.url() === `${base}/admin`);

// 3. wrong password shows error
await page.goto(`${base}/admin`);
await page.fill('input[name="password"]', "wrong-password");
await page.click('button[type="submit"]');
await page.waitForLoadState("networkidle");
log("wrong password shows error", await page.locator("text=Wrong password.").isVisible(), page.url());

// 4. correct password logs in
await page.goto(`${base}/admin`);
await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD);
await page.click('button[type="submit"]');
await page.waitForLoadState("networkidle");
log("correct password reaches dashboard", page.url() === `${base}/admin/dashboard`, page.url());

// 5. add a project
await page.fill('input[name="title"]', "Test Project");
await page.fill('textarea[name="description"]', "A project added by the verify script.");
await page.fill('input[name="githubUrl"]', "https://github.com/example/test");
await page.fill('input[name="liveUrl"]', "https://example.com");
await page.click('button:has-text("Add project")');
await page.waitForLoadState("networkidle");

const dashboardOk = await page.locator("summary").filter({ hasText: "Test Project" }).first().isVisible().catch(() => false);
log("project appears in dashboard list", dashboardOk, page.url());

// 6. project appears on public page
await page.goto(`${base}/`);
log("project appears on public page", await page.locator("h2:has-text('Test Project')").isVisible());
log("github link present", await page.locator("a:has-text('GitHub')").isVisible());
log("live site link present", await page.locator("a:has-text('Live site')").isVisible());

// 7. edit the project
await page.goto(`${base}/admin/dashboard`);
const detailsBlock = page.locator("details").filter({ hasText: "Test Project" });
await detailsBlock.locator("summary").click();
await detailsBlock.locator('input[name="title"]').fill("Test Project Edited");
await detailsBlock.locator('button:has-text("Save changes")').click();
await page.waitForLoadState("networkidle");
log("edited title appears", await page.locator("summary:has-text('Test Project Edited')").isVisible());

// 8. delete the project
const editedBlock = page.locator("details").filter({ hasText: "Test Project Edited" });
await editedBlock.locator("summary").click();
await editedBlock.locator('button:has-text("Delete")').click();
const deletedOk = await page
  .locator("text=No projects yet.")
  .waitFor({ state: "visible", timeout: 10000 })
  .then(() => true)
  .catch(() => false);
log("project removed after delete", deletedOk);
if (!deletedOk) console.log("BODY TEXT:", await page.locator("main").innerText());

// 9. logout
await page.click('button:has-text("Log out")');
await page.waitForURL(`${base}/admin`, { timeout: 10000 }).catch(() => {});
log("logout returns to /admin", page.url() === `${base}/admin`, page.url());

await page.goto(`${base}/admin/dashboard`);
await page.waitForURL(`${base}/admin`, { timeout: 10000 }).catch(() => {});
log("dashboard inaccessible after logout", page.url() === `${base}/admin`, page.url());

await browser.close();
