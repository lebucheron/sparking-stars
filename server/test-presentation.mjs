
import {RULES} from '../supabase/functions/sparking-api/validation.js';
import assert from 'node:assert/strict';
import {testGame} from '../games/sparking-stars/test-profile-helper.mjs';
for(const [width,height] of [[1440,1000],[1366,768],[390,844]])await testGame('games/sparking-stars',{publicHost:true,profile:{generation:3,tier:0},width,height,timeout:20000,beforeOpen:async({page})=>{await page.route('https://hkudnvqseodizcplkgvw.supabase.co/functions/v1/sparking-api',async route=>{assert.equal(route.request().postDataJSON().action,'creator');await route.fulfill({json:{friendId:'331213',gen:3,equipment:'feet',rules:RULES,controls:route.request().postDataJSON().controls,ms:16184},headers:{'access-control-allow-origin':'*'}});});},check:async({page,game})=>{
 await game.getByRole('button',{name:'C’est parti !',exact:true}).waitFor();
 const bounds=await page.locator('.paddock-window').boundingBox();assert(bounds.x>=0&&bounds.x+bounds.width<=width+1);assert(bounds.y+bounds.height<=height+2,'window fits viewport');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 if(width>600){
  assert(await page.getByRole('button',{name:'Agrandir la course'}).isVisible());
  await page.getByRole('button',{name:'Agrandir la course'}).click();await page.getByRole('button',{name:'Quitter la vue course'}).waitFor();assert(await page.evaluate(()=>Boolean(document.fullscreenElement)));await page.getByRole('button',{name:'Quitter la vue course'}).click();
 }else assert.equal(await page.getByRole('button',{name:'Agrandir la course'}).isVisible(),true);
 await page.screenshot({path:`artifacts/paddock-${width}.png`});
 await game.getByRole('button',{name:'Courir',exact:true}).click();await game.getByRole('button',{name:'Retour à la piste',exact:true}).scrollIntoViewIfNeeded();await game.getByRole('button',{name:'Retour à la piste',exact:true}).click();
 await game.getByRole('button',{name:'C’est parti !',exact:true}).click();await game.locator('.countdown').waitFor({state:'hidden'});
 const canvas=game.locator('canvas[data-x]');await canvas.focus();const before=Number(await canvas.getAttribute('data-x'));await page.keyboard.down('ArrowRight');await canvas.evaluate(async()=>new Promise(r=>setTimeout(r,250)));await page.keyboard.up('ArrowRight');assert.notEqual(Number(await canvas.getAttribute('data-x')),before);
 await page.screenshot({path:`artifacts/paddock-race-${width}.png`});
 console.log(`Paddock ${width}×${height}: fits, controls accessible, keyboard works; desktop fullscreen/mobile compact layout verified.`);
}});
