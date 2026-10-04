import {project,type WorldPoint} from '@rarefriends/friendsdk/world';
type Road={points:WorldPoint[];width:number};
type Track={route:readonly WorldPoint[];width:number;forkSegments?:number[];sidePaths?:number[][][];sideWidths?:number[]};
/** Paint the complete network in passes so a later road cannot draw a wall over a junction. */
export function drawRoadNetwork(ctx:CanvasRenderingContext2D,track:Track){
 const roads:Road[]=[],closed=[...track.route,track.route[0]];
 let points:WorldPoint[]=[closed[0]];
 for(let i=1;i<closed.length;i++){
  if(track.forkSegments?.includes(i)){if(points.length>1)roads.push({points,width:track.width});points=[closed[i]];}
  else points.push(closed[i]);
 }
 if(points.length>1)roads.push({points,width:track.width});
 for(const [i,path]of (track.sidePaths??[]).entries())roads.push({points:path.map(([x,y])=>[x,y]),width:track.sideWidths?.[i]??22});
 ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
 const trace=(road:Road)=>{ctx.beginPath();road.points.forEach((p,i)=>{const [x,y]=project(...p);if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y);});};
 for(const pass of ['edge','surface','center']){
  ctx.strokeStyle=pass==='surface'?'#fff':'#000';ctx.setLineDash(pass==='center'?[6,10]:[]);
  for(const road of roads){trace(road);ctx.lineWidth=pass==='edge'?road.width+6:pass==='surface'?road.width:1.5;ctx.stroke();}
 }
 ctx.restore();
}
