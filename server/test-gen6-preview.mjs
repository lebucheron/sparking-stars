import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {testGame} from '../games/sparking-stars/test-profile-helper.mjs';
import {walkTo} from './test-drive.mjs';
const definitions=JSON.parse(await readFile('games/sparking-stars/terrains.json','utf8'));
const original=JSON.parse(execFileSync('git',['-c',`safe.directory=${process.cwd().replaceAll('\\','/')}`,'show','32dc1ab:games/sparking-stars/terrains.json'],{encoding:'utf8'}));
assert.deepEqual(definitions.slice(0,5),original.slice(0,5),'Only GEN6 is remodeled');
const track=definitions[5];assert.equal(track.route.length,11);assert.deepEqual(track.shape,original[5].shape,"Island footprint stays exactly the same");assert.deepEqual(track.blocks,[],"Crossing is clear");assert.equal(track.width,44);
for(const width of [1000,390])await testGame('games/sparking-stars',{publicHost:true,profile:{generation:6,tier:0},width,height:width===390?844:850,timeout:20000,beforeOpen:async({page})=>{
 await page.route('https://hkudnvqseodizcplkgvw.supabase.co/**',()=>{throw Error('Training preview must not contact ranking backend');});
},check:async({page,game})=>{
 await game.getByText(track.subtitle,{exact:true}).waitFor();await game.locator('.hud small').filter({hasText:'PISTE EN ESSAI'}).first().waitFor();
 await game.getByRole('button',{name:'Courir',exact:true}).click();assert.equal(await game.getByRole('button',{name:/^Compétition · bêta/}).isDisabled(),true);assert.equal(await game.getByRole('button',{name:/^Course libre/}).isDisabled(),true);await game.getByRole('button',{name:'Retour à la piste',exact:true}).click();
 await page.screenshot({path:`../../outputs/gen6-preview-${width}.png`});await game.locator('.race-start').click();await game.locator('.countdown').waitFor({state:'hidden'});
 const canvas=game.locator('canvas[data-x]');for(const p of [...track.route.slice(1),track.route[0]])await walkTo(game,canvas,6,p,width===390);
 await game.locator('.race-card.finished').waitFor();assert.equal(await game.getByTestId('stars').innerText(),'★ 11/11');assert.match(await game.getByTestId('prize').innerText(),/Entraînement sans récompense/);
 await page.screenshot({path:`../../outputs/gen6-preview-arrival-${width}.png`});await game.getByRole('button',{name:'Rejouer',exact:true}).click();await game.locator('.countdown').waitFor();await game.getByRole('button',{name:'Quitter la course',exact:true}).click();await game.getByRole('navigation',{name:'Le paddock'}).waitFor();
 console.log(`PASS GEN6 ${width}px: figure-eight and eleven stars, real completed lap, wide intro track, replay/exit and training-only preview; other five GEN unchanged.`);
}});
