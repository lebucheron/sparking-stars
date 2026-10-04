import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {build} from 'esbuild';
import {isWorldWalkable} from '@rarefriends/friendsdk/world';
import {createWorldNavigator} from '@rarefriends/friendsdk/navigation';
import {testGame} from '../games/sparking-stars/test-profile-helper.mjs';
import {walkTo} from './test-drive.mjs';
const definitions=JSON.parse(await readFile('games/sparking-stars/terrains.json','utf8'));
const baseline=JSON.parse(execFileSync('git',['-c',`safe.directory=${process.cwd().replaceAll('\\','/')}`,'show','2bc31be:games/sparking-stars/terrains.json'],{encoding:'utf8'}));
assert.deepEqual(definitions.slice(0,3),baseline.slice(0,3));assert.deepEqual(definitions.slice(4),baseline.slice(4),'Approved GEN5/6 preserved');
const track=definitions[3];assert.deepEqual(track.shape,baseline[3].shape);assert.equal(track.route.length,16);
const result=await build({entryPoints:['games/sparking-stars/terrains.ts'],bundle:true,platform:'node',format:'esm',write:false});
const {terrains,distanceToTrack}=await import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64')),t=terrains[3],nav=createWorldNavigator(t.world,7);
for(const [i,path]of t.sidePaths.entries())for(const [j,p]of path.entries()){
 assert(isWorldWalkable(t.world,p,7),`Branch ${i} waypoint ${j}`);assert(distanceToTrack(p,t)<=t.width/2);if(j)assert(nav.segmentClear(path[j-1],p),`Branch ${i} segment ${j}`);
}
assert.equal(isWorldWalkable(t.world,[190,155],7),false,'Canal water is an actual gap');assert.equal(isWorldWalkable(t.world,[190,198],7),true,'First bridge is walkable');assert.equal(isWorldWalkable(t.world,[375,187],7),true,'Second bridge is walkable');
for(const width of [1000,390])await testGame('games/sparking-stars',{publicHost:true,profile:{generation:6,tier:0},width,height:width===390?844:850,timeout:20000,beforeOpen:async({page})=>{
 await page.route('https://hkudnvqseodizcplkgvw.supabase.co/**',()=>{throw Error('Preview must not contact competitive backend');});
},check:async({page,game})=>{
 await game.getByText(track.subtitle,{exact:true}).waitFor();await game.getByRole('button',{name:'Courir',exact:true}).click();assert(await game.getByRole('button',{name:/^Compétition · bêta/}).isDisabled());await game.getByRole('button',{name:'Retour à la piste',exact:true}).click();await game.locator('.race-start').click();await game.locator('.countdown').waitFor({state:'hidden'});
 const canvas=game.locator('canvas[data-x]');await page.screenshot({path:`../../outputs/gen4-preview-${width}.png`});
 for(const [i,p]of [...track.route.slice(1),track.route[0]].entries()){
  if(i===2||i===10){for(const point of track.sidePaths[(i===10?2:0)+(width===390?1:0)].slice(1))await walkTo(game,canvas,4,point,width===390);}else await walkTo(game,canvas,4,p,width===390);
  if(i===2)await page.screenshot({path:`../../outputs/gen4-bridge-${width}.png`});
 }
 await game.locator('.race-card.finished').waitFor();assert.equal(await game.getByTestId('stars').innerText(),'★ 16/16');assert.match(await game.getByTestId('prize').innerText(),/Entraînement sans récompense/);
 await game.getByRole('button',{name:'Rejouer',exact:true}).click();await game.locator('.countdown').waitFor();await game.getByRole('button',{name:'Quitter la course',exact:true}).click();await game.getByRole('navigation',{name:'Le paddock'}).waitFor();
 console.log(`PASS GEN4 ${width}px: real canal gaps, bridges and wide detours, sixteen stars, replay/exit; owned GEN6 Friend allowed in training, other GEN preserved.`);
}});
