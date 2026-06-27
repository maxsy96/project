import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function findSeedDatabase() {
  const candidates = [
    path.join(process.cwd(), "prisma", "dev.db"),
    path.join(__dirname, "..", "prisma", "dev.db"),
    path.join(__dirname, "prisma", "dev.db"),
  ];

  return candidates.find((candidate) => fs.existsSync(candidate));
}

function getRuntimeDatabaseUrl() {
  const isNetlifyRuntime = Boolean(
    process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME,
  );

  if (!isNetlifyRuntime) {
    return undefined;
  }

  const source = findSeedDatabase();
  if (!source) {
    return undefined;
  }

  const target = path.join(os.tmpdir(), "cavm-dev.db");
  if (!fs.existsSync(target)) {
    fs.copyFileSync(source, target);
  }

  return `file:${target.replace(/\\/g, "/")}`;
}

const runtimeDatabaseUrl = getRuntimeDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(
    runtimeDatabaseUrl
      ? { datasources: { db: { url: runtimeDatabaseUrl } } }
      : undefined,
  );

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
