import {RULES} from '../supabase/functions/sparking-api/validation.js';

import assert from 'node:assert/strict';
import {testGame} from '../games/sparking-stars/test-profile-helper.mjs';
for(const width of [1000,390]){
 let state={balance:60,cosmetic:'none',trail:'none',owned:['crown','halo'],laps:5,daily:2,active:true,endsAt:'2026-10-24T00:00:00Z'},buys=0;
 await testGame('games/sparking-stars',{publicHost:true,profile:{generation:3,tier:0},width,height:1000,timeout:25000,
 beforeOpen:async({page})=>{
  await page.route('https://hkudnvqseodizcplkgvw.supabase.co/functions/v1/sparking-api',async route=>{
   const b=route.request().postDataJSON();let data;
   if(b.action==='creator')data={friendId:'331213',gen:3,equipment:'feet',rules:RULES,ms:16184};
   else if(b.action==='challenge')data={id:'11111111-1111-4111-8111-111111111111',message:`lebucheron.github.io wants you to sign in with your Ethereum account:\n${b.wallet}\n\nTest login.\nURI: https://lebucheron.github.io/sparking-stars/\nChain ID: 4663`};
   else if(b.action==='login')data={token:'1'.repeat(64),expiresAt:Date.now()+60000};
   else if(b.action==='style'){
    assert.equal(b.friendId,'7730');assert.match(route.request().headers().authorization,/^Bearer 1{64}$/);
    if(b.operation==='buy'){assert.equal(b.item,'cometcap');if(!state.owned.includes(b.item)){state.balance-=30;state.owned.push(b.item);buys++;}}
    if(b.operation==='equip'){assert(state.owned.includes(b.item)||b.item==='none');state[b.kind]=b.item;}
    data=state;
   }else throw new Error('Unexpected '+b.action);
   await route.fulfill({json:data,headers:{'access-control-allow-origin':'*'}});
  });
 },check:async({page,game})=>{
  const login=async()=>{
   await page.evaluate(()=>{const original=window.ethereum.request.bind(window.ethereum);window.ethereum.request=async args=>args.method==='personal_sign'?'0x'+'1'.repeat(130):original(args);});
   await page.getByRole('button',{name:'Activer le classement',exact:true}).click();
   await page.getByText(/Classement activé pour une heure/).waitFor();
  };
  await game.getByRole('button',{name:'C’est parti !',exact:true}).waitFor();await login();
  await game.getByRole('button',{name:/Boutique ·/}).click();const season=game.getByRole('region',{name:'Saison Constellations'});
  await season.getByText('60 ✦ étoiles de style',{exact:true}).waitFor();
  const cap=season.locator('article').filter({has:game.getByRole('heading',{name:'Casque comète',exact:true})});
  await cap.getByRole('button',{name:'Obtenir · 30 ✦',exact:true}).click();await cap.getByRole('button',{name:'Équiper',exact:true}).click();
  await cap.getByRole('button',{name:'Équipé',exact:true}).waitFor();assert.equal(buys,1);assert.equal(state.cosmetic,'cometcap');assert.equal(state.balance,30);
  const locked=season.locator('article').filter({has:game.getByRole('heading',{name:'Sillage de comètes',exact:true})});assert(await locked.getByRole('button',{name:'À débloquer'}).isDisabled());
  await season.getByRole('button',{name:'Actualiser la collection',exact:true}).click();await season.getByText('Collection synchronisée.',{exact:true}).waitFor();
  await cap.scrollIntoViewIfNeeded();await page.screenshot({path:`artifacts/sparking-season-${width}.png`});
  await page.reload();await page.getByRole('button',{name:/^Connect (wallet|Browser wallet)$/}).click();await page.getByRole('button',{name:/^Friend #7730\b/}).click();await game.getByRole('button',{name:'C’est parti !',exact:true}).waitFor();await login();
  await game.getByRole('button',{name:/Boutique ·/}).click();await season.getByText('30 ✦ étoiles de style',{exact:true}).waitFor();await cap.getByRole('button',{name:'Équipé',exact:true}).waitFor();
  console.log(`Season ${width}px: purchase, locked pass, equip and reload restore passed; no performance changes.`);
 }});
}
