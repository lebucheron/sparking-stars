import assert from 'node:assert/strict';
import {testGame} from '../games/sparking-stars/test-profile-helper.mjs';
for(const [width,height,denied] of [[1366,768,false],[844,390,true],[390,844,true]])await testGame('games/sparking-stars',{publicHost:true,profile:{generation:3,tier:0},width,height,check:async({page,game})=>{
 if(denied)await page.evaluate(()=>{Element.prototype.requestFullscreen=async()=>{throw new Error('unsupported');};});
 await page.getByRole('button',{name:'Agrandir la course',exact:true}).click();
 await game.locator('html.race-focus').waitFor();assert.equal(await game.getByRole('button',{name:'Courir',exact:true}).isVisible(),false);assert.equal(await page.locator('.rf-frame-toolbar').isVisible(),false);
 assert.equal(await page.evaluate(()=>Boolean(document.fullscreenElement)),!denied);
 await game.getByRole('button',{name:'C’est parti !',exact:true}).click();await game.locator('.countdown').waitFor({state:'hidden'});
 await page.screenshot({path:`artifacts/race-focus-${width}.png`});
 const world=await game.locator('.rf-world-view').boundingBox(),controls=await game.locator('.race-status').boundingBox();assert(world.y+world.height<=controls.y);
 const exit=page.getByRole('button',{name:'Quitter la vue course',exact:true});const b=await exit.boundingBox();assert(b.x>=0&&b.y>=0&&b.x+b.width<=width&&b.y+b.height<=height);
 await exit.click();await game.locator('html.race-focus').waitFor({state:'detached'});assert(await page.locator('.rf-frame-toolbar').isVisible());
 console.log(`Focus ${width}x${height}: native/fallback, hidden lobby, race and exit verified.`);
}});
