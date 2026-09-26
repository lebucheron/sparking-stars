
import {validateWorld,project,isWorldWalkable,type WorldPoint} from '@rarefriends/friendsdk/world';
import {createWorldNavigator} from '@rarefriends/friendsdk/navigation';
import {terrains,distanceToRoute} from '../games/sparking-stars/terrains';
export {RULES} from '../games/sparking-stars/rules-version';
const worlds=terrains.map(t=>{const a=t.route[0],b=t.route[1];return validateWorld({...t.world,props:[...t.world.props,{type:'crate',x:(a[0]+b[0])/2,y:(a[1]+b[1])/2,scale:1,footprint:{x:-12,y:-12,w:24,h:24}}]});});
const navigators=worlds.map(w=>createWorldNavigator(w,7));
export function validateTrace(gen:number,equipment:string,trace:unknown):number{
 const reject=()=>{throw new Error('Parcours refusé : trajectoire ou chronométrage incohérent.');};
 if(!Number.isInteger(gen)||gen<1||gen>6||!['feet','rollers','kart'].includes(equipment)||!Array.isArray(trace)||trace.length<3||trace.length>40000)return reject();
 const t=terrains[gen-1],world=worlds[gen-1],nav=navigators[gen-1],pace=equipment==='kart'?1.45:equipment==='rollers'?1.2:1;
 let previous:WorldPoint=t.route[0],last=0,next=1;
 for(let i=0;i<trace.length;i++){
  const row=trace[i];if(!Array.isArray(row)||row.length!==3||!row.every(v=>typeof v==='number'&&Number.isFinite(v)))return reject();
  const [time,x,y]=row,point:WorldPoint=[x,y];
  if(i===0){if(time!==0||Math.hypot(x-previous[0],y-previous[1])>.001)return reject();continue;}
  const delta=time-last;if(delta<=0||time>600000||!isWorldWalkable(world,point,7)||!nav.segmentClear(previous,point))return reject();
  const [ax,ay]=project(...previous),[bx,by]=project(x,y);
  const road=distanceToRoute(previous,t.route)>t.width/2?Math.max(.38,.8-(gen-1)*.08):1;
  if(Math.hypot(bx-ax,by-ay)>170*.001*Math.min(100,delta)*pace*road*1.005+.002)return reject();
  const target=t.route[next%t.route.length];
  if(Math.hypot(x-target[0],y-target[1])<t.reach)next++;
  if(next>t.route.length&&i!==trace.length-1)return reject();
  previous=point;last=time;
 }
 if(next!==t.route.length+1||last<1000)return reject();return Math.round(last);
}
