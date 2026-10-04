import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {readFile} from 'node:fs/promises';
import {createWorldMovement} from '@rarefriends/friendsdk/movement';
import {testGame} from '../games/sparking-stars/test-profile-helper.mjs';
import {walkTo} from './test-drive.mjs';
const definitions=JSON.parse(await readFile('games/sparking-stars/terrains.json','utf8')),bush=definitions[5].movingBush;
const compiled=await build({entryPoints:['games/sparking-stars/moving-bush.ts'],bundle:true,platform:'node',format:'esm',write:false});
const {bushPosition,bushAllows}=await import('data:text/javascript;base64,'+Buffer.from(compiled.outputFiles[0].text).toString('base64'));
const track=definitions[5],from=track.route[8],to=track.route[9],center=bush.center;
assert(Math.abs(Math.hypot(...bushPosition(bush,0).map((v,i)=>v-center[i]))-30)<.001);assert.deepEqual(bushPosition(bush,3200),bushPosition(bush,0));
assert.equal(bushAllows(bush,800,from,to),false,'Swept collision prevents tunneling through the bush');
assert.equal(bushAllows(bush,0,from,to),true,'Center lane opens at the side');
assert.equal(bushAllows(bush,800,[center[0],center[1]+1],[center[0],center[1]+20]),true,'A Friend overlapped by moving foliage can escape');
assert.equal(bushAllows(bush,800,[center[0],center[1]+1],center),false,'Cannot walk deeper into an overlap');
assert.equal(bushAllows(undefined,800,from,to),true,'Other GEN unaffected');
const terrainBundle=await build({entryPoints:['games/sparking-stars/terrains.ts'],bundle:true,platform:'node',format:'esm',write:false});
const {terrains}=await import('data:text/javascript;base64,'+Buffer.from(terrainBundle.outputFiles[0].text).toString('base64'));
for(const dt of [16.667,90]){
 let elapsed=800,blockedSteps=0;const world=terrains[5].world,m=createWorldMovement(world,[455,112],{canTraverse:(a,b)=>{const allowed=bushAllows(bush,elapsed,a,b);if(!allowed)blockedSteps++;return allowed;}});m.moveTo(to);
 for(let i=0;i<500&&m.state.destination;i++){let budget=Math.min(100,dt);while(budget>0){const slice=Math.min(40,budget),a=m.state.position,b=m.update(slice).position;assert(bushAllows(bush,elapsed,a,b)||a.every((v,i)=>v===b[i]),'Every step respects the bush');budget-=slice;}elapsed+=dt;}
 assert(blockedSteps>0,'The moving shrub actually blocks the attempted crossing');assert.equal(m.state.destination,null,'Waiting at the shrub eventually completes the crossing');
}
await testGame('games/sparking-stars',{publicHost:true,profile:{generation:6,tier:0},width:1000,height:850,check:async({page,game})=>{
 await game.getByRole('button',{name:'Courir',exact:true}).click();await game.getByRole('button',{name:'Les 6 terrains',exact:true}).click();await game.getByRole('button',{name:/GEN 6 · Découverte/}).click();
 await game.locator('.race-start').click();await game.locator('.countdown').waitFor({state:'hidden'});const canvas=game.locator('canvas[data-x]');
 const first=Number(await canvas.getAttribute('data-bush-y'));await page.waitForTimeout(500);assert(Math.abs(Number(await canvas.getAttribute('data-bush-y'))-first)>3,'The shrub visibly moves during the race');
 for(const p of track.route.slice(1,9))await walkTo(game,canvas,6,p);await page.screenshot({path:'../../outputs/gen6-moving-bush.png'});await walkTo(game,canvas,6,to);assert.match(await game.getByTestId('stars').innerText(),/9\/11/,'Passing the shrub still collects the next star');
 console.log('PASS moving bush: lateral cycle, swept collision, escape, low FPS, eventual crossing and real browser rendering.');
}});
