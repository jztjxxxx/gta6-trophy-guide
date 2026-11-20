// GTA 6 Trophy Guide & Tracker — build entry point (Node 22, standard library only).
//
// This program hands the guide in: it copies the app/ folder and the screenshots/
// folder from beside this file into the output directory, then writes
// dossier.json there with the vendored make.fun library. The dossier is the
// summary the judge reads: the screenshots, the first load's files and bytes,
// and the source of the entry.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output.
// The app itself needs no build step: serve it with `node serve.ts` and open
// http://localhost:8080.

import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Fail fast with a readable message when the entry is incomplete, instead of
// letting buildDossier throw halfway through the copy.
if (!existsSync(join(here, 'app', 'index.html'))) {
  throw new Error('main.ts: app/index.html is missing — the guide has not been built yet');
}
const shotDir = join(here, 'screenshots');
const shots = existsSync(shotDir)
  ? readdirSync(shotDir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
  : [];
if (shots.length === 0) {
  throw new Error('main.ts: screenshots/ holds no image — take the 4 screenshots before building');
}
if (shots.length > 4) {
  throw new Error(`main.ts: ${shots.length} screenshots, but the scorer allows at most 4`);
}

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the
// bytes; the others refuse an entry the scorer would refuse — more than 4
// screenshots or one over 256 KiB; more than 993 files and directories in app/
// or 48 MiB of app files (app/ counts beside /output's own 1000-entry cap, its
// screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);

console.log(`dossier written to ${join(out, 'dossier.json')} (${shots.length} screenshots, ${shots.join(', ')})`);
