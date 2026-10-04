import {project,type WorldConfig} from '@rarefriends/friendsdk/world';

/** Fit the island itself instead of reserving a mostly empty 3:2 export canvas. */
export function courseCamera(world:WorldConfig){
 const ground=world.geometry.polygons.flatMap(p=>p.map(([x,y])=>project(x,y)));
 const minX=Math.min(...ground.map(p=>p[0]))-24,maxX=Math.max(...ground.map(p=>p[0]))+24;
 const minY=Math.min(...ground.map(p=>p[1]))-88,maxY=Math.max(...ground.map(p=>p[1]))+world.geometry.depth+26;
 return {x:minX,y:minY,width:maxX-minX,height:maxY-minY};
}
