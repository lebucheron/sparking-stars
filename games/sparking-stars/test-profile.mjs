import assert from 'node:assert/strict';
import {testGame} from './test-profile-helper.mjs';
for(let generation=1;generation<=6;generation++){
 const tier=(generation-1)%5;
 await testGame('games/sparking-stars',{profile:{generation,tier},width:generation===6?390:1000,check:async({game})=>{
  await game.getByRole('button',{name:'C’est parti !',exact:true}).waitFor();
  assert.match(await game.locator('.hud').innerText(),new RegExp(`GEN ${generation} · TIER ${tier}`));
  await game.getByRole('button',{name:'Les 6 terrains',exact:true}).click();
  assert.equal(await game.locator('.terrain-grid button:disabled').count(),5);
  assert.match(await game.locator('.terrain-grid button:enabled').innerText(),new RegExp(`GEN ${generation}`));
  await game.getByRole('button',{name:'Fermer',exact:true}).click();
  await game.getByRole('button',{name:/Boutique ·/}).click();
  assert.match(await game.locator('body').innerText(),new RegExp(`Tier officiel ${tier} / 4`));
  assert.equal(await game.getByRole('button',{name:/Acheter.*tier|Passer.*tier/i}).count(),0);
  assert.match(await game.locator('.shop-balance').innerText(),new RegExp(`remise ${tier>=3?20:0} %`));
  await game.getByRole('button',{name:`Acheter Boost · ${tier>=3?20:25} pièces`,exact:true}).click();
  assert.equal(await game.getByTestId('coins').innerText(),`${300-(tier>=3?20:25)} pièces`);
 }});console.log(`GEN ${generation}, tier ${tier}: terrain and shop verified`);
}
await testGame('games/sparking-stars',{profile:{generation:6,tier:4,fail:true},check:async({game})=>{
 await game.getByRole('button',{name:'Réessayer',exact:true}).waitFor();
 assert.equal(await game.getByRole('button',{name:'C’est parti !',exact:true}).count(),0);
}});console.log('RPC failure blocks race without inventing a profile');
