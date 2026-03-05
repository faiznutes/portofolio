#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const frontendRoot = path.resolve(cwd, "frontend");
const sitemapPath = path.join(frontendRoot, "sitemap.xml");
const checkOnly = process.argv.includes("--check");
const siteBase = (process.env.SITE_BASE_URL || "https://faiznute.site").replace(/\/+$/, "");

if (!fs.existsSync(frontendRoot)) {
  console.error(`Frontend directory not found: ${frontendRoot}`);
  process.exit(1);
}

const excludedFiles = new Set(["404.html", "test-all-pages.html", "work-detail.html"]);
const excludedPrefixes = ["admin/"];
const ignoredDirNames = new Set(["node_modules", ".git", ".cache", "dist", "build"]);

function walkHtml(dir, baseDir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const output = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (ignoredDirNames.has(entry.name)) {
        continue;
      }
      output.push(...walkHtml(full, baseDir));
      continue;
    }

    if (!entry.name.endsWith(".html")) {
      continue;
    }

    const rel = path.relative(baseDir, full).replace(/\\/g, "/");
    if (excludedFiles.has(rel)) {
      continue;
    }
    if (excludedPrefixes.some((prefix) => rel.startsWith(prefix))) {
      continue;
    }
    output.push(rel);
  }

  return output;
}

function routeFromHtml(relPath) {
  const normalized = relPath.replace(/\\/g, "/");
  if (normalized === "index.html") {
    return "/";
  }
  return `/${normalized.replace(/\.html$/i, "")}`;
}

function frequencyForRoute(route) {
  if (route === "/" || route === "/works" || route === "/services" || route === "/insights") {
    return "weekly";
  }
  return "monthly";
}

function priorityForRoute(route) {
  if (route === "/") return "1.0";
  if (route === "/works" || route === "/services") return "0.9";
  if (route === "/insights" || route === "/contact" || route === "/cv") return "0.8";
  if (route.startsWith("/landing-pages/")) return "0.6";
  return "0.7";
}

function toDateOnly(value) {
  return value.toISOString().slice(0, 10);
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const htmlFiles = walkHtml(frontendRoot, frontendRoot);
const rows = htmlFiles.map((rel) => {
  const full = path.join(frontendRoot, rel);
  const stat = fs.statSync(full);
  const route = routeFromHtml(rel);
  return {
    route,
    loc: `${siteBase}${route}`,
    lastmod: toDateOnly(stat.mtime),
    changefreq: frequencyForRoute(route),
    priority: priorityForRoute(route),
  };
});

const feedPath = path.join(frontendRoot, "insights-feed.xml");
if (fs.existsSync(feedPath)) {
  const stat = fs.statSync(feedPath);
  rows.push({
    route: "/insights-feed.xml",
    loc: `${siteBase}/insights-feed.xml`,
    lastmod: toDateOnly(stat.mtime),
    changefreq: "daily",
    priority: "0.4",
  });
}

rows.sort((a, b) => a.route.localeCompare(b.route));

const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  rows
    .map(
      (item) =>
        "  <url>\n" +
        `    <loc>${escapeXml(item.loc)}</loc>\n` +
        `    <lastmod>${item.lastmod}</lastmod>\n` +
        `    <changefreq>${item.changefreq}</changefreq>\n` +
        `    <priority>${item.priority}</priority>\n` +
        "  </url>"
    )
    .join("\n") +
  "\n</urlset>\n";

if (checkOnly) {
  const current = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, "utf8") : "";
  if (current !== xml) {
    console.error("Sitemap is outdated. Run: node scripts/generate-sitemap.mjs");
    process.exit(1);
  }
  console.log("Sitemap check passed.");
  process.exit(0);
}

fs.writeFileSync(sitemapPath, xml, "utf8");
console.log(`Sitemap generated: ${path.relative(cwd, sitemapPath).replace(/\\/g, "/")}`);
