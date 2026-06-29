import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";

const cookieName = "cavm_admin_session";

export function adminUsername() {
  const configuredUsername = process.env.ADMIN_USERNAME || process.env.ADMIN_EMAIL;
  if (configuredUsername) return configuredUsername;
  return process.env.NODE_ENV === "production" ? "" : "CAVM_ADMIN";
}

export function adminPassword() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  return process.env.NODE_ENV === "production" ? "" : "CAVM_ADMIN";
}

function authSecret() {
  return process.env.AUTH_SECRET || adminPassword() || "cavm-local-dev-secret";
}

function sign(username: string, timestamp: string) {
  return crypto.createHmac("sha256", authSecret()).update(`${username}:${timestamp}`).digest("hex");
}

export async function createAdminSession(username: string) {
  const timestamp = Date.now().toString();
  const token = `${username}:${timestamp}:${sign(username, timestamp)}`;
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
  const [username, timestamp, signature] = token.split(":");
  if (!username || !timestamp || !signature) return false;
  if (username !== adminUsername()) return false;
  const age = Date.now() - Number(timestamp);
  if (!Number.isFinite(age) || age > 1000 * 60 * 60 * 8) return false;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(sign(username, timestamp)));
}

export async function requireAdmin() {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }
}
