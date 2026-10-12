// Turns the static export in out/ into one self-contained HTML file at preview/index.html,
// for sharing a preview without deploying. Fonts and CSS are inlined; Next's runtime is dropped
// (the page is static) and src/lib/enhance.ts is bundled in its place.
//
// Usage: npm run preview

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { build } from "esbuild";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "out");
const html = await readFile(path.join(outDir, "index.html"), "utf8");

const pick = (re, label) => {
  const match = html.match(re);
  if (!match) throw new Error(`Could not find ${label} in out/index.html. Run \`next build\` first.`);
  return match;
};

const title = pick(/<title>([\s\S]*?)<\/title>/, "<title>")[1];
const classOf = (tag) => (tag.match(/class="([^"]*)"/) ?? [, ""])[1].split(/\s+/).filter(Boolean);
const htmlClasses = classOf(pick(/<html[^>]*>/, "<html>")[0]);
const bodyClasses = classOf(pick(/<body[^>]*>/, "<body>")[0]);

// Inline every stylesheet, with its font files as data: URIs.
let css = "";
for (const [, href] of html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)) {
  const cssPath = path.join(outDir, href);
  const source = await readFile(cssPath, "utf8");
  const inlined = await replaceAsync(source, /url\((\.\.\/media\/[^)]+\.(woff2|otf))\)/g, async (_, rel, ext) => {
    const font = await readFile(path.resolve(path.dirname(cssPath), rel));
    return `url(data:font/${ext};base64,${font.toString("base64")})`;
  });
  css += inlined;
}

const body = pick(/<body[^>]*>([\s\S]*)<\/body>/, "<body>")[1]
  .replace(/<script\b[\s\S]*?<\/script>/g, "")
  .replace(/<link\b[^>]*>/g, "");

const { outputFiles } = await build({
  entryPoints: [path.join(root, "src/lib/enhance.ts")],
  bundle: true,
  format: "iife",
  globalName: "Lightcash",
  minify: true,
  target: "es2020",
  write: false,
});
const enhance = outputFiles[0].text;

// The artifact host wraps this file in its own <html>/<body>, so the root classes are applied by script.
const page = `<title>${title}</title>
<style>${css}</style>
<script>document.documentElement.classList.add(${htmlClasses.map((c) => JSON.stringify(c)).join(",")});${
  bodyClasses.length ? `document.body.classList.add(${bodyClasses.map((c) => JSON.stringify(c)).join(",")});` : ""
}</script>
${body}
<script>${enhance}Lightcash.enhance(document);</script>
`;

await mkdir(path.join(root, "preview"), { recursive: true });
await writeFile(path.join(root, "preview/index.html"), page);
console.log(`preview/index.html written (${(page.length / 1024).toFixed(0)} KB)`);

async function replaceAsync(input, re, fn) {
  const parts = [];
  let last = 0;
  for (const match of input.matchAll(re)) {
    parts.push(input.slice(last, match.index), await fn(...match));
    last = match.index + match[0].length;
  }
  parts.push(input.slice(last));
  return parts.join("");
}
