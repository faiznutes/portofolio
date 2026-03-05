#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const imagesRoot = path.resolve(cwd, "frontend", "assets", "images");
const maxBytes = 1_000_000; // 1 MB hard budget for non-legacy assets
const imageExt = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".avif"]);

if (!fs.existsSync(imagesRoot)) {
  console.error(`Image root not found: ${imagesRoot}`);
  process.exit(1);
}

function collectFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const normalized = fullPath.replace(/\\/g, "/").toLowerCase();
      if (normalized.includes("/legacy/")) {
        continue;
      }
      files.push(...collectFiles(fullPath));
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (imageExt.has(ext)) {
      files.push(fullPath);
    }
  }

  return files;
}

const oversized = [];
const files = collectFiles(imagesRoot);

for (const file of files) {
  const stat = fs.statSync(file);
  if (stat.size > maxBytes) {
    oversized.push({ file, size: stat.size });
  }
}

if (oversized.length > 0) {
  console.error("Image budget check failed. Non-legacy image exceeds 1 MB:");
  for (const item of oversized) {
    const rel = path.relative(cwd, item.file).replace(/\\/g, "/");
    console.error(`- ${rel}: ${item.size} bytes`);
  }
  process.exit(1);
}

console.log(`Image budget check passed. Checked ${files.length} files.`);
