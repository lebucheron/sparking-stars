import {getWorldPreset,validateWorld,type WorldPoint,type WorldPropType} from "@rarefriends/friendsdk/world";
import definitions from "./terrains.json";
const garden=getWorldPreset("01-garden-oval-complete");
export const terrains=definitions.map((d,index)=>{
 const route=d.route.map(([x,y]):WorldPoint=>[x,y]);
 const holes=d.holes.map(([x,y,w,h])=>[[x,y],[x+w,y],[x+w,y+h],[x,y+h]]);
 const world=validateWorld({...garden,id:`sparking-gen-${index+1}`,name:d.name,actors:[],signals:[],missingChunks:[],
 geometry:{polygons:[d.shape],holes,depth:18+(d.level-1)*3},
 // Fork circuits paint the complete network together, avoiding duplicate SDK outlines.
 paths:d.sidePaths?[]:[{points:[...route,route[0]],width:d.width}],patches:[],
 props:d.props.map(([type,x,y,scale])=>({type:type as WorldPropType,x:Number(x),y:Number(y),scale:Number(scale)})),
 collision:{blocked:d.blocks.map(([x,y,w,h])=>({x,y,w,h}))}});
 return {...d,route,world,gen:index+1};
});
export function startingObstacle(t:typeof terrains[number]):WorldPoint{
 if(t.startingObstacle)return [t.startingObstacle[0],t.startingObstacle[1]];
 const [a,b]=t.route;return [(a[0]+b[0])/2,(a[1]+b[1])/2];
}
export function distanceToRoute(point:WorldPoint,route:readonly WorldPoint[]){
 return Math.min(...route.map((a,i)=>{const b=route[(i+1)%route.length],dx=b[0]-a[0],dy=b[1]-a[1];
 const t=Math.max(0,Math.min(1,((point[0]-a[0])*dx+(point[1]-a[1])*dy)/(dx*dx+dy*dy)));
 return Math.hypot(point[0]-a[0]-t*dx,point[1]-a[1]-t*dy);}));
}
export function distanceToTrack(point:WorldPoint,t:typeof terrains[number]){
 return Math.min(distanceToRoute(point,t.route),...(t.sidePaths??[]).map((path,i)=>distanceToRoute(point,path.map(([x,y]):WorldPoint=>[x,y]))+t.width/2-(t.sideWidths?.[i]??22)/2));
}
