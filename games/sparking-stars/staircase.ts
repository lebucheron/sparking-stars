import {project,type WorldPoint} from '@rarefriends/friendsdk/world';
export type Staircase={first:number;last:number;reach:number};
export const isStair=(stairs:Staircase|undefined,next:number)=>!!stairs&&next>=stairs.first&&next<=stairs.last;
/** Only a fresh press on the current tread authorizes its checkpoint. */
export function stairPress(stairs:Staircase|undefined,route:readonly WorldPoint[],next:number,destination:WorldPoint){
 return isStair(stairs,next)&&Math.hypot(destination[0]-route[next][0],destination[1]-route[next][1])<=22;
}
export function drawStaircase(ctx:CanvasRenderingContext2D,stairs:Staircase|undefined,route:readonly WorldPoint[],next:number){
 if(!stairs)return;ctx.save();ctx.lineWidth=2;ctx.strokeStyle='#29262b';
 for(let i=stairs.first;i<=stairs.last;i++){
  const [x,y]=route[i],corners=[[x-17,y-13],[x+17,y-13],[x+17,y+13],[x-17,y+13]].map(([a,b])=>project(a,b));
  // Raised stone faces below the walkable top keep click and foot anchors aligned.
  ctx.beginPath();ctx.moveTo(...corners[1]);ctx.lineTo(...corners[2]);ctx.lineTo(...corners[3]);ctx.lineTo(corners[3][0],corners[3][1]+8);ctx.lineTo(corners[2][0],corners[2][1]+8);ctx.lineTo(corners[1][0],corners[1][1]+8);ctx.closePath();ctx.fillStyle='#625c67';ctx.fill();ctx.stroke();
  ctx.beginPath();corners.forEach(([a,b],j)=>j?ctx.lineTo(a,b):ctx.moveTo(a,b));ctx.closePath();ctx.fillStyle=i<next?'#b1a7b9':i===next?'#e7ddec':'#cbc3d0';ctx.fill();ctx.stroke();
 }
 ctx.restore();
}
