import {readFile,writeFile,unlink} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {transform} from 'esbuild';
import assert from 'node:assert/strict';
const original=execFileSync('git',['-C','../gh-pages','show','b3d4e34f7b4d156a18a32ade6f1bcefaca8e6618:runtime.js'],{encoding:'utf8',maxBuffer:10_000_000});
const published=await readFile('../../outputs/site/runtime.js','utf8');
const bounds=s=>[s.indexOf('async function bV('),s.indexOf('function wV(',s.indexOf('async function bV('))];
const [a,b]=bounds(original),[c,d]=bounds(published);
const remove=s=>{const [x,y]=bounds(s);return s.slice(0,x)+s.slice(y);};
assert.equal(remove(published).replace('transferStartBlock:63102373n,',''),remove(original),'All other production runtime code must be identical');
const code=(await transform(published.slice(c,d),{minify:false})).code;
const module=`import {isAddress as yt,parseAbi,parseAbiItem,zeroAddress} from 'viem';
import {GENERATION_SPRITE_MANIFEST as ea} from '../dist/generation-sprites.js';
const j1e=parseAbiItem('event Transfer(address indexed from,address indexed to,uint256 indexed tokenId)');
const lE=parseAbi(['function balanceOf(address account) view returns (uint256)','function ownerOf(uint256 tokenId) view returns (address)','function generation(uint256 tokenId) view returns (uint8)','function tokenBoundAccount(uint256 tokenId) view returns (address)']);
const Xf=(a,b)=>a.toLowerCase()===b.toLowerCase(),fE=a=>typeof a==='string'&&yt(a)&&!Xf(a,zeroAddress),F1e=a=>typeof a==='bigint'&&a>0n&&a<1n<<256n,q1e=100000,yV=10000;
${code}
export {bV as readOwnedFriends};`;
const files=['scripts/.public-owned.mjs','tests/.public-owned.test.mjs'];
try {
 await writeFile(files[0],module);
 await writeFile(files[1],(await readFile('tests/owned-friends.test.mjs','utf8')).replace('../dist/owned-friends.js','../scripts/.public-owned.mjs'));
 execFileSync(process.execPath,['--test',files[1]],{stdio:'inherit'});
} finally {for(const file of files)await unlink(file).catch(()=>{});}
