import assert from 'node:assert/strict';
import {testGame} from '../games/sparking-stars/test-profile-helper.mjs';
import {walkTo,clickWorld} from './test-drive.mjs';
import {RULES} from '../games/sparking-stars/rules-version.ts';
for(const width of [1000,390])await testGame('games/sparking-stars',{publicHost:true,profile:{generation:6,tier:0},width,height:900,timeout:30000,
 beforeOpen:async({page})=>{await page.route('https://hkudnvqseodizcplkgvw.supabase.co/functions/v1/sparking-api',async route=>{const b=route.request().postDataJSON();assert(['creator','board'].includes(b.action));await route.fulfill({json:{rules:RULES,controls:b.controls,ms:null,rows:[]}});});},
 check:async({page,game})=>{
  const touch=width<500,expected=touch?'touch':'desktop';
  const openModes=async()=>{await game.getByRole('button',{name:'Modes',exact:true}).click();await game.getByRole('checkbox',{name:'Afficher le fantôme de mon meilleur tour'}).check();await game.getByRole('button',{name:'Retour à la piste',exact:true}).click();};
  await openModes();await game.getByRole('button',{name:'C’est parti !',exact:true}).click();await game.locator('.countdown').waitFor({state:'hidden'});
  const canvas=game.locator('canvas[data-x]');
  for(const point of [[146,277],[88,192],[146,107],[288,72],[430,107],[488,192],[430,277],[288,312]])await walkTo(game,canvas,6,point,touch);
  await game.getByText('Fantôme sauvegardé sur cet appareil.',{exact:true}).waitFor();
  const time=await game.getByTestId('timer').innerText();
  await game.getByRole('button',{name:'Chronos',exact:true}).click();assert.equal(await game.getByTestId('saved-ghost').locator('strong').innerText(),time);
  assert.equal(await game.getByLabel('Commandes des chronos').inputValue(),expected);
  await page.reload();await page.getByRole('button',{name:/^Connect (wallet|Browser wallet)$/}).click();await page.getByRole('button',{name:/^Friend #7730\b/}).click();
  await game.getByText('Fantômes retrouvés sur cet appareil.',{exact:true}).waitFor();await openModes();
  await game.getByRole('button',{name:'Chronos',exact:true}).click();assert.equal(await game.getByTestId('saved-ghost').locator('strong').innerText(),time);assert.equal(await game.locator('tbody tr').count(),0,'Ghost persists while session laps reset');await game.getByTestId('saved-ghost').screenshot({path:`../../outputs/ghost-reference-${width}.png`});await page.screenshot({path:`../../outputs/ghost-log-${width}.png`});
  await game.getByRole('button',{name:'Retour au circuit',exact:true}).click();await game.getByRole('button',{name:'C’est parti !',exact:true}).click();await game.locator('.countdown').waitFor({state:'hidden'});await game.locator('canvas[data-ghost="visible"]').waitFor();
  await canvas.evaluate(async c=>{while(Number(c.dataset.ghostTime)<2000)await new Promise(r=>setTimeout(r,40));});await page.screenshot({path:`../../outputs/ghost-replay-${width}.png`});
  const before=Number(await canvas.getAttribute('data-ghost-time'));await page.getByRole('button',{name:'Choose Friend',exact:true}).click();await page.waitForTimeout(200);const paused=Number(await canvas.getAttribute('data-ghost-time'));await page.waitForTimeout(400);assert.equal(Number(await canvas.getAttribute('data-ghost-time')),paused,'Runtime menu pauses ghost');await page.keyboard.press('Escape');
  const originalMs=Math.round(Number(time.replace(' s',''))*1000);
  await canvas.evaluate(async(c,ms)=>{while(Number(document.querySelector('[data-testid="timer"]').textContent.replace(' s',''))*1000<ms+1000)await new Promise(r=>setTimeout(r,50));},originalMs);
  for(const point of [[146,277],[88,192],[146,107],[288,72],[430,107],[488,192],[430,277],[288,312]])await walkTo(game,canvas,6,point,touch);
  await game.getByText('Fantôme sauvegardé sur cet appareil.',{exact:true}).waitFor();
  assert.match(await game.locator('.score small').innerText(),new RegExp(time.replace('.','\\.')),'Slower lap after reload cannot replace restored record');
  await game.getByRole('button',{name:'Chronos',exact:true}).click();assert.equal(await game.getByTestId('saved-ghost').locator('strong').innerText(),time);await game.getByRole('button',{name:'Retour au circuit',exact:true}).click();
  if(touch){await game.getByRole('button',{name:'Rejouer',exact:true}).click();await game.locator('.countdown').waitFor({state:'hidden'});await clickWorld(canvas,[288,312]);await game.getByTestId('race-controls').filter({hasText:'Clavier / souris'}).waitFor();assert.equal(await canvas.getAttribute('data-ghost'),'hidden','Mouse on phone switches to desktop and hides tactile ghost');}
  assert(before>=0);await page.screenshot({path:`../../outputs/ghost-${width}.png`});
  console.log(`PASS ${width}px: completed ${expected} lap, persistent ghost in Chronos after reload, replay and pause${touch?', phone mouse promoted to desktop':''}.`);
 }});
