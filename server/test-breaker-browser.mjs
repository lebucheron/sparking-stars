
import assert from 'node:assert/strict';
import {testGame} from '../games/sparking-stars/test-profile-helper.mjs';
import {clickWorld} from './test-drive.mjs';
await testGame('games/sparking-stars',{profile:{generation:6,tier:0},width:390,height:900,timeout:20000,check:async({page,game})=>{
 await game.getByRole('button',{name:'C’est parti !',exact:true}).waitFor();
 await game.getByRole('button',{name:/Boutique ·/}).click();await game.getByRole('button',{name:'Acheter Casse-brique · 30 pièces',exact:true}).click();await game.getByRole('button',{name:'Casse-brique · 1',exact:true}).click();await game.getByRole('button',{name:'Retour au circuit',exact:true}).click();
 await game.getByRole('button',{name:'Modes',exact:true}).click();await game.getByRole('button',{name:/^Course libre/}).click();await game.getByRole('button',{name:'Retour à la piste',exact:true}).click();await game.getByRole('button',{name:'C’est parti !',exact:true}).click();await game.locator('.countdown').waitFor({state:'hidden'});
 let requests=0;page.on('request',()=>requests++);
 await game.locator('body').evaluate(()=>{window.__loadingSeen=false;new MutationObserver(()=>{if(document.querySelector('.rf-world-loading'))window.__loadingSeen=true;}).observe(document.body,{childList:true,subtree:true});});
 await game.getByRole('button',{name:'Casse-brique · Espace',exact:true}).click();await game.getByRole('button',{name:'Bonus utilisé',exact:true}).waitFor();
 await clickWorld(game.locator('canvas[data-x]'),[146,277]);await game.getByTestId('stars').filter({hasText:'★ 1/8'}).waitFor();
 assert.equal(requests,0,'breaking must not reload assets or NFT artwork');assert.equal(await game.locator('body').evaluate(()=>window.__loadingSeen),false,'no loading overlay mid-race');
 console.log('Breaker: immediate obstacle removal, no network fetch or loading overlay, direct passage works.');
}});
