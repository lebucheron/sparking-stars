import {project,type WorldPoint} from '@rarefriends/friendsdk/world';
export type MovingBush={center:number[];direction:number[];amplitude:number;period:number;radius:number};
export function bushPosition(bush:MovingBush,elapsed:number):WorldPoint{
 const offset=-bush.amplitude*Math.cos(elapsed/bush.period*Math.PI*2);
 return [bush.center[0]+bush.direction[0]*offset,bush.center[1]+bush.direction[1]*offset];
}
/** Swept character segment, expanded by the same seven-unit movement radius. */
export function bushAllows(bush:MovingBush|undefined,elapsed:number,from:WorldPoint,to:WorldPoint){
 if(!bush)return true;
 const [x,y]=bushPosition(bush,elapsed),radius=bush.radius+7;
 const a=Math.hypot(from[0]-x,from[1]-y),b=Math.hypot(to[0]-x,to[1]-y);
 // If the shrub moved onto the Friend, allow escape without pushing or teleporting.
 if(a<radius)return b>a;
 const dx=to[0]-from[0],dy=to[1]-from[1],length=dx*dx+dy*dy;
 const t=length?Math.max(0,Math.min(1,((x-from[0])*dx+(y-from[1])*dy)/length)):0;
 return Math.hypot(from[0]+t*dx-x,from[1]+t*dy-y)>=radius;
}
export function drawMovingBush(ctx:CanvasRenderingContext2D,bush:MovingBush|undefined,elapsed:number){
 if(!bush)return;
 const point=bushPosition(bush,elapsed),[x,y]=project(...point);
 ctx.canvas.dataset.bushX=String(point[0]);ctx.canvas.dataset.bushY=String(point[1]);
 ctx.save();ctx.fillStyle='#242b2455';ctx.beginPath();ctx.ellipse(x,y,17,8,0,0,Math.PI*2);ctx.fill();
 ctx.strokeStyle='#29352b';ctx.lineWidth=2;ctx.fillStyle='#58694e';
 ctx.beginPath();ctx.moveTo(x-16,y-5);ctx.lineTo(x-18,y-15);ctx.lineTo(x-10,y-18);ctx.lineTo(x-8,y-25);ctx.lineTo(x+2,y-27);ctx.lineTo(x+8,y-22);ctx.lineTo(x+16,y-20);ctx.lineTo(x+19,y-10);ctx.lineTo(x+12,y-3);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.fillStyle='#89977a';ctx.fillRect(x-9,y-17,5,3);ctx.fillRect(x+3,y-20,4,3);ctx.fillStyle='#344530';ctx.fillRect(x+6,y-10,6,3);ctx.restore();
}
