import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {build} from 'esbuild';
import {createWorldMovement} from '@rarefriends/friendsdk/movement';
const d=JSON.parse(await readFile('games/sparking-stars/terrains.json','utf8')),r=d[4].movingRuby;
const compiled=await build({entryPoints:['games/sparking-stars/moving-ruby.ts'],bundle:true,platform:'node',format:'esm',write:false});
const {rubyState,rubyAllows}=await import('data:text/javascript;base64,'+Buffer.from(compiled.outputFiles[0].text).toString('base64'));
const cycle=r.rest+r.visit;
for(let i=0;i<r.spots.length;i++){
 assert.deepEqual(rubyState(r,i*cycle).position,r.home,'Always returns to center before visiting next spot');
 assert.deepEqual(rubyState(r,i*cycle+r.rest).position,r.spots[i],'Exactly one predictable visit');
 assert.deepEqual(rubyState(r,(i+1)*cycle).position,r.home,'Visit ends back at center');
}
assert.deepEqual(rubyState(r,cycle*r.spots.length).position,r.home,'Cycle repeats');assert(!('warning' in rubyState(r,r.rest-1)),'No advance signal');
assert.equal(rubyAllows(r,r.rest,[100,275],[100,215]),false,'A full segment cannot tunnel through the visiting crystal');
assert.equal(rubyAllows(r,0,[100,275],[100,215]),true,'Road is free after crystal returns home');
assert.equal(rubyAllows(r,r.rest,[100,246],[100,260]),true,'Appearance over a Friend allows escape');
assert.equal(rubyAllows(r,r.rest,[100,246],[100,245]),false,'Cannot move deeper into the crystal');
const terrainBundle=await build({entryPoints:['games/sparking-stars/terrains.ts'],bundle:true,platform:'node',format:'esm',write:false});
const {terrains}=await import('data:text/javascript;base64,'+Buffer.from(terrainBundle.outputFiles[0].text).toString('base64'));
for(const dt of [16.667,90]){
 let elapsed=r.rest,blocks=0;const m=createWorldMovement(terrains[4].world,[100,265],{canTraverse:(a,b)=>{const ok=rubyAllows(r,elapsed,a,b);if(!ok)blocks++;return ok;}});m.moveTo([100,220]);
 for(let frame=0;frame<500&&m.state.destination;frame++){let budget=Math.min(100,dt);while(budget>0){const slice=Math.min(40,budget);m.update(slice);budget-=slice;}elapsed+=dt;}
 assert(blocks>0);assert.equal(m.state.destination,null,'Click remains pending until the crystal returns home');
}
console.log('PASS roaming ruby: single position, predictable visits with home between each, no signal, collision, escape and low-FPS crossing.');
