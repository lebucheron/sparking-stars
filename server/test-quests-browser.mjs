import assert from 'node:assert/strict';
import {testGame} from '../games/sparking-stars/test-profile-helper.mjs';
import {walkTo} from './test-drive.mjs';
import {RULES} from '../games/sparking-stars/rules-version.ts';
for(const width of [1000,390])await testGame('games/sparking-stars',{publicHost:true,profile:{generation:6,tier:0},width,height:900,timeout:30000,
 beforeOpen:async({page})=>{await page.route('https://hkudnvqseodizcplkgvw.supabase.co/functions/v1/sparking-api',async route=>{const b=route.request().postDataJSON();assert(['creator','board'].includes(b.action));await route.fulfill({json:{rules:RULES,controls:b.controls,ms:null,rows:[]}});});},
 check:async({page,game})=>{
  const open=async()=>{if(await page.getByRole('button',{name:'Quitter la vue course',exact:true}).isVisible())await page.getByRole('button',{name:'Quitter la vue course',exact:true}).click();await game.getByRole('button',{name:'Progresser',exact:true}).click();await game.getByRole('button',{name:'Quêtes',exact:true}).click();await game.getByRole('dialog',{name:'Quêtes personnelles'}).waitFor();};
  await open();await game.getByText('0 / 1 tour',{exact:true}).waitFor();await game.getByRole('button',{name:'Retour à la piste',exact:true}).click();
  await game.getByRole('button',{name:'C’est parti !',exact:true}).click();await game.locator('.countdown').waitFor({state:'hidden'});
  const canvas=game.locator('canvas[data-x]');for(const point of [[146,277],[88,192],[146,107],[288,72],[430,107],[488,192],[430,277],[288,312]])await walkTo(game,canvas,6,point,width<500);
  await game.getByTestId('quest-notice').filter({hasText:'Première empreinte'}).waitFor();await game.getByRole('button',{name:'Voir mes quêtes',exact:true}).click();await game.getByText('1 / 3 tours',{exact:true}).waitFor();await game.getByText('✦ Accomplie',{exact:true}).waitFor();await page.screenshot({path:`../../outputs/quetes-${width}.png`});
  await page.reload();await page.getByRole('button',{name:/^Connect (wallet|Browser wallet)$/}).click();await page.getByRole('button',{name:/^Friend #7730\b/}).click();await open();await game.getByText('1 / 3 tours',{exact:true}).waitFor();
  // Use only local test data to exercise the ready challenge and its replay.
  await page.evaluate(()=>{const k=Object.keys(localStorage).find(k=>k.startsWith('sparking:quests:'));const data=JSON.parse(localStorage.getItem(k));const state=Object.values(data.categories)[0];state.target=state.recent[0];state.recent=Array(5).fill(state.recent[0]);localStorage.setItem(k,JSON.stringify(data));});
  await page.reload();await page.getByRole('button',{name:/^Connect (wallet|Browser wallet)$/}).click();await page.getByRole('button',{name:/^Friend #7730\b/}).click();await open();
  await game.getByRole('button',{name:'Courir contre le fantôme du défi',exact:true}).click();await game.getByRole('button',{name:'C’est parti !',exact:true}).click();await game.locator('.countdown').waitFor({state:'hidden'});await game.locator('canvas[data-ghost="visible"]').waitFor();
  console.log(`PASS quests ${width}px: completed lap, badge and progress, reload persistence, challenge selection and visible replay.`);
 }});
