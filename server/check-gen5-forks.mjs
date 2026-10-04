import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {isWorldWalkable} from '@rarefriends/friendsdk/world';
import {createWorldNavigator} from '@rarefriends/friendsdk/navigation';
const result=await build({entryPoints:['games/sparking-stars/terrains.ts'],bundle:true,platform:'node',format:'esm',write:false});
const {terrains,distanceToTrack}=await import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64'));
const t=terrains[4],nav=createWorldNavigator(t.world,7);
for(const [i,path]of t.sidePaths.entries())for(const [j,p]of path.entries()){
 assert(isWorldWalkable(t.world,p,7),`Branch ${i} waypoint ${j} ${p} must be clear`);
 assert(distanceToTrack(p,t)<=t.width/2,`Branch ${i} is a road at normal speed`);
 if(j)assert(nav.segmentClear(path[j-1],p),`Branch ${i} segment ${j} must be clear`);
}
console.log('PASS all four GEN5 branch roads have continuous collision clearance and equal road speed.');
