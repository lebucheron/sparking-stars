
// Automated test driver explicitly clicks each detour waypoint. No such planner ships in game controls.
import {build} from 'esbuild';
import {project,validateWorld} from '@rarefriends/friendsdk/world';
import {createWorldNavigator} from '@rarefriends/friendsdk/navigation';
const compiled=await build({entryPoints:['games/sparking-stars/terrains.ts'],bundle:true,platform:'node',format:'esm',write:false});
const {terrains}=await import('data:text/javascript;base64,'+Buffer.from(compiled.outputFiles[0].text).toString('base64'));
export async function clickWorld(canvas,point){const box=await canvas.boundingBox(),[x,y]=project(...point);await canvas.click({position:{x:(x-220)*box.width/1160,y:(y-265)*box.height/(1160/1.5)}});}
export async function walkTo(game,canvas,gen,to){
 const t=terrains[gen-1],a=t.route[0],b=t.route[1],world=validateWorld({...t.world,props:[...t.world.props,{type:'crate',x:(a[0]+b[0])/2,y:(a[1]+b[1])/2,scale:1,footprint:{x:-12,y:-12,w:24,h:24}}]});
 const from=await canvas.evaluate(c=>[Number(c.dataset.x),Number(c.dataset.y)]),path=createWorldNavigator(world,7).route(from,to);
 if(!path)throw new Error('No test path');
 for(const point of path){await clickWorld(canvas,point);await canvas.evaluate(async(c,p)=>{const until=performance.now()+15000;while(performance.now()<until){if(Math.hypot(Number(c.dataset.x)-p[0],Number(c.dataset.y)-p[1])<1||document.querySelector('.race-card.finished'))return;await new Promise(r=>setTimeout(r,25));}throw new Error('Manual waypoint not reached');},point);}
}
