import {mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {testGame} from './test-profile-helper.mjs';
const out='/tmp/sparking-stars-test-artifacts';
await mkdir(out,{recursive:true});
for(const width of [1000,390])await testGame('games/sparking-stars',{width,height:850,check:async({page,game})=>{
 await game.getByRole('button',{name:'C’est parti !',exact:true}).waitFor();
 const canvas=game.locator('canvas[data-x]');await canvas.waitFor();
 for(const [name,id] of [['Casque damier','helmet'],['Casquette du paddock','cap'],['Antenne étoile','antenna'],['Au naturel','none']]){
  await game.getByRole('button',{name:/Boutique ·/}).click();
  const button=game.getByRole('button',{name:new RegExp('^'+name)});await button.click();
  assert.equal(await button.getAttribute('aria-pressed'),'true');
  assert.equal(await game.getByTestId('coins').innerText(),'300 pièces');
  if(id==='helmet'){await button.scrollIntoViewIfNeeded();await page.locator('.rf-game-frame').screenshot({path:`${out}/wardrobe-${width}.png`});}
  await game.getByRole('button',{name:'Retour au circuit',exact:true}).click();
  await page.waitForFunction(()=>true);
  await canvas.locator(`xpath=self::*[@data-cosmetic="${id}"]`).waitFor();
 }
 await game.getByRole('button',{name:/Boutique ·/}).click();
 await game.getByRole('button',{name:/^Casque damier/}).click();
 await game.getByRole('button',{name:'Retour au circuit',exact:true}).click();
 await game.getByRole('button',{name:'C’est parti !',exact:true}).click();
 await game.locator('.countdown').waitFor({state:'hidden'});
 assert.equal(await canvas.getAttribute('data-cosmetic'),'helmet');
 await page.locator('.rf-game-frame').screenshot({path:`${out}/helmet-${width}.png`});
 console.log(`Cosmetics ${width}: equip/remove, no currency spent, persists into race`);
}});
