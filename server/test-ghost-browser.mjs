
import assert from 'node:assert/strict';
import {testGame} from '../games/sparking-stars/test-profile-helper.mjs';
import {clickWorld,walkTo} from './test-drive.mjs';
for(const width of [1000,390])await testGame('games/sparking-stars',{profile:{generation:1,tier:0},width,height:900,timeout:25000,check:async({page,game})=>{
 await game.getByRole('button',{name:'C’est parti !',exact:true}).waitFor();
 await game.getByRole('button',{name:'Modes',exact:true}).click();const toggle=game.getByRole('checkbox',{name:'Afficher le fantôme de mon meilleur tour'});assert.equal(await toggle.isChecked(),false);await toggle.check();await game.getByRole('button',{name:'Retour à la piste',exact:true}).click();
 await game.getByRole('button',{name:'C’est parti !',exact:true}).click();await game.locator('.countdown').waitFor({state:'hidden'});const canvas=game.locator('canvas[data-x]');
 await clickWorld(canvas,[146,277]);await game.getByText('Obstacle : vise un point à côté pour le contourner.',{exact:true}).waitFor();
 await canvas.evaluate(async c=>{let last='',stable=0;while(stable<8){await new Promise(r=>setTimeout(r,100));const p=c.dataset.x+','+c.dataset.y;if(p===last)stable++;else stable=0;last=p;}});
 assert.match(await game.getByTestId('stars').innerText(),/0\/8/,'blocked click cannot reach star');
 const points=[[146,277],[88,192],[146,107],[288,72],[430,107],[488,192],[430,277],[288,312]];
 for(let i=0;i<points.length;i++){await walkTo(game,canvas,1,points[i]);await game.getByTestId('stars').filter({hasText:`★ ${i+1}/8`}).waitFor();}
 await game.getByText(/Fantôme personnel ·/).waitFor();await game.getByRole('button',{name:'Rejouer',exact:true}).click();await game.locator('.countdown').waitFor({state:'hidden'});
 await game.locator('canvas[data-ghost="visible"]').waitFor();
 await canvas.evaluate(async c=>{while(Number(c.dataset.ghostTime)<2500)await new Promise(r=>setTimeout(r,50));});
 const values=await canvas.evaluate(c=>({x:Number(c.dataset.x),y:Number(c.dataset.y),gx:Number(c.dataset.ghostX),gy:Number(c.dataset.ghostY)}));assert.deepEqual([values.x,values.y],[288,312]);assert(Math.hypot(values.gx-288,values.gy-312)>5);
 await page.screenshot({path:`artifacts/sparking-ghost-${width}.png`});
 await game.getByRole('button',{name:'Les 6 terrains',exact:true}).click();await game.getByRole('button',{name:'Fermer',exact:true}).click();await game.getByRole('button',{name:'Modes',exact:true}).click();await toggle.uncheck();await game.getByRole('button',{name:'Retour à la piste',exact:true}).click();await game.getByRole('button',{name:'C’est parti !',exact:true}).click();await game.locator('.countdown').waitFor({state:'hidden'});assert.equal(await canvas.getAttribute('data-ghost'),'hidden');
 console.log(`Ghost ${width}px: first lap recorded, replay moves independently, reduced-motion default and toggle work; blocked click requires manual detour.`);
}});
