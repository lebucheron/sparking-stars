
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {project} from '@rarefriends/friendsdk/world';
import {testGame} from '../games/sparking-stars/test-profile-helper.mjs';
import {validateTrace,RULES} from '../supabase/functions/sparking-api/validation.js';
const compiled=await build({entryPoints:['games/sparking-stars/terrains.ts'],bundle:true,platform:'node',format:'esm',write:false});
const {terrains}=await import('data:text/javascript;base64,'+Buffer.from(compiled.outputFiles[0].text).toString('base64'));
for(const width of [1000,390]){
 let saved=null,finishes=0;
 await testGame('games/sparking-stars',{publicHost:true,profile:{generation:3,tier:0},width,height:900,timeout:30000,
 beforeOpen:async({page})=>{
  await page.route('https://hkudnvqseodizcplkgvw.supabase.co/functions/v1/sparking-api',async route=>{
   const b=route.request().postDataJSON();let data;
   if(b.action==='style')data={balance:0,cosmetic:'none',trail:'none',owned:[],laps:0,daily:0,active:true,endsAt:'2026-10-24T00:00:00Z'};
   else if(b.action==='challenge')data={id:'11111111-1111-4111-8111-111111111111',message:`lebucheron.github.io wants you to sign in with your Ethereum account:\n${b.wallet}\n\nTest login.\nURI: https://lebucheron.github.io/sparking-stars/\nChain ID: 4663`};
   else if(b.action==='login')data={token:'1'.repeat(64),expiresAt:Date.now()+60000};
   else if(b.action==='start'){assert.match(route.request().headers().authorization,/^Bearer 1{64}$/);data={id:'22222222-2222-4222-8222-222222222222',generation:3,rules:RULES};}
   else if(b.action==='finish'){try{saved=validateTrace(3,'feet',b.trace);finishes++;data={ms:saved};}catch(e){console.log('TRACE ERROR',e.message);data={error:e.message};}}
   else if(b.action==='board')data={rules:RULES,rows:saved?[{friend_id:'7730',elapsed_ms:saved,rank:1,gap:0}]:[]};
   else throw new Error('Unexpected action');
   await route.fulfill({json:data,headers:{'access-control-allow-origin':'*'}});
  });
 },check:async({page,game})=>{
  // A test-only signature stub; no production wallet or key is used.
  await page.evaluate(()=>{const original=window.ethereum.request.bind(window.ethereum);window.ethereum.request=async args=>args.method==='personal_sign'?'0x'+'1'.repeat(130):original(args);});
  await game.getByRole('button',{name:'Modes',exact:true}).click();
  await game.getByRole('button',{name:/^Compétition · bêta/}).click();
  await game.getByRole('button',{name:'Retour à la piste',exact:true}).click();
  await game.getByRole('button',{name:'C’est parti !',exact:true}).click();
  await game.getByText(/Clique « Activer le classement »/).waitFor();
  await page.getByRole('button',{name:'Activer le classement',exact:true}).click();
  await page.getByText(/Classement activé pour une heure/).waitFor();
  await game.getByRole('button',{name:'C’est parti !',exact:true}).click();
  await game.locator('.countdown').waitFor({state:'hidden'});
  const canvas=game.locator('canvas[data-x]'),route=terrains[2].route;
  for(let i=1;i<=route.length;i++){
   const box=await canvas.boundingBox(),[x,y]=project(...route[i%route.length]);
   await canvas.click({position:{x:(x-220)*box.width/1160,y:(y-265)*box.height/(1160/1.5)}});
   await game.getByTestId('stars').filter({hasText:`★ ${i}/${route.length}`}).waitFor();
  }
  try{await game.getByText(/Chrono publié :/).waitFor();}catch(e){console.log('FINISH UI',await game.locator('.race-card').innerText());throw e;}assert.equal(finishes,1);
  await game.getByRole('button',{name:'Chronos',exact:true}).click();
  await game.getByRole('button',{name:'Voir le classement public ↗',exact:true}).click();
  await game.getByRole('cell',{name:'Friend #7730',exact:true}).waitFor();
  assert.equal(await game.getByRole('cell',{name:'#1',exact:true}).count(),1);
  await page.screenshot({path:`/tmp/sparking-public-${width}.png`});
  console.log(`Public browser flow ${width}px: signed host session, actual GEN3 trace accepted, published row shown.`);
 }});
}
