#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const cwd = process.cwd();
const frontendRoot = path.resolve(cwd, "frontend");

if (!fs.existsSync(frontendRoot)) {
  console.error(`Frontend directory not found: ${frontendRoot}`);
  process.exit(1);
}

const allowedExtensions = new Set([
  ".html",
  ".css",
  ".js",
  ".mjs",
  ".png",
  ".jpg",
  ".jpeg",
  ".svg",
  ".webp",
  ".ico",
  ".xml",
  ".txt",
  ".json",
  ".webmanifest",
]);

const ignoredDirNames = new Set(["node_modules", ".git", ".cache", "dist", "build"]);

function collectFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (ignoredDirNames.has(entry.name)) {
        continue;
      }
      files.push(...collectFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function isExternalRef(value) {
  return /^(https?:|mailto:|tel:|#|javascript:|data:|\/\/)/i.test(value);
}

function isSkippableRef(value) {
  return value.startsWith("?");
}

const allFiles = collectFiles(frontendRoot);
const jsFiles = allFiles.filter((file) => file.endsWith(".js"));
const htmlFiles = allFiles.filter((file) => file.endsWith(".html"));

const syntaxErrors = [];
for (const file of jsFiles) {
  const source = fs.readFileSync(file, "utf8");
  try {
    new vm.Script(source, { filename: file });
  } catch (error) {
    syntaxErrors.push({ file, error: String(error.message || error) });
  }
}

const linkErrors = [];
const bannedMarkupErrors = [];
const refPattern = /(?:src|href)\s*=\s*["']([^"']+)["']/gi;
const bannedHtmlPatterns = [
  { label: "Tailwind CDN script", regex: /cdn\.tailwindcss\.com/i },
  { label: "Inline tailwind.config", regex: /\btailwind\.config\s*=/i },
  { label: "Legacy image reference", regex: /assets\/images\/legacy\//i },
];

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");

  for (const banned of bannedHtmlPatterns) {
    if (banned.regex.test(html)) {
      bannedMarkupErrors.push({ file, label: banned.label });
    }
  }

  let match = refPattern.exec(html);
  while (match) {
    const ref = String(match[1] || "").trim();
    if (ref && !isExternalRef(ref) && !isSkippableRef(ref)) {
      const cleanRef = ref.split("?")[0].split("#")[0].trim();
      const ext = path.extname(cleanRef).toLowerCase();
      if (allowedExtensions.has(ext)) {
        const resolved = cleanRef.startsWith("/")
          ? path.join(frontendRoot, cleanRef.replace(/^\/+/, "").replace(/\//g, path.sep))
          : path.resolve(path.dirname(file), cleanRef.replace(/\//g, path.sep));
        if (!fs.existsSync(resolved)) {
          linkErrors.push({ file, ref, resolved });
        }
      }
    }
    match = refPattern.exec(html);
  }
}

if (syntaxErrors.length || linkErrors.length || bannedMarkupErrors.length) {
  console.error("Frontend quality check failed.");

  if (syntaxErrors.length) {
    console.error("");
    console.error("JavaScript syntax errors:");
    for (const item of syntaxErrors) {
      console.error(`- ${item.file}: ${item.error}`);
    }
  }

  if (linkErrors.length) {
    console.error("");
    console.error("Missing local references in HTML:");
    for (const item of linkErrors) {
      console.error(`- ${item.file}: "${item.ref}" -> ${item.resolved}`);
    }
  }

  if (bannedMarkupErrors.length) {
    console.error("");
    console.error("Disallowed HTML patterns found:");
    for (const item of bannedMarkupErrors) {
      console.error(`- ${item.file}: ${item.label}`);
    }
  }

  process.exit(1);
}

console.log(`Frontend quality check passed. JS files: ${jsFiles.length}, HTML files: ${htmlFiles.length}.`);
