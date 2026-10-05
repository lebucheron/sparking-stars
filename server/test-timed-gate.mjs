import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {build} from 'esbuild';
import {createWorldMovement} from '@rarefriends/friendsdk/movement';
import {testGame} from '../games/sparking-stars/test-profile-helper.mjs';
import {walkTo,clickWorld} from './test-drive.mjs';
const d=JSON.parse(await readFile('games/sparking-stars/terrains.json','utf8')),gate=d[2].timedGate;
const compiled=await build({entryPoints:['games/sparking-stars/timed-gate.ts'],bundle:true,platform:'node',format:'esm',write:false});
const {gateOpen,gateAllows}=await import('data:text/javascript;base64,'+Buffer.from(compiled.outputFiles[0].text).toString('base64'));
assert(gateOpen(gate,0));assert(!gateOpen(gate,1800));assert(gateOpen(gate,3600));
assert.equal(gateAllows(gate,1800,[498,190],[498,235]),false,'Closed gate blocks complete segment');assert(gateAllows(gate,0,[498,190],[498,235]));assert(gateAllows(gate,1800,[445,190],[445,235]),'Can be circumvented');assert(gateAllows(gate,1800,[498,210],[498,230]),'Gate closing over Friend permits escape');
const terrainBundle=await build({entryPoints:['games/sparking-stars/terrains.ts'],bundle:true,platform:'node',format:'esm',write:false});
const {terrains}=await import('data:text/javascript;base64,'+Buffer.from(terrainBundle.outputFiles[0].text).toString('base64'));
for(const dt of [16.667,90]){let elapsed=1800,blocks=0;const m=createWorldMovement(terrains[2].world,[498,190],{canTraverse:(a,b)=>{const ok=gateAllows(gate,elapsed,a,b);if(!ok)blocks++;return ok;}});m.moveTo([498,235]);for(let frame=0;frame<500&&m.state.destination;frame++){let budget=Math.min(100,dt);while(budget>0){const slice=Math.min(40,budget);m.update(slice);budget-=slice;}elapsed+=dt;}assert(blocks>0);assert.equal(m.state.destination,null,'Waiting resumes automatically after opening');}
await testGame('games/sparking-stars',{publicHost:true,profile:{generation:6,tier:0},width:1000,height:850,check:async({page,game})=>{
 await game.locator('.race-start').click();await game.locator('.countdown').waitFor({state:'hidden'});const canvas=game.locator('canvas[data-x]');await page.screenshot({path:'../../outputs/gen3-preview-1000.png'});for(const p of d[2].route.slice(1,14))await walkTo(game,canvas,3,p);
 await walkTo(game,canvas,3,[498,190]);await game.locator('canvas[data-gate-open="false"]').waitFor();await clickWorld(canvas,[498,235]);await page.waitForTimeout(200);assert(Number(await canvas.getAttribute('data-y'))<=201.1,'Real browser movement is stopped by the closed gate');
 await page.screenshot({path:'../../outputs/gen3-gate-closed.png'});
 await canvas.evaluate(async c=>{const end=performance.now()+6000;while(performance.now()<end){if(+c.dataset.y>=230)return;await new Promise(r=>setTimeout(r,30));}throw Error('Gate did not reopen');});
 console.log('PASS gate: sweep collision, escape, left detour, low FPS, visible cycle and automatic resumed crossing in real browser.');
}});
