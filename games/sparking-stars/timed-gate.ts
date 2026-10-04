import {project,type WorldPoint} from '@rarefriends/friendsdk/world';
export type TimedGate={rect:number[];period:number;open:number};
export const gateOpen=(gate:TimedGate,elapsed:number)=>elapsed%gate.period<gate.open;
/** Temporary gate collision; a closing gate never traps a Friend already in its slab. */
export function gateAllows(gate:TimedGate|undefined,elapsed:number,from:WorldPoint,to:WorldPoint){
 if(!gate||gateOpen(gate,elapsed))return true;
 const [x,y,w,h]=gate.rect,minX=x-7,maxX=x+w+7,minY=y-7,maxY=y+h+7;
 if(from[0]>=minX&&from[0]<=maxX&&from[1]>=minY&&from[1]<=maxY)return true;
 let enter=0,exit=1;
 for(const [a,b,min,max]of [[from[0],to[0],minX,maxX],[from[1],to[1],minY,maxY]]){
  const d=b-a;if(Math.abs(d)<1e-10){if(a<min||a>max)return true;continue;}
  const p=(min-a)/d,q=(max-a)/d;enter=Math.max(enter,Math.min(p,q));exit=Math.min(exit,Math.max(p,q));
 }
 return enter>exit;
}
export function drawTimedGate(ctx:CanvasRenderingContext2D,gate:TimedGate|undefined,elapsed:number){
 if(!gate)return;
 const open=gateOpen(gate,elapsed),[x,y,w,h]=gate.rect;ctx.canvas.dataset.gateOpen=String(open);
 const [ax,ay]=project(x,y+h/2),[bx,by]=project(x+w,y+h/2);
 ctx.save();ctx.lineCap='round';ctx.strokeStyle='#302d32';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(ax,ay-8);ctx.lineTo(open?ax+(bx-ax)*.12:bx,open?ay+(by-ay)*.12-8:by-8);ctx.stroke();
 if(open){ctx.beginPath();ctx.moveTo(bx-(bx-ax)*.12,by-(by-ay)*.12-8);ctx.lineTo(bx,by-8);ctx.stroke();}
 else{ctx.strokeStyle='#a6a0a6';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(ax,ay-10);ctx.lineTo(bx,by-10);ctx.stroke();}
 ctx.restore();
}
