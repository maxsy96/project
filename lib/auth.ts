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

function verifyAdminToken(token?: string) {
  if (!token) return null;
  const [username, timestamp, signature] = token.split(":");
  if (!username || !timestamp || !signature) return null;
  if (username !== adminUsername()) return null;
  const age = Date.now() - Number(timestamp);
  if (!Number.isFinite(age) || age > 1000 * 60 * 60 * 8) return null;

  const expectedSignature = sign(username, timestamp);
  if (signature.length !== expectedSignature.length) return null;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature)) ? username : null;
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
  return Boolean(verifyAdminToken(cookieStore.get(cookieName)?.value));
}

export async function currentAdminUsername() {
  const cookieStore = await cookies();
  return verifyAdminToken(cookieStore.get(cookieName)?.value);
}

export async function requireAdmin() {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }
}
