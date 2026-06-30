const fs = require("node:fs/promises");
const { spawnSync } = require("node:child_process");
const { createRequire } = require("node:module");
const path = require("node:path");

const requireFromProject = createRequire(path.join(process.cwd(), "package.json"));
const requireFromNext = createRequire(path.join(process.cwd(), "node_modules", "next", "package.json"));

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function removeMatching(root, shouldRemove) {
  if (!(await exists(root))) {
    return;
  }

  const entries = await fs.readdir(root, { withFileTypes: true });
  await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(root, entry.name);
      if (shouldRemove(entry.name, fullPath, entry)) {
        await fs.rm(fullPath, { recursive: true, force: true });
        return;
      }
      if (entry.isDirectory()) {
        await removeMatching(fullPath, shouldRemove);
      }
    }),
  );
}

async function folderSize(root) {
  if (!(await exists(root))) {
    return 0;
  }

  let total = 0;
  const entries = await fs.readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      total += await folderSize(fullPath);
    } else {
      const stat = await fs.stat(fullPath);
      total += stat.size;
    }
  }
  return total;
}

function psSingleQuote(value) {
  return `'${value.replace(/'/g, "''")}'`;
}

function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: "inherit", ...options });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`${command} exited with status ${result.status}`);
  }
}

async function repackFunctionZip(functionRoot) {
  const zipDir = path.join(process.cwd(), ".netlify", "functions");
  const zipPath = path.join(zipDir, "___netlify-server-handler.zip");
  await fs.mkdir(zipDir, { recursive: true });
  await fs.rm(zipPath, { force: true });

  if (process.platform === "win32") {
    const script = [
      "$ErrorActionPreference = 'Stop'",
      "Add-Type -AssemblyName System.IO.Compression.FileSystem",
      `[System.IO.Compression.ZipFile]::CreateFromDirectory(${psSingleQuote(functionRoot)}, ${psSingleQuote(
        zipPath,
      )}, [System.IO.Compression.CompressionLevel]::Optimal, $false)`,
    ].join("; ");
    runCommand("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", script]);
  } else {
    const script = [
      "import os, sys, zipfile",
      "root, target = sys.argv[1], sys.argv[2]",
      "with zipfile.ZipFile(target, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as archive:",
      "    for dirpath, dirnames, filenames in os.walk(root):",
      "        dirnames[:] = [d for d in dirnames if d != '__pycache__']",
      "        for filename in filenames:",
      "            full = os.path.join(dirpath, filename)",
      "            archive.write(full, os.path.relpath(full, root))",
    ].join("\n");
    try {
      runCommand("python3", ["-c", script, functionRoot, zipPath]);
    } catch (error) {
      runCommand("python", ["-c", script, functionRoot, zipPath]);
    }
  }

  const zipStat = await fs.stat(zipPath);
  console.log(`Repacked Netlify server function zip to about ${Math.round(zipStat.size / 1024 / 1024)} MB.`);
}

async function materializeSymlinks(root, nodeModules) {
  if (!(await exists(root))) {
    return 0;
  }

  let changed = 0;
  const entries = await fs.readdir(root, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);

    if (entry.isSymbolicLink()) {
      const rawTarget = await fs.readlink(fullPath);
      let target = path.resolve(path.dirname(fullPath), rawTarget);
      const marker = `${path.sep}node_modules${path.sep}`;
      const markerIndex = target.lastIndexOf(marker);

      if (markerIndex !== -1) {
        const localTarget = path.join(nodeModules, target.slice(markerIndex + marker.length));
        if (await exists(localTarget)) {
          target = localTarget;
        }
      }

      if (!(await exists(target))) {
        console.warn(`Skipped unresolved function symlink: ${fullPath}`);
        continue;
      }

      const stat = await fs.stat(target);
      await fs.rm(fullPath, { recursive: true, force: true });

      if (stat.isDirectory()) {
        await fs.cp(target, fullPath, { recursive: true, force: true, dereference: true });
        changed += 1 + await materializeSymlinks(fullPath, nodeModules);
      } else {
        await fs.copyFile(target, fullPath);
        changed += 1;
      }
      continue;
    }

    if (entry.isDirectory()) {
      changed += await materializeSymlinks(fullPath, nodeModules);
    }
  }

  return changed;
}

async function copyTopLevelPackage(nodeModules, packageName) {
  const parts = packageName.split("/");
  let source = path.join(process.cwd(), "node_modules", ...parts);
  const destination = path.join(nodeModules, ...parts);

  if (!(await exists(source))) {
    try {
      source = path.dirname(requireFromProject.resolve(`${packageName}/package.json`));
    } catch {
      try {
        source = path.dirname(requireFromNext.resolve(`${packageName}/package.json`));
      } catch {
        const encodedName = packageName.replace("/", "+");
        const pnpmStore = path.join(process.cwd(), "node_modules", ".pnpm");
        const entries = await fs.readdir(pnpmStore, { withFileTypes: true });
        const packageEntry = entries.find((entry) => entry.name.startsWith(`${encodedName}@`));
        if (!packageEntry) {
          return false;
        }
        source = path.join(pnpmStore, packageEntry.name, "node_modules", ...parts);
      }
    }
  }

  await fs.rm(destination, { recursive: true, force: true });
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.cp(source, destination, { recursive: true, force: true, dereference: true });
  await materializeSymlinks(destination, nodeModules);
  return true;
}

