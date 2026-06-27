import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";

const cookieName = "cavm_admin_session";

function authSecret() {
  return process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD || "cavm-local-dev-secret";
}

function sign(email: string, timestamp: string) {
  return crypto.createHmac("sha256", authSecret()).update(`${email}:${timestamp}`).digest("hex");
}

export async function createAdminSession(email: string) {
  const timestamp = Date.now().toString();
  const token = `${email}:${timestamp}:${sign(email, timestamp)}`;
  const cookieStore = await cookies();
  cookieStore.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

export async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;
  if (!token) return false;
  const [email, timestamp, signature] = token.split(":");
  if (!email || !timestamp || !signature) return false;
  if (email !== process.env.ADMIN_EMAIL) return false;
  const age = Date.now() - Number(timestamp);
  if (!Number.isFinite(age) || age > 1000 * 60 * 60 * 8) return false;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(sign(email, timestamp)));
}

export async function requireAdmin() {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }
}
