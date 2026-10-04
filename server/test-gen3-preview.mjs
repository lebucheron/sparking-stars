import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {testGame} from '../games/sparking-stars/test-profile-helper.mjs';
import {walkTo} from './test-drive.mjs';
const definitions=JSON.parse(await readFile('games/sparking-stars/terrains.json','utf8'));
const baseline=JSON.parse(execFileSync('git',['-c',`safe.directory=${process.cwd().replaceAll('\\','/')}`,'show','ed1be88:games/sparking-stars/terrains.json'],{encoding:'utf8'}));
assert.deepEqual(definitions.slice(0,2),baseline.slice(0,2));assert.deepEqual(definitions.slice(3),baseline.slice(3),'Approved GEN4/5/6 preserved');
const track=definitions[2];assert.deepEqual(track.shape,baseline[2].shape);assert.equal(track.route.length,12);
for(const width of [1000,390])await testGame('games/sparking-stars',{publicHost:true,profile:{generation:6,tier:0},width,height:width===390?844:850,timeout:20000,beforeOpen:async({page})=>{
 await page.route('https://hkudnvqseodizcplkgvw.supabase.co/**',()=>{throw Error('Preview must not contact competitive backend');});
},check:async({page,game})=>{
 await game.getByText(track.subtitle,{exact:true}).waitFor();await game.getByRole('button',{name:'Courir',exact:true}).click();assert(await game.getByRole('button',{name:/^Compétition · bêta/}).isDisabled());await game.getByRole('button',{name:'Retour à la piste',exact:true}).click();await game.locator('.race-start').click();await game.locator('.countdown').waitFor({state:'hidden'});
 const canvas=game.locator('canvas[data-x]');await page.screenshot({path:`../../outputs/gen3-preview-${width}.png`});
 for(const [i,p]of [...track.route.slice(1),track.route[0]].entries()){
  if(i===9&&width===390){await walkTo(game,canvas,3,[445,195],true);await walkTo(game,canvas,3,[445,230],true);}
  await walkTo(game,canvas,3,p,width===390);
  if(i===8)await page.screenshot({path:`../../outputs/gen3-gate-${width}.png`});
 }
 await game.locator('.race-card.finished').waitFor();assert.equal(await game.getByTestId('stars').innerText(),'★ 12/12');assert.match(await game.getByTestId('prize').innerText(),/Entraînement sans récompense/);
 await game.getByRole('button',{name:'Rejouer',exact:true}).click();await game.locator('.countdown').waitFor();await game.getByRole('button',{name:'Quitter la course',exact:true}).click();await game.getByRole('navigation',{name:'Le paddock'}).waitFor();
 console.log(`PASS GEN3 ${width}px: flowing route, twelve stars, timed gate ${width===390?'left detour':'crossing'}, replay/exit; owned GEN6 Friend allowed in training, other GEN preserved.`);
}});
