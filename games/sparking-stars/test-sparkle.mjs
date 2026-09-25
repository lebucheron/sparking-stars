import {mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {testGame} from './test-profile-helper.mjs';
const out='/tmp/sparking-stars-test-artifacts';
await mkdir(out,{recursive:true});
for(const width of [1000,390])await testGame('games/sparking-stars',{width,height:850,check:async({page,game})=>{
 await game.getByRole('button',{name:'C’est parti !',exact:true}).waitFor();
 await page.emulateMedia({reducedMotion:'no-preference'});
 await game.getByRole('button',{name:/Boutique ·/}).click();
 await game.getByRole('button',{name:/^Antenne étoile/}).click();
 await game.locator('.pilot-portrait canvas:not([hidden])').waitFor();
 await game.locator('.wardrobe-hero').scrollIntoViewIfNeeded();
 await page.locator('.rf-game-frame').screenshot({path:`${out}/pilot-${width}.png`});
 await game.getByRole('button',{name:/Poussière d’étoiles/}).click();
 assert.equal(await game.getByTestId('coins').innerText(),'300 pièces');
 await game.getByRole('button',{name:'Retour au circuit',exact:true}).click();
 await game.getByRole('button',{name:'C’est parti !',exact:true}).click();
 await game.locator('.countdown').waitFor({state:'hidden'});
 const canvas=game.locator('canvas[data-x]');
 await page.keyboard.down('ArrowRight');await page.waitForTimeout(350);
 try{assert.ok(Number(await canvas.getAttribute('data-particles'))>0,'Moving emits selected trail');}finally{await page.keyboard.up('ArrowRight');}
 assert.equal(await canvas.getAttribute('data-cosmetic'),'antenna');
 assert.equal(await canvas.getAttribute('data-trail'),'stars');
 await page.locator('.rf-game-frame').screenshot({path:`${out}/sparkle-${width}.png`});
 await page.emulateMedia({reducedMotion:'reduce'});
 await canvas.locator('xpath=self::*[@data-particles="0"]').waitFor();
 console.log(`Pilot ${width}: canonical portrait, trail during movement, reduced-motion suppression, no cost`);
}});
