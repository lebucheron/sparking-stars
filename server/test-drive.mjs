
// Automated test driver explicitly clicks each detour waypoint. No such planner ships in game controls.
import {build} from 'esbuild';
import {project,validateWorld} from '@rarefriends/friendsdk/world';
import {createWorldNavigator} from '@rarefriends/friendsdk/navigation';
const compiled=await build({entryPoints:['games/sparking-stars/terrains.ts'],bundle:true,platform:'node',format:'esm',write:false});
const {terrains,startingObstacle}=await import('data:text/javascript;base64,'+Buffer.from(compiled.outputFiles[0].text).toString('base64'));
export async function clickWorld(canvas,point,touch=false){const box=await canvas.boundingBox(),[x,y]=project(...point),view=await canvas.evaluate(c=>({x:Number(c.dataset.viewX),y:Number(c.dataset.viewY),width:Number(c.dataset.viewWidth),height:Number(c.dataset.viewHeight)}));await canvas[touch?'tap':'click']({position:{x:(x-view.x)*box.width/view.width,y:(y-view.y)*box.height/view.height}});}
export async function walkTo(game,canvas,gen,to,touch=false){
 const t=terrains[gen-1],[x,y]=startingObstacle(t),world=validateWorld({...t.world,props:[...t.world.props,{type:'crate',x,y,scale:1,footprint:{x:-12,y:-12,w:24,h:24}}]});
 const from=await canvas.evaluate(c=>[Number(c.dataset.x),Number(c.dataset.y)]),path=createWorldNavigator(world,7).route(from,to);
 if(!path)throw new Error('No test path');
 for(const point of path){await clickWorld(canvas,point,touch);await canvas.evaluate(async(c,p)=>{const until=performance.now()+15000;while(performance.now()<until){if(Math.hypot(Number(c.dataset.x)-p[0],Number(c.dataset.y)-p[1])<1||document.querySelector('.race-card.finished'))return;await new Promise(r=>setTimeout(r,25));}throw new Error('Manual waypoint not reached');},point);}
}
