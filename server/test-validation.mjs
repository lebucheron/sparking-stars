
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {validateTrace} from '../supabase/functions/sparking-api/validation.js';
import {validateWorld} from '@rarefriends/friendsdk/world';
import {createWorldMovement} from '@rarefriends/friendsdk/movement';
const bundle=await build({entryPoints:['games/sparking-stars/terrains.ts'],bundle:true,platform:'node',format:'esm',write:false});
const {terrains,distanceToRoute,startingObstacle}=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
assert.deepEqual(terrains.map(t=>t.name),['La Citadelle','La Fabrique','Les Ruines','Les Canaux','La Carrière','Le Jardin']);
assert.deepEqual(terrains.map(t=>t.level),[6,5,4,3,2,1]);
let tested=0;
for(const t of terrains)for(const gear of ['feet','rollers','kart'])for(const dt of [16.6667,90]){
 const a=t.route[0],[x,y]=startingObstacle(t),world=validateWorld({...t.world,props:[...t.world.props,{type:'crate',x,y,scale:1,footprint:{x:-12,y:-12,w:24,h:24}}]});
 const mover=createWorldMovement(world,a),trace=[[0,...a]];let time=0,next=1;
 assert(mover.moveTo(t.route[1]));
 for(let f=0;next<=t.route.length&&f<30000;f++){
  const prev=mover.state.position,road=distanceToRoute(prev,t.route)>t.width/2?Math.max(.38,.8-(t.level-1)*.08):1;
  let budget=Math.min(100,dt)*road*(gear==='feet'?1:gear==='rollers'?1.2:1.45);
  while(budget>0){const slice=Math.min(40,budget);mover.update(slice);budget-=slice;}
  time+=dt;const point=mover.state.position;trace.push([time,...point]);const target=t.route[next%t.route.length];
  if(Math.hypot(point[0]-target[0],point[1]-target[1])<t.reach){next++;if(next<=t.route.length)assert(mover.moveTo(t.route[next%t.route.length]));}
 }
 assert.equal(next,t.route.length+1,`Completed GEN ${t.gen}`);
 assert.equal(validateTrace(t.gen,gear,trace),Math.round(time),`GEN ${t.gen} ${gear} ${dt}`);
 assert.throws(()=>validateTrace(t.gen,gear,trace.map(([time,x,y])=>[time*.5,x,y])),'speed hack');
 assert.throws(()=>validateTrace(t.gen,gear,[trace[0],trace.at(-1)]),'skip checkpoints');
 const corrupted=structuredClone(trace);corrupted[2][1]=10000;assert.throws(()=>validateTrace(t.gen,gear,corrupted),'teleport');
 assert.throws(()=>validateTrace(t.gen,gear,[...trace,trace.at(-1)]),'duplicate timestamp');
 tested++;
}
for(const bad of [null,{},[],[[0,1,1],[NaN,2,3]],new Array(40001).fill([0,1,1])])assert.throws(()=>validateTrace(1,'feet',bad));
console.log(`${tested} real-physics runs passed (6 GEN × 3 categories × 2 frame rates); speed, teleport, missing stars, malformed traces rejected.`);
