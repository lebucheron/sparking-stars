import assert from 'node:assert/strict';
import {testGame} from '../games/sparking-stars/test-profile-helper.mjs';
for(const [width,height] of [[844,390],[960,408],[390,844]])await testGame('games/sparking-stars',{publicHost:true,profile:{generation:3,tier:0},width,height,check:async({page,game})=>{
 await game.getByRole('button',{name:'C’est parti !',exact:true}).click();await game.locator('.countdown').waitFor({state:'hidden'});
 const world=await game.locator('.rf-world-view').boundingBox(),status=await game.locator('.race-status').boundingBox(),hud=await game.locator('.hud').boundingBox();
 assert(world.y>=hud.y+hud.height,'track below HUD');assert(world.y+world.height<=status.y,'track above controls');
 assert.equal(await game.locator('.hint').isVisible(),false);assert.equal(await game.getByRole('button',{name:'Courir',exact:true}).isVisible(),false);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 const canvas=game.locator('canvas[data-x]');const b=await canvas.boundingBox();await canvas.click({position:{x:b.width*.5,y:b.height*.5}});
 await page.screenshot({path:`artifacts/mobile-fixed-${width}.png`});
 await game.getByRole('button',{name:'Recommencer',exact:true}).click();await game.locator('.countdown').waitFor();
 console.log(`Mobile ${width}x${height}: track, HUD and controls separated; restart accessible.`);
}});
