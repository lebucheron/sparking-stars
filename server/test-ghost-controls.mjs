
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {validateWorld} from '@rarefriends/friendsdk/world';
import {createWorldMovement} from '@rarefriends/friendsdk/movement';
async function load(path){const result=await build({entryPoints:[path],bundle:true,platform:'node',format:'esm',write:false});return import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64'));}
const {makeGhost,sampleGhost,betterGhost,ghostKey}=await load('games/sparking-stars/ghost.ts');
const {createDirectClick}=await load('games/sparking-stars/direct-click.ts');
const {terrains}=await load('games/sparking-stars/terrains.ts');
const points=[[0,10,20],[1000,20,40],[2000,40,80]],ghost=makeGhost(points);
assert.deepEqual(sampleGhost(ghost,500).position,[15,30]);assert.equal(sampleGhost(ghost,2001),null);assert.equal(sampleGhost(ghost,-1),null);
assert.deepEqual(sampleGhost(ghost,1000),sampleGhost(ghost,1000),'paused clock does not advance');
points[1][1]=99;assert.equal(sampleGhost(ghost,1000).position[0],20,'immutable copy');
assert.equal(betterGhost(ghost,makeGhost([[0,0,0],[3000,5,5]])),ghost);
assert.equal(betterGhost(ghost,makeGhost([[0,0,0],[2000,5,5]])),ghost,'tie preserves original');
assert.equal(betterGhost(ghost,null),ghost);assert.equal(makeGhost([[0,0,0],[0,5,5]]),null);
assert.notEqual(ghostKey('1',3,'ranked','feet','v1'),ghostKey('1',3,'training','feet','v1'));
assert.notEqual(ghostKey('1',3,'ranked','feet','v1'),ghostKey('2',3,'ranked','feet','v1'));
for(const t of terrains){
 const a=t.route[0],b=t.route[1],wall=[(a[0]+b[0])/2,(a[1]+b[1])/2];
 const world=validateWorld({...t.world,props:[...t.world.props,{type:'crate',x:wall[0],y:wall[1],scale:1,footprint:{x:-12,y:-12,w:24,h:24}}]});
 const aim=createDirectClick(world)(a,b);assert(aim.blocked,`GEN ${t.gen}: obstacle detected`);
 assert(Math.abs((aim.target[0]-a[0])*(b[1]-a[1])-(aim.target[1]-a[1])*(b[0]-a[0]))<.001,'no sideways detour');
 const mover=createWorldMovement(world,a);assert(mover.moveTo(aim.target));for(let n=0;n<500;n++)mover.update(40);
 assert(Math.hypot(mover.state.position[0]-aim.target[0],mover.state.position[1]-aim.target[1])<.01);
 assert(Math.hypot(mover.state.position[0]-b[0],mover.state.position[1]-b[1])>30,'cannot auto-cross');
}
console.log('Ghost interpolation, pause, immutable best, category isolation; direct clicks stop before all 6 starting obstacles.');
