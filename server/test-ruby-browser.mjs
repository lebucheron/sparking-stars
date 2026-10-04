import assert from 'node:assert/strict';
import {testGame} from '../games/sparking-stars/test-profile-helper.mjs';
await testGame('games/sparking-stars',{publicHost:true,profile:{generation:6,tier:0},width:1000,height:850,check:async({page,game})=>{
 await game.locator('.race-start').click();await game.locator('.countdown').waitFor({state:'hidden'});const canvas=game.locator('canvas[data-x]');
 assert.equal(await canvas.getAttribute('data-ruby-x'),'280');assert.equal(await canvas.getAttribute('data-ruby-y'),'205');
 await page.screenshot({path:'../../outputs/gen5-preview-1000.png'});
 await game.locator('canvas[data-ruby-away="true"]').waitFor();assert.equal(await canvas.getAttribute('data-ruby-x'),'100');assert.equal(await canvas.getAttribute('data-ruby-y'),'245');
 await page.screenshot({path:'../../outputs/gen5-ruby-visit.png'});await game.locator('canvas[data-ruby-away="false"]').waitFor();assert.equal(await canvas.getAttribute('data-ruby-x'),'280');
 await game.getByRole('button',{name:'Recommencer',exact:true}).click();await game.locator('.countdown').waitFor();assert.equal(await canvas.getAttribute('data-ruby-away'),'false');assert.equal(await canvas.getAttribute('data-ruby-x'),'280');
 console.log('PASS browser ruby: rendered at one position, surprise visit, home return and reset; actual GEN6 Friend drives GEN5 preview.');
}});
