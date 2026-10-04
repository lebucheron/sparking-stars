import assert from 'node:assert/strict';
import {testGame} from '../games/sparking-stars/test-profile-helper.mjs';
import {GENERATION_SPRITE_MANIFEST} from '../dist/generation-sprites.js';
import {RULES} from '../games/sparking-stars/rules-version.ts';
let artworkReads=0;
await testGame('games/sparking-stars',{publicHost:true,width:1000,height:900,beforeOpen:async({page})=>{
 page.on('request',request=>{if(request.method()!=='POST')return;let body;try{body=request.postDataJSON();}catch{return;}if(body?.method==='eth_call'&&body.params?.[0]?.to?.toLowerCase()===GENERATION_SPRITE_MANIFEST.registry.toLowerCase())artworkReads++;});
 await page.route('https://hkudnvqseodizcplkgvw.supabase.co/functions/v1/sparking-api',async route=>{const b=route.request().postDataJSON();assert(['creator','board'].includes(b.action));await route.fulfill({json:{rules:RULES,controls:b.controls,ms:null,rows:[]}});});
},check:async({page,game})=>{
 const canvas=game.locator('canvas[data-x]');await canvas.waitFor();await game.locator('.rf-world-loading').waitFor({state:'hidden'});
 const normalReads=artworkReads;assert(normalReads>0);
 for(let run=0;run<2;run++){
  await game.locator('.race-start').click();await game.locator('.countdown').waitFor({state:'hidden'});await canvas.press('ArrowRight',{delay:350});await game.getByRole('button',{name:'Quitter la course',exact:true}).click();await game.locator('.race-start').waitFor();
  assert.equal(artworkReads,normalReads,'GEN restarts reuse the loaded canonical artwork');
 }
 await game.getByRole('button',{name:'Courir',exact:true}).click();await game.getByRole('button',{name:'Halloween · La boucle hantée',exact:true}).click();await game.locator('.rf-world-loading').waitFor({state:'hidden'});await canvas.waitFor();
 const loadedReads=artworkReads;assert.equal(loadedReads,normalReads,'Changing to Halloween reuses the same immutable Friend artwork');await canvas.evaluate(c=>c.dataset.restartProbe='retained');
 await game.getByRole('button',{name:'Entrer dans la boucle',exact:true}).click();await game.locator('.countdown').waitFor({state:'hidden'});await canvas.press('ArrowRight',{delay:350});
 assert(Number(await canvas.getAttribute('data-x'))>100,'Input moves the Friend');
 for(let run=0;run<3;run++){
  const started=Date.now();await game.getByRole('button',{name:'Recommencer',exact:true}).click();await canvas.evaluate(async c=>{const end=performance.now()+1000;while(performance.now()<end){if(Math.hypot(Number(c.dataset.x)-100,Number(c.dataset.y)-280)<.01)return;await new Promise(r=>requestAnimationFrame(r));}throw Error('Restart must reset position without waiting for RPC');});
  assert(Date.now()-started<1500,'Restart resets immediately');assert.equal(await canvas.getAttribute('data-restart-probe'),'retained','Renderer is retained');assert.equal(await game.locator('.rf-world-loading').count(),0,'No loading overlay on replay');assert.equal(artworkReads,loadedReads,'No artwork RPC calls on repeated starts');assert.equal(await game.getByTestId('timer').innerText(),'0.000 s');
  await game.locator('.countdown').waitFor({state:'hidden'});await canvas.press('ArrowRight',{delay:350});assert(Number(await canvas.getAttribute('data-x'))>100,'Controls work after each reset');
 }
 assert.equal(await page.evaluate(()=>Object.keys(localStorage).some(k=>k.startsWith('sparking:halloween:'))),false,'Restarts do not count as wins');
 console.log('PASS GEN/Halloween repeated starts retain artwork, avoid RPC reloads and reset position/time/input immediately.');
}});
