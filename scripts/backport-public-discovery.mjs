// Preserve gh-pages customizations absent from main; replace only SDK discovery.
import { execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { transform } from 'esbuild';

const original = execFileSync('git', ['-C', '../gh-pages', 'show', 'b3d4e34f7b4d156a18a32ade6f1bcefaca8e6618:runtime.js'], {encoding:'utf8', maxBuffer:10_000_000});
const rebuilt = (await transform(await readFile('../../outputs/site/runtime.js','utf8'), {minify:false})).code;
const start = rebuilt.indexOf('  async function _9(');
const end = rebuilt.indexOf('  function U9(', start);
assert(start > 0 && end > start, 'Review bundle symbols before reusing this release-specific script');
let discovery = rebuilt.slice(start,end);
const symbols = {_9:'bV',sr:'ea',Hh:'fE',Ih:'lE',I9:'yV',H9:'(10000000n)',YR:'j1e',XR:'q1e',mi:'Xf',te:'yt',ZR:'F1e'};
discovery = discovery.replace(/\b(?:_9|sr|Hh|Ih|I9|H9|YR|XR|mi|te|ZR)\b/g, name => symbols[name]);
discovery = (await transform(discovery,{minifyWhitespace:true,minifySyntax:true,minifyIdentifiers:false})).code.trim();
const oldStart = original.indexOf('async function bV(');
const oldEnd = original.indexOf('function wV(',oldStart);
assert(oldStart > 0 && oldEnd > oldStart);
let result = original.slice(0,oldStart) + discovery + original.slice(oldEnd);
const manifest = 'generations:"0x14C49e6118F46525dE9ab41a51cBAA3c6EBF181D",metadata:';
assert.equal(result.split(manifest).length,2);
result = result.replace(manifest,manifest.replace(',metadata:',',transferStartBlock:63102373n,metadata:'));
await writeFile('../gh-pages/runtime.js',result);
await writeFile('../../outputs/site/runtime.js',result);
console.log('Official discovery transplanted; all other runtime code preserved.');