async function copyGeneratedPrismaClient(nodeModules) {
  const pnpmStore = path.join(nodeModules, ".pnpm");
  if (!(await exists(pnpmStore))) {
    return false;
  }

  const entries = await fs.readdir(pnpmStore, { withFileTypes: true });
  const prismaPackage = entries.find((entry) => entry.name.startsWith("@prisma+client@"));
  if (!prismaPackage) {
    return false;
  }

  const source = path.join(pnpmStore, prismaPackage.name, "node_modules", ".prisma", "client");
  if (!(await exists(source))) {
    return false;
  }

  const destination = path.join(nodeModules, ".prisma", "client");
  await fs.rm(destination, { recursive: true, force: true });
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.cp(source, destination, { recursive: true, force: true, dereference: true });
  return true;
}

function shouldRemoveRuntimeFile(name, fullPath) {
  const normalized = fullPath.replace(/\\/g, "/");

  if (name.includes(".tmp")) return true;
  if (name === "query_engine-windows.dll.node") return true;
  if (name.endsWith(".map")) return true;

  const isPrismaRuntime = normalized.includes("/@prisma/client/runtime/");
  if (!isPrismaRuntime) return false;

  return (
    name.includes("wasm") ||
    name.includes("query_compiler") ||
    name.includes("query_engine_bg") ||
    name.startsWith("edge") ||
    name.startsWith("react-native")
  );
}

async function trimFunctionPackage() {
  const functionRoot = path.join(
    process.cwd(),
    ".netlify",
    "functions-internal",
    "___netlify-server-handler",
  );
  const nodeModules = path.join(functionRoot, "node_modules");
  const pnpmStore = path.join(nodeModules, ".pnpm");

  await removeMatching(pnpmStore, (name, fullPath, entry) => {
    const isSharpLib = name.startsWith("@img+sharp-libvips-");
    const isSharpBinary = name.startsWith("@img+sharp-");
    if (isSharpLib || isSharpBinary) {
      return !name.includes("linux-x64");
    }

    return false;
  });

  await removeMatching(functionRoot, (name, fullPath, entry) => {
    if (entry.isDirectory()) return false;

    const normalized = fullPath.replace(/\\/g, "/");
    const isPrismaClient = normalized.includes("/@prisma/client/");
    const isGeneratedPrismaClient = normalized.includes("/node_modules/.prisma/client/");

    if (shouldRemoveRuntimeFile(name, fullPath)) return true;
    if (isPrismaClient && name.endsWith(".d.ts")) return true;

    if (isGeneratedPrismaClient) {
      return (
        name === "query_engine_bg.js" ||
        name === "query_engine_bg.wasm" ||
        name === "wasm-edge-light-loader.mjs" ||
        name === "wasm-worker-loader.mjs" ||
        name === "edge.js" ||
        name === "index-browser.js"
      );
    }

    return false;
  });

  await copyGeneratedPrismaClient(nodeModules);
  for (const packageName of [
    "next",
    "@next/env",
    "@swc/helpers",
    "baseline-browser-mapping",
    "caniuse-lite",
    "postcss",
    "react",
    "react-dom",
    "styled-jsx",
    "@netlify/blobs",
    "@netlify/dev-utils",
    "@netlify/otel",
    "@netlify/runtime-utils",
    "@prisma/client",
  ]) {
    await copyTopLevelPackage(nodeModules, packageName);
  }

  await removeMatching(functionRoot, (name, fullPath, entry) => {
    if (entry.isDirectory()) return false;
    return shouldRemoveRuntimeFile(name, fullPath) || name.endsWith(".d.ts");
  });

  await removeMatching(pnpmStore, (name) => {
    const isSharpLib = name.startsWith("@img+sharp-libvips-");
    const isSharpBinary = name.startsWith("@img+sharp-");
    return (isSharpLib || isSharpBinary) && !name.includes("linux-x64");
  });

  const materializedCount = await materializeSymlinks(functionRoot, nodeModules);
  await fs.rm(pnpmStore, { recursive: true, force: true });
  const sizeMb = Math.round((await folderSize(functionRoot)) / 1024 / 1024);
  console.log(`Trimmed Netlify server function to about ${sizeMb} MB before upload.`);
  console.log(`Materialized ${materializedCount} function package symlinks.`);
  await repackFunctionZip(functionRoot);
}

module.exports = {
  async onPostBuild() {
    const deployBlobDirs = [
      path.join(process.cwd(), ".netlify", "deploy", "v1", "blobs", "deploy"),
      path.join(process.cwd(), ".netlify", "blobs", "deploy"),
    ];

    for (const dir of deployBlobDirs) {
      await fs.rm(dir, { recursive: true, force: true });
    }

    console.log("Skipped generated deploy blobs upload for this local CLI deploy.");
    await trimFunctionPackage();
  },
};
