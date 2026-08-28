const fs = require("fs");
const path = require("path");
const config = require("../config.json");
const { log } = require("./logger");

const extMap = new Map();
for (const [folder, exts] of Object.entries(config.sortRules)) {
  for (const ext of exts) extMap.set(ext.toLowerCase(), folder);
}

function sortDownloads() {
  const dir = config.downloads;
  if (!fs.existsSync(dir)) return log(`Sort: folder not found: ${dir}`);

  const files = fs.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isFile());
  const moved = [];

  for (const file of files) {
    const ext = path.extname(file.name).toLowerCase();
    const target = extMap.get(ext);
    if (!target) continue;

    const destDir = path.join(dir, target);
    fs.mkdirSync(destDir, { recursive: true });

    const src = path.join(dir, file.name);
    let dest = path.join(destDir, file.name);

    if (fs.existsSync(dest)) {
      const base = path.basename(file.name, ext);
      dest = path.join(destDir, `${base}_${Date.now()}${ext}`);
    }

    fs.renameSync(src, dest);
    moved.push(`  ${file.name} -> ${target}/`);
  }

  return moved;
}

module.exports = { sortDownloads };
