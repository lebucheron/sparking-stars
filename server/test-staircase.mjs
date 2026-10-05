import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {project} from '@rarefriends/friendsdk/world';
import {testGame} from '../games/sparking-stars/test-profile-helper.mjs';
import {walkTo,clickWorld} from './test-drive.mjs';
const track=JSON.parse(await readFile('games/sparking-stars/terrains.json','utf8'))[2];
for(const width of [1000,390])await testGame('games/sparking-stars',{publicHost:true,profile:{generation:6,tier:0},width,height:width===390?844:850,check:async({page,game})=>{
 await game.locator('.race-start').click();await game.locator('.countdown').waitFor({state:'hidden'});
 const canvas=game.locator('canvas[data-x]'),touch=width===390;
 await walkTo(game,canvas,3,track.route[1],touch);
 // Walking across a tread without pressing it must not award its star.
 await walkTo(game,canvas,3,[85,275],touch);await walkTo(game,canvas,3,[85,215],touch);
 assert.equal(await game.getByTestId('stars').innerText(),'★ 1/16');
 await walkTo(game,canvas,3,track.route[2],touch);assert.equal(await game.getByTestId('stars').innerText(),'★ 2/16');
 if(!touch){
  const screen=async point=>{const box=await canvas.boundingBox(),[x,y]=project(...point),v=await canvas.evaluate(c=>({x:+c.dataset.viewX,y:+c.dataset.viewY,w:+c.dataset.viewWidth,h:+c.dataset.viewHeight}));return [box.x+(x-v.x)*box.width/v.w,box.y+(y-v.y)*box.height/v.h];};
  // One held click cannot arm the following tread by moving the cursor onto it.
  await page.mouse.move(...await screen(track.route[2]));await page.mouse.down();await page.mouse.move(...await screen(track.route[3]));
  await canvas.evaluate(async(c,p)=>{const end=performance.now()+7000;while(performance.now()<end){if(Math.hypot(+c.dataset.x-p[0],+c.dataset.y-p[1])<2)return;await new Promise(r=>setTimeout(r,25));}throw Error('Held cursor did not reach next tread');},track.route[3]);
  assert.equal(await game.getByTestId('stars').innerText(),'★ 2/16');await page.mouse.up();
 }
 for(let i=3;i<=7;i++){await walkTo(game,canvas,3,track.route[i],touch);assert.equal(await game.getByTestId('stars').innerText(),`★ ${i}/16`);}
 await page.screenshot({path:`../../outputs/gen3-stairs-${width}.png`});
 await game.getByRole('button',{name:'Quitter la course',exact:true}).click();await game.locator('.race-start').click();await game.locator('.countdown').waitFor({state:'hidden'});
 await walkTo(game,canvas,3,track.route[1],touch);await walkTo(game,canvas,3,[85,275],touch);await walkTo(game,canvas,3,[85,215],touch);assert.equal(await game.getByTestId('stars').innerText(),'★ 1/16','Restart clears authorization');
 console.log(`PASS stairs ${width}px: six alternating fresh presses, walking/held movement cannot collect, restart clears progress.`);
}});
