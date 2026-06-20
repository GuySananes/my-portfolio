"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { addProject, updateProject, deleteProject } from "@/lib/db";

export async function login(formData) {
  const password = formData.get("password");

  if (password !== process.env.ADMIN_PASSWORD) {
    redirect("/admin?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE.name, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_COOKIE.maxAge,
    path: "/",
  });

  redirect("/admin/dashboard");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE.name);
  redirect("/admin");
}

export async function createProjectAction(formData) {
  await addProject({
    title: formData.get("title"),
    description: formData.get("description"),
    githubUrl: formData.get("githubUrl"),
    liveUrl: formData.get("liveUrl"),
  });
  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  redirect("/admin/dashboard");
}

export async function updateProjectAction(formData) {
  const id = formData.get("id");
  await updateProject(id, {
    title: formData.get("title"),
    description: formData.get("description"),
    githubUrl: formData.get("githubUrl"),
    liveUrl: formData.get("liveUrl"),
  });
  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  redirect("/admin/dashboard");
}

export async function deleteProjectAction(formData) {
  const id = formData.get("id");
  await deleteProject(id);
  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  redirect("/admin/dashboard");
}
