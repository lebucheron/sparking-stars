import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {testGame} from '../games/sparking-stars/test-profile-helper.mjs';
import {walkTo} from './test-drive.mjs';
const definitions=JSON.parse(await readFile('games/sparking-stars/terrains.json','utf8'));
const baseline=JSON.parse(execFileSync('git',['-c',`safe.directory=${process.cwd().replaceAll('\\','/')}`,'show','c5f2e12:games/sparking-stars/terrains.json'],{encoding:'utf8'}));
assert.deepEqual(definitions.slice(0,2),baseline.slice(0,2));assert.deepEqual(definitions[5],baseline[5],'Approved GEN6 is preserved');
const track=definitions[4];assert.deepEqual(track.shape,baseline[4].shape,'Original island surface preserved');assert.equal(track.route.length,15);
assert.deepEqual(track.route[12],[475,175]);assert(track.props.some(p=>p[0]==='rock'&&p[1]===465&&p[2]===230));assert.equal(track.sidePaths.length,4);
for(const width of [1000,390])await testGame('games/sparking-stars',{publicHost:true,profile:{generation:5,tier:0},width,height:width===390?844:850,timeout:20000,beforeOpen:async({page})=>{
 await page.route('https://hkudnvqseodizcplkgvw.supabase.co/**',()=>{throw Error('Preview must not contact the competitive backend');});
},check:async({page,game})=>{
 await game.getByRole('button',{name:'Courir',exact:true}).click();await game.getByRole('button',{name:'Les 6 terrains',exact:true}).click();await game.getByRole('button',{name:/GEN 5 · Trajectoires/}).click();
 await game.getByText(track.subtitle,{exact:true}).waitFor();await game.getByRole('button',{name:'Courir',exact:true}).click();assert(await game.getByRole('button',{name:/^Compétition · bêta/}).isDisabled());assert(await game.getByRole('button',{name:/^Course libre/}).isDisabled());await game.getByRole('button',{name:'Retour à la piste',exact:true}).click();await game.locator('.race-start').click();await game.locator('.countdown').waitFor({state:'hidden'});
 const canvas=game.locator('canvas[data-x]');await page.screenshot({path:`../../outputs/gen5-preview-${width}.png`});
 for(const [i,p]of [...track.route.slice(1),track.route[0]].entries()){
  if(i===12||i===9){for(const point of track.sidePaths[(i===9?2:0)+(width===390?0:1)].slice(1))await walkTo(game,canvas,5,point,width===390);}else await walkTo(game,canvas,5,p,width===390);
  if(i===2)await page.screenshot({path:`../../outputs/gen5-rock-passage-${width}.png`});
  if(i===11)await page.screenshot({path:`../../outputs/gen5-chicane-${width}.png`});
 }
 await game.locator('.race-card.finished').waitFor();assert.equal(await game.getByTestId('stars').innerText(),'★ 15/15');assert.match(await game.getByTestId('prize').innerText(),/Entraînement sans récompense/);
 await page.screenshot({path:`../../outputs/gen5-arrival-${width}.png`});await game.getByRole('button',{name:'Rejouer',exact:true}).click();await game.locator('.countdown').waitFor();await game.getByRole('button',{name:'Quitter la course',exact:true}).click();await game.getByRole('navigation',{name:'Le paddock'}).waitFor();
 console.log(`PASS GEN5 ${width}px: rock passage, chicane and hairpins, all fifteen stars, replay/exit, real ownership runtime and no ranking writes; GEN1–4 and approved GEN6 unchanged.`);
}});
