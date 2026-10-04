import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {testGame} from '../games/sparking-stars/test-profile-helper.mjs';
import {clickWorld,walkTo} from './test-drive.mjs';
const result=await build({entryPoints:['games/sparking-stars/hidden-bridge.ts'],bundle:true,platform:'node',format:'esm',write:false});
const {bridgeVisible}=await import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64'));
const bridge={star:3,period:4000,visible:2300,basin:[145,125,260,126]};
assert(bridgeVisible(bridge,0));assert(!bridgeVisible(bridge,2300));assert(bridgeVisible(bridge,4000));assert(bridgeVisible(undefined,2300));
for(const width of [1000,390])await testGame('games/sparking-stars',{publicHost:true,profile:{generation:6,tier:0},width,height:width===390?844:850,check:async({page,game})=>{
 await game.locator('.race-start').click();await game.locator('.countdown').waitFor({state:'hidden'});const canvas=game.locator('canvas[data-x]');
 await walkTo(game,canvas,4,[110,310],width===390);await walkTo(game,canvas,4,[85,178],width===390);await walkTo(game,canvas,4,[250,178],width===390);
 assert.equal(await game.getByTestId('stars').innerText(),'★ 2/13');
 await game.locator('canvas[data-bridge-visible="true"]').waitFor();await page.screenshot({path:`../../outputs/gen4-bridge-visible-${width}.png`});
 await game.locator('canvas[data-bridge-visible="false"]').waitFor();assert.equal(await canvas.getAttribute('data-bridge-star-visible'),'false');await page.screenshot({path:`../../outputs/gen4-bridge-invisible-${width}.png`});
 await clickWorld(canvas,[275,178],width===390);await game.getByTestId('stars').filter({hasText:'★ 3/13'}).waitFor();assert.equal(await canvas.getAttribute('data-bridge-visible'),'false','Walks and collects the star while bridge stays invisible');
 const p=await canvas.evaluate(c=>[+c.dataset.x,+c.dataset.y]);assert(Math.hypot(p[0]-275,p[1]-178)<15);console.log(`PASS invisible bridge ${width}px: bridge/star vanish together, remain physically walkable and collectable while hidden, no hint arrow.`);
}});
