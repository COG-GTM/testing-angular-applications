// Builds parity/report/: side-by-side PNGs (baseline left, upgraded right), pixel-diff % and README.md.
import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const root = path.dirname(new URL(import.meta.url).pathname);
const report = path.join(root, 'report');
const shots = path.join(report, 'shots');
const sbsDir = path.join(report, 'side-by-side');
fs.mkdirSync(sbsDir, { recursive: true });

// Ignore screenshots left over from an earlier run so a skipped/failed capture is reported as missing, not stale.
const resultsFile = path.join(report, 'results.json');
const runStart = fs.existsSync(resultsFile) ? Date.parse(JSON.parse(fs.readFileSync(resultsFile, 'utf8')).stats.startTime) : 0;
const read = (f) => (fs.existsSync(f) && fs.statSync(f).mtimeMs >= runStart ? PNG.sync.read(fs.readFileSync(f)) : null);
const pad = (img, w, h) => {
  const out = new PNG({ width: w, height: h });
  out.data.fill(255);
  if (img) PNG.bitblt(img, out, 0, 0, img.width, img.height, 0, 0);
  return out;
};

const names = new Set();
for (const p of ['baseline', 'upgraded']) {
  const d = path.join(shots, p);
  if (fs.existsSync(d)) fs.readdirSync(d).filter((f) => f.endsWith('.png')).forEach((f) => names.add(f));
}

const diffs = [];
for (const name of [...names].sort()) {
  const a = read(path.join(shots, 'baseline', name));
  const b = read(path.join(shots, 'upgraded', name));
  const w = Math.max(a?.width ?? 0, b?.width ?? 0);
  const h = Math.max(a?.height ?? 0, b?.height ?? 0);
  const pa = pad(a, w, h);
  const pb = pad(b, w, h);
  let pct = null;
  if (a && b) {
    const changed = pixelmatch(pa.data, pb.data, null, w, h, { threshold: 0.1 });
    pct = (100 * changed) / (w * h);
  }
  const gutter = 16;
  const sbs = new PNG({ width: w * 2 + gutter, height: h });
  sbs.data.fill(200);
  PNG.bitblt(pa, sbs, 0, 0, w, h, 0, 0);
  PNG.bitblt(pb, sbs, 0, 0, w, h, w + gutter, 0);
  fs.writeFileSync(path.join(sbsDir, name), PNG.sync.write(sbs));
  diffs.push({ shot: name.replace('.png', ''), baseline: !!a, upgraded: !!b, pixelDiffPct: pct });
}
fs.writeFileSync(path.join(report, 'pixel-diff.json'), JSON.stringify(diffs, null, 2));

// Test results per project from the Playwright JSON reporter.
const results = {};
const resFile = path.join(report, 'results.json');
if (fs.existsSync(resFile)) {
  const walk = (suite, prefix) => {
    const title = [prefix, suite.title].filter((t) => t && !t.endsWith('.ts')).join(' > ');
    for (const spec of suite.specs ?? []) {
      for (const t of spec.tests) {
        const key = `${title} > ${spec.title}`;
        results[key] ??= {};
        const last = t.results[t.results.length - 1];
        results[key][t.projectName] = t.status === 'expected' ? 'pass' : t.status === 'flaky' ? 'flaky' : t.status === 'skipped' ? 'skipped' : `fail (${last?.status})`;
      }
    }
    for (const s of suite.suites ?? []) walk(s, title);
  };
  for (const s of JSON.parse(fs.readFileSync(resFile, 'utf8')).suites) walk(s, '');
}

const count = (proj, v) => Object.values(results).filter((r) => r[proj] === v).length;
const total = (proj) => Object.values(results).filter((r) => r[proj]).length;
const lines = [
  '# Angular 21 parity report',
  '',
  'Same Playwright specs run against `baseline` (default branch, legacy Angular; website :4000, chapter06 :4001, chapter07 :4002)',
  'and `upgraded` (this branch, Angular 21; website :4200, chapter06 :4201, chapter07 :4202). Data is in-memory (angular-in-memory-web-api), no shared backend, so `retries` is 0.',
  '',
  `**baseline:** ${count('baseline', 'pass')}/${total('baseline')} passed. **upgraded:** ${count('upgraded', 'pass')}/${total('upgraded')} passed.`,
  '',
  '## Flows',
  '',
  '| App > flow | baseline | upgraded |',
  '| --- | --- | --- |',
  ...Object.entries(results).map(([k, r]) => `| ${k} | ${r.baseline ?? 'not run'} | ${r.upgraded ?? 'not run'} |`),
  '',
  '## Screenshots (full page, baseline left / upgraded right)',
  '',
  '| Screenshot | pixel diff | side by side |',
  '| --- | --- | --- |',
  ...diffs.map((d) => `| ${d.shot} | ${d.pixelDiffPct === null ? 'n/a' : d.pixelDiffPct.toFixed(2) + '%'} | ![${d.shot}](side-by-side/${d.shot}.png) |`),
  '',
];
fs.writeFileSync(path.join(report, 'README.md'), lines.join('\n'));
console.log(lines.slice(5, 6).join('\n'));
