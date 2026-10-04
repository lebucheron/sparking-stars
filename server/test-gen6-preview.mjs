import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {testGame} from '../games/sparking-stars/test-profile-helper.mjs';
import {walkTo} from './test-drive.mjs';
const definitions=JSON.parse(await readFile('games/sparking-stars/terrains.json','utf8'));
const original=JSON.parse(execFileSync('git',['-c',`safe.directory=${process.cwd().replaceAll('\\','/')}`,'show','32dc1ab:games/sparking-stars/terrains.json'],{encoding:'utf8'}));
assert.deepEqual(definitions.slice(0,4),original.slice(0,4),'GEN1–4 are unchanged');
const approved=JSON.parse(execFileSync('git',['-c',`safe.directory=${process.cwd().replaceAll('\\','/')}`,'show','c5f2e12:games/sparking-stars/terrains.json'],{encoding:'utf8'}));
assert.deepEqual(definitions[5],approved[5],'Approved GEN6 stays unchanged');
const track=definitions[5];assert.equal(track.route.length,11);assert.deepEqual(track.shape,original[5].shape,"Island footprint stays exactly the same");assert.deepEqual(track.blocks,[],"Crossing is clear");assert.equal(track.width,44);
for(const width of [1000,390])await testGame('games/sparking-stars',{publicHost:true,profile:{generation:6,tier:0},width,height:width===390?844:850,timeout:20000,beforeOpen:async({page})=>{
 await page.route('https://hkudnvqseodizcplkgvw.supabase.co/**',()=>{throw Error('Training preview must not contact ranking backend');});
},check:async({page,game})=>{
 await game.getByRole('button',{name:'Progresser',exact:true}).click();await game.getByRole('button',{name:'Les 6 terrains',exact:true}).click();await game.getByRole('button',{name:/GEN 6 · Découverte/}).click();
 await game.getByText(track.subtitle,{exact:true}).waitFor();await game.locator('.hud small').filter({hasText:'PISTE EN ESSAI'}).first().waitFor();
 await game.getByRole('button',{name:'Courir',exact:true}).click();assert.equal(await game.getByRole('button',{name:/^Compétition · bêta/}).isDisabled(),true);assert.equal(await game.getByRole('button',{name:/^Course libre/}).isDisabled(),true);await game.getByRole('button',{name:'Retour à la piste',exact:true}).click();
 await page.screenshot({path:`../../outputs/gen6-preview-${width}.png`});await game.locator('.race-start').click();await game.locator('.countdown').waitFor({state:'hidden'});
 const canvas=game.locator('canvas[data-x]');for(const [i,p] of [...track.route.slice(1),track.route[0]].entries()){
  if(i===9){
   const target=game.getByTestId('covered-star-target');await target.waitFor();await page.screenshot({path:`../../outputs/gen6-house-passage-${width}.png`});
   await target[width===390?'tap':'click']();assert.equal(await game.getByTestId('stars').innerText(),'★ 9/11','Click aims at the star rather than awarding it remotely');
   await game.getByTestId('stars').filter({hasText:'★ 10/11'}).waitFor();const position=await canvas.evaluate(c=>[Number(c.dataset.x),Number(c.dataset.y)]);assert(Math.hypot(position[0]-p[0],position[1]-p[1])<track.reach,'Friend walks to the occluded star');
  }else await walkTo(game,canvas,6,p,width===390);
 }
 await game.locator('.race-card.finished').waitFor();assert.equal(await game.getByTestId('stars').innerText(),'★ 11/11');assert.match(await game.getByTestId('prize').innerText(),/Entraînement sans récompense/);
 await page.screenshot({path:`../../outputs/gen6-preview-arrival-${width}.png`});await game.getByRole('button',{name:'Rejouer',exact:true}).click();await game.locator('.countdown').waitFor();await game.getByRole('button',{name:'Quitter la course',exact:true}).click();await game.getByRole('navigation',{name:'Le paddock'}).waitFor();
 console.log(`PASS GEN6 ${width}px: approved figure-eight, moving bush, eleven stars, completed lap, replay/exit and training-only preview.`);
}});
