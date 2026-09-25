import {mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {testGame} from './test-profile-helper.mjs';
import {project} from '@rarefriends/friendsdk/world';
const out='/tmp/sparking-stars-test-artifacts';
await mkdir(out,{recursive:true});
await testGame('games/sparking-stars',{width:390,height:850,timeout:25000,check:async({page,game})=>{
 const canvas=game.locator('canvas[data-x]');await canvas.waitFor();
 await game.getByRole('button',{name:'C’est parti !',exact:true}).click();await canvas.waitFor();
 await game.locator('.countdown').waitFor();
 const before=await canvas.getAttribute('data-x');
 await page.keyboard.down('ArrowRight');await page.waitForTimeout(350);await page.keyboard.up('ArrowRight');
 assert.equal(await canvas.getAttribute('data-x'),before,'No movement during countdown');
 assert.equal(await game.getByTestId('timer').textContent(),'0.000 s','Countdown excluded from timer');
 await page.locator('.rf-game-frame').screenshot({path:`${out}/countdown.png`});
 await game.locator('.countdown').waitFor({state:'hidden'});
 const points=[[146,277],[88,192],[146,107],[288,72],[430,107],[488,192],[430,277],[288,312]];
 for(let i=0;i<points.length;i++){const b=await canvas.boundingBox(),[x,y]=project(...points[i]);await canvas.tap({position:{x:(x-220)*b.width/1160,y:(y-265)*b.height/(1160/1.5)}});await game.getByTestId('stars').filter({hasText:`★ ${i+1}/8`}).waitFor();}
 await game.getByTestId('prize').waitFor();
 assert.equal(await game.locator('.medal-targets').count(),1);
 const fits=await game.locator('.race-card').evaluate(el=>{const a=el.getBoundingClientRect(),b=document.querySelector('.hint').getBoundingClientRect();return a.bottom<b.top&&a.left>=0&&a.right<=innerWidth;});assert.ok(fits,'Finish card does not overlap footer');
 await page.locator('.rf-game-frame').screenshot({path:`${out}/finish-mobile.png`});
 console.log('Countdown input lock, fair timer, full lap and mobile finish layout passed');
}});
