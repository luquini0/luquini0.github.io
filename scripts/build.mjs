#!/usr/bin/env node
// Assembles src/ into the single self-contained index.html that GitHub
// Pages actually serves from the repo root.
//
// Why: the deployed site needs to stay one dependency-free HTML file (no
// extra requests for CSS/JS/images), but the source is much easier to
// read, review and diff as separate files. This script is the bridge —
// run it after editing anything under src/, then commit both.
//
//   node scripts/build.mjs
//
// CI (.github/workflows/ci.yml) reruns this and fails the build if the
// committed index.html has drifted from src/, so the two can't go out
// of sync silently.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { minify as minifyJs } from 'terser';
import CleanCSS from 'clean-css';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SRC = path.join(ROOT, 'src');

const JS_MODULES = ['i18n.js', 'ui.js', 'terminal.js', 'icons.js', 'lifecycle.js', 'footer.js', 'gate.js', 'supabase.js'];

function read(relPath) {
  return fs.readFileSync(path.join(SRC, relPath), 'utf8');
}

function toDataUri(assetRelPath) {
  const buf = fs.readFileSync(path.join(SRC, 'assets', assetRelPath));
  return `data:image/webp;base64,${buf.toString('base64')}`;
}

async function build() {
  let html = read('index.html');

  // 1. Inline the stylesheet, minified (dev source in src/css/styles.css
  //    stays fully readable/formatted — only the shipped copy is dense).
  const rawCss = read('css/styles.css');
  const { styles: css, errors: cssErrors } = new CleanCSS({ level: 2 }).minify(rawCss);
  if (cssErrors && cssErrors.length) throw new Error('CSS minify failed: ' + cssErrors.join('; '));
  html = html.replace(
    '<link rel="stylesheet" href="css/styles.css">',
    `<style>${css}</style>`,
  );

  // 2. Concatenate the JS modules into the one wrapping IIFE the site
  //    has always shipped as (module order matters — it's the same
  //    top-to-bottom order the code was originally written in, since
  //    later modules read module-scoped `var`/function declarations
  //    hoisted from earlier ones), then minify the whole thing with
  //    Terser. Source files under src/js/ are untouched — this only
  //    compresses the copy that gets embedded in index.html.
  const scriptTags = JS_MODULES.map((name) => `<script src="js/${name}"></script>`).join('\n');
  const body = JS_MODULES.map((name) => read(`js/${name}`).replace(/\n$/, '')).join('\n');
  const rawScript = `(function(){\n"use strict";\n${body}\n})();`;
  const { code: minifiedScript, error: jsError } = await minifyJs(rawScript, { mangle: true, compress: true });
  if (jsError) throw jsError;
  const inlineScript = `<script>${minifiedScript}</script>`;
  html = html.replace(scriptTags, inlineScript);

  // 3. Inline the two images (logo appears 3x: favicon reference is added
  //    separately below, plus nav brand + footer brand; avatar once).
  const logoUri = toDataUri('logo.webp');
  const avatarUri = toDataUri('avatar.webp');
  html = html.split('assets/logo.webp').join(logoUri);
  html = html.split('assets/avatar.webp').join(avatarUri);

  fs.writeFileSync(path.join(ROOT, 'index.html'), html);
  console.log(`Built index.html (${(html.length / 1024).toFixed(1)} KB)`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
