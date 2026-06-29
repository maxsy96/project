const fs = require("node:fs");
const path = require("node:path");

function main() {
  const packageJson = require.resolve("@netlify/plugin-nextjs/package.json", {
    paths: [process.cwd()],
  });
  const pluginRoot = path.dirname(packageJson);
  const serverFile = path.join(pluginRoot, "dist", "build", "content", "server.js");
  let source = fs.readFileSync(serverFile, "utf8");

  const normalized = source.replace(
    /(\s*)dereference: true,\r?\n\1verbatimSymlinks: false,/g,
    "$1verbatimSymlinks: true,",
  );
  const patched = normalized.replace(
    /(\s*)verbatimSymlinks: true,/g,
    "$1dereference: true,\n$1verbatimSymlinks: false,",
  );

  if (patched === normalized) {
    throw new Error(`Could not find Netlify Next plugin symlink copy blocks in ${serverFile}`);
  }

  fs.writeFileSync(serverFile, patched);
  console.log("Patched Netlify Next plugin to copy real files instead of Windows symlinks.");
}

main();
