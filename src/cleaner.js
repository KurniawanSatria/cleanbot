const fs = require("fs");
const path = require("path");
const os = require("os");
const config = require("../config.json");
const { log } = require("./logger");

function cleanTemp() {
  const dirs = config.tempDirs?.length ? config.tempDirs : [os.tmpdir()];
  const deleted = [];
  let errors = 0;

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) { log(`Clean: folder not found: ${dir}`); continue; }
    for (const entry of fs.readdirSync(dir)) {
      try {
        fs.rmSync(path.join(dir, entry), { recursive: true, force: true });
        deleted.push(`  [${path.basename(dir)}] ${entry}`);
      } catch {
        errors++;
      }
    }
  }

  if (errors) log(`Clean temp: ${errors} items skipped (in use)`);
  return deleted;
}

function deleteOldFiles() {
  const dir = config.downloads;
  if (!fs.existsSync(dir)) return log(`Delete old: folder not found: ${dir}`);

  const cutoff = Date.now() - config.maxAgeDays * 86400000;
  const deleted = [];

  function walk(d) {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      try {
        const stat = fs.statSync(full);
        if (stat.mtimeMs < cutoff) {
          fs.unlinkSync(full);
          deleted.push(`  ${path.relative(config.downloads, full)}`);
        }
      } catch {
        // ponytail: skip locked files, add retry queue when needed
      }
    }
  }

  walk(dir);
  return deleted;
}

module.exports = { cleanTemp, deleteOldFiles };
