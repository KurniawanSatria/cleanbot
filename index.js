const { log, report } = require("./src/logger");
const { sortDownloads } = require("./src/sorter");
const { cleanTemp, deleteOldFiles } = require("./src/cleaner");

log("=== Scheduler started ===");

const sortResult = sortDownloads();
const tempResult = cleanTemp();
const oldResult = deleteOldFiles();

const lines = [];
if (sortResult?.length) lines.push(`Sorted ${sortResult.length} files:`, ...sortResult);
if (tempResult?.length) lines.push(`Cleaned ${tempResult.length} temp items:`, ...tempResult);
if (oldResult?.length) lines.push(`Deleted ${oldResult.length} old files:`, ...oldResult);

if (lines.length) {
  report(lines);
} else {
  log("Nothing to do.");
}

log("=== Scheduler finished ===");
