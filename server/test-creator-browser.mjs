
import assert from 'node:assert/strict';
import {testGame} from '../games/sparking-stars/test-profile-helper.mjs';
import {RULES} from '../supabase/functions/sparking-api/validation.js';
for(const [width,gen] of [[1366,3],[390,3],[390,2]])await testGame('games/sparking-stars',{publicHost:true,profile:{generation:gen,tier:0},width,height:900,timeout:20000,beforeOpen:async({page})=>{
 await page.route('https://hkudnvqseodizcplkgvw.supabase.co/functions/v1/sparking-api',async route=>{assert.equal(route.request().postDataJSON().action,'creator');await route.fulfill({json:{friendId:'331213',gen:3,equipment:'feet',rules:RULES,controls:route.request().postDataJSON().controls,ms:16184},headers:{'access-control-allow-origin':'*'}});});
 await page.addInitScript(()=>{Object.defineProperty(navigator.mediaDevices,'getDisplayMedia',{value:async()=>{const canvas=document.createElement('canvas');canvas.width=320;canvas.height=180;canvas.getContext('2d').fillRect(0,0,320,180);window.__testVideo=canvas.captureStream(5);return window.__testVideo;}});});
},check:async({page,game})=>{
 await game.getByRole('button',{name:'Le défi du créateur ↗',exact:true}).click();await game.getByText('16.184 s',{exact:true}).waitFor();
 if(gen!==3){assert(await game.getByRole('button',{name:'Friend GEN 3 requis'}).isDisabled());return;}
 await page.screenshot({path:`artifacts/creator-${width}.png`});await game.getByRole('button',{name:'Relever le défi',exact:true}).click();await game.getByText('Défi du créateur · bats 16.184 s à pied.',{exact:true}).waitFor();assert.match(await game.locator('.race-card').innerText(),/COMPÉTITION/);
 if(width>600){await page.getByRole('button',{name:'Filmer la démo · 45 s',exact:true}).click();await page.getByRole('button',{name:/Terminer ·/}).waitFor();await page.getByRole('button',{name:/Terminer ·/}).click();await page.getByRole('link',{name:'Télécharger la vidéo'}).waitFor();assert.equal(await page.evaluate(()=>window.__testVideo.getTracks().every(t=>t.readyState==='ended')),true);}
 console.log(`Creator ${width}px GEN${gen}: target, category and recording controls passed.`);
}});

await testGame('games/sparking-stars',{publicHost:true,profile:{generation:3,tier:0},width:390,height:900,beforeOpen:async({page})=>{
 await page.route('https://hkudnvqseodizcplkgvw.supabase.co/functions/v1/sparking-api',route=>route.fulfill({json:{friendId:'331213',gen:3,equipment:'feet',rules:RULES,controls:route.request().postDataJSON().controls,ms:null},headers:{'access-control-allow-origin':'*'}}));
},check:async({game})=>{
 await game.getByRole('button',{name:'Le défi du créateur ↗',exact:true}).click();await game.getByText(/Le créateur prépare son prochain tour/).waitFor();assert(await game.getByRole('button',{name:'Relever le défi',exact:true}).isDisabled());
 console.log('New circuit: no stale creator reference and challenge disabled until a valid ranked lap.');
}});
